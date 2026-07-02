# Electrical Design & Compatibility Validation Rules

The Safety Validation Engine is a client-side execution utility (`src/utils/validator.ts`) that runs rules against the active `ProjectState` model.

## Rules Checklist

### 1. Voltage Compatibility Rule
- **Rule**: If a pin of type `Power` or an output pin is connected to an input pin, their operating voltages must match.
- **Logics**:
  - If `fromPin.voltage != toPin.voltage`:
    - If `fromPin.voltage == 5.0` and `toPin.voltage == 3.3`:
      - **Level**: `ERROR`
      - **Message**: "Voltage mismatch: Connecting 5.0V output to 3.3V-sensitive input pin. Requires a level shifter."
    - If `fromPin.voltage == 3.3` and `toPin.voltage == 5.0`:
      - **Level**: `WARNING`
      - **Message**: "Voltage level warning: Connecting 3.3V logic level output to 5.0V input. The receiving device might not register high logic states reliably."

### 2. Pin Over-Allocation (Dual Assignment)
- **Rule**: A physical pin on the development board must not be connected to more than one component signal, unless it is a shared bus protocol (like I2C).
- **Logics**:
  - Count connections where `fromComponentId == 'board'` and `fromPin == boardPinName`.
  - If count > 1:
    - If the pins are categorized as protocol type `I2C` (e.g., SDA, SCL):
      - **Level**: `OK` (I2C allows bus multi-drop).
      - **Message**: "Shared bus: Multiple components sharing I2C lines."
    - If the pins are categorized as protocol type `SPI` (e.g., MOSI, MISO, SCK):
      - **Level**: `OK` (SPI allows shared lines, but Chip Select `CS` pins must be unique).
    - If any other pin type (Digital GPIO, Analog Input, Power rails):
      - If Digital/Analog:
        - **Level**: `ERROR`
        - **Message**: "Pin Conflict: Pin is assigned to multiple components. Remove overlapping connections."
      - If Power/GND:
        - **Level**: `OK` (Power rails can feed multiple devices).

### 3. Missing Mandatory Connections
- **Rule**: Every added component must have its required power (`VCC`, `VDD`, `3V3`, `5V`) and `GND` lines connected to the board, as well as mandatory signal pins.
- **Logics**:
  - For each component instance, inspect its `ComponentSpec.mandatoryPins` (e.g. `["VCC", "GND", "DATA"]`).
  - Search `ProjectState.connections` to confirm that each mandatory pin has at least one connection.
  - If a mandatory pin is missing:
    - **Level**: `ERROR`
    - **Message**: "Missing Connection: Component instance requires pin '{pinName}' to be connected."

### 4. Protocol Signal Cross-Connection
- **Rule**: Standard protocols must connect matching signal lines (e.g. I2C SDA -> Board I2C SDA, I2C SCL -> Board I2C SCL).
- **Logics**:
  - If component pin type is `I2C` and board pin type is NOT `I2C` or `Digital GPIO` (or vice-versa):
    - **Level**: `ERROR`
    - **Message**: "Protocol Mismatch: Attempting to connect I2C line to a non-compatible pin type."
  - If component pin is `Analog` and board pin type is NOT `Analog`:
    - **Level**: `ERROR`
    - **Message**: "Analog Mismatch: Connecting analog output to a digital-only pin."
