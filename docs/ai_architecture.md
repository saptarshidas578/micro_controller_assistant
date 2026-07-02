# AI Review & RAG Architecture Spec

This document describes how the AI features will be structured using the Gemini API.

## 1. AI Design Review Engine

### Execution Workflow
1. The user clicks "Review Design" in the frontend.
2. The UI packages the current `ProjectState` (active board, component instances, and current pin connections).
3. The system executes a RAG check:
   - Queries the local/Firestore Knowledge Graph for common configurations or safety reviews of this board/component pair.
   - Merges retrieved graph rules into the Gemini system prompt context.
4. Calls the Gemini API with structured JSON output enabled.

### Gemini System Prompt Template
```
You are the Safety Auditor and Embedded Systems Engineer for an AI-powered embedded platform.
You will receive a JSON representing the current project design:
- Board: {boardName}
- Added Components: {components}
- Connections: {connections}

Using this information and the hardware knowledge graph context, perform a safety check.
Do not hallucinate specs. Check:
- Power draw / limits (approximate rules: ESP32 pins draw max ~12mA-20mA, Uno max ~20mA-40mA).
- Pin configurations.
- Known issues with these components (e.g. DHT11 needs a 10k pull-up resistor if not using a pre-made module).

You must return a structured JSON response matching the schema below.
```

### JSON Response Schema
```json
{
  "safetyScore": 85,
  "verdict": "SAFE_WITH_WARNINGS",
  "issues": [
    {
      "type": "warning",
      "code": "MISSING_PULL_UP",
      "message": "DHT11 signal line usually requires a 4.7k-10k pull-up resistor. Ensure your module has one integrated, or add an external resistor."
    }
  ],
  "recommendations": [
    "Verify whether the OLED display can accept 5V logic if connected to 5V VCC, otherwise power it from 3.3V."
  ]
}
```

---

## 2. Firmware Code Generator

### Input
- Board ID and type
- Connection list (pin mappings)

### Workflow
Gemini receives the current pin configurations and translates them to functional initialization code (C++ for Arduino, or Python for MicroPython).

### System Prompt
```
You are an expert Embedded Systems Firmware Engineer.
Given the following mapping of pins:
{connectionMap}

Generate a clean, compileable Arduino C++ sketch or MicroPython file.
- Define constants for all pins based on the connection mapping.
- In setup(), initialize serial, GPIO pins with their correct modes (INPUT, OUTPUT, INPUT_PULLUP).
- Include brief stub code in loop() showing how to poll the sensors or write to actuators.
- Include comments explaining the connections.
- Output ONLY the raw source code. Do not wrap in markdown or standard text headers.
```

---

## 3. Knowledge Extraction & Graph Builder

When a project is successfully published:
1. A background event (or mock trigger) executes the parser.
2. It extracts relations: `(Board) -[CONNECTIONS]-> (Component)`.
3. If multiple users connect component X to GPIO Y on ESP32, this connection frequency is updated.
4. This forms the basis of semantic search recommendations (e.g. "Suggested pins for SSD1306 on ESP32: SDA=GPIO21, SCL=GPIO22").
