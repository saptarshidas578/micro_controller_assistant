# Project: AI-Powered Collaborative Embedded Systems Engineering Platform Demo

## Architecture
The application is structured as a client-side React SPA built with Vite, TypeScript, and Tailwind CSS. It integrates with Firebase (Auth, Firestore) for project storage and user authentication.
To ensure the application runs seamlessly in local demo mode, a local storage-backed mock Firebase client is provided if live Firebase configurations are missing.

### Key Modules
1. **Registry Module**: Static database of development boards (ESP32, Arduino Uno) and components (DHT11, OLED, SG90, HC-SR04, Red LED).
2. **Project Canvas & Pin Assigner**: React interactive component allowing users to add boards/components and map pins logically/visually.
3. **Safety Validation Engine**: Pure utility functions verifying pin configurations in real-time (voltage, protocol, dual assignment, missing connections).
4. **AI Review & Generator**: Integration with the Gemini API to analyze the current circuit state and produce a Safety Score (0-100), Arduino/MicroPython firmware, and markdown documentation.
5. **Knowledge Graph & Search**: In-memory mock/Firebase graph database indexing existing designs to answer queries about component compatibility.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | M1: Project Setup & Registry UI | Setup React+Vite+Tailwind, implement Boards & Components Registry, and setup E2E testing infra | None | IN_PROGRESS | E2E: 70b5679e, Imp: fc3b24c1 |
| 2 | M2: Canvas & Pin Connection | Implement visual/dropdown-based pin connection mapping between board pins and component pins | M1 | PLANNED | Imp: fc3b24c1 |
| 3 | M3: Safety Validation Engine | Implement real-time validation checks for voltage, dual-assignment, missing connections, and protocols | M2 | PLANNED | Imp: fc3b24c1 |
| 4 | M4: AI Design Review & Code Gen | Integrate Gemini API for safety score reviews, firmware templates, and BOM/documentation | M3 | PLANNED | Imp: fc3b24c1 |
| 5 | M5: Knowledge Graph & Search | Implement knowledge graph structures and search queries for component relations | M4 | PLANNED | Imp: fc3b24c1 |
| 6 | M6: E2E Integration & Verification | Pass 100% of E2E test suite (Tiers 1-4) and complete Tier 5 adversarial coverage hardening | M5 | PLANNED | E2E: 70b5679e, Imp: fc3b24c1 |

## Interface Contracts
### Component / Board Registry Data Model
```typescript
interface Pin {
  name: string;
  type: 'Digital' | 'Analog' | 'I2C' | 'SPI' | 'Power' | 'GND';
  voltage: 3.3 | 5.0;
  direction?: 'Input' | 'Output' | 'Bi';
}

interface ComponentSpec {
  id: string;
  name: string;
  type: 'board' | 'sensor' | 'display' | 'actuator' | 'indicator';
  pins: Pin[];
  operatingVoltage: 3.3 | 5.0;
  mandatoryPins?: string[]; // e.g., ["VCC", "GND"]
}
```

### Pin Mapping State Model
```typescript
interface Connection {
  id: string;
  fromComponentId: string; // "board" or added component ID
  fromPin: string;
  toComponentId: string;
  toPin: string;
}

interface ProjectState {
  boardId: string;
  components: { instanceId: string; specId: string }[];
  connections: Connection[];
}
```

### Safety Validation Result Model
```typescript
interface ValidationIssue {
  type: 'warning' | 'error';
  message: string;
  affectedPins: string[];
}
```

## Code Layout
- `src/`
  - `components/`
    - `BoardRegistry.tsx`
    - `ProjectCanvas.tsx`
    - `PinAssigner.tsx`
    - `SafetyValidatorPanel.tsx`
    - `AIReviewPanel.tsx`
    - `KnowledgeGraphSearch.tsx`
  - `services/`
    - `firebase.ts` (supports fallback to local storage)
    - `gemini.ts` (Gemini API client)
    - `graph.ts` (mock project graph database)
  - `utils/`
    - `validator.ts` (validation engine)
    - `registry.ts` (registry data)
  - `types/`
    - `index.ts`
  - `App.tsx`
  - `main.tsx`
- `tests/`
  - `e2e/` (opaque-box feature verification)
