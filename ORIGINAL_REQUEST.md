# Original User Request

## Initial Request — 2026-07-02T16:44:29Z

# Teamwork Project Prompt

An interactive visual web application demo of an AI-powered collaborative embedded systems engineering platform. Users can select development boards and components, assign GPIO pins, validate electrical compatibility, request AI reviews, generate project documentation, and browse/search a hardware knowledge graph of published designs.

Working directory: C:/Users/lenovo/.gemini/antigravity/scratch/embedded_platform_demo
Integrity mode: demo

## Requirements

### R1. Component & Board Registry UI
The application must provide a searchable registry containing at least 2 development boards (e.g., ESP32, Arduino Uno) and 5 common components (e.g., DHT11 Temperature Sensor, I2C 128x64 OLED Display, Red LED, SG90 Servo Motor, HC-SR04 Ultrasonic Sensor). Users must be able to add these boards and components to their active canvas/project.

### R2. Interactive GPIO & Protocol Pin Assignment
The system must allow users to visually or logically map connections between the selected board pins and the pins of added components. The pin assigner should handle different pin types/protocols (Digital GPIO, Analog Input, I2C SDA/SCL, SPI MOSI/MISO/SCK, Power 3.3V/5V/GND).

### R3. Electrical and Design Safety Validation
The design canvas must dynamically run validation checks on the user's pin connections and signal/power configuration. It must detect and display warnings/critical errors for:
- Voltage mismatch (e.g., connecting a 5V output to a 3.3V-only input pin).
- Dual assignment (assigning a single GPIO pin to multiple component signals).
- Missing mandatory connections (e.g., power or ground unconnected).
- Protocol pin errors (e.g., cross-connecting I2C SDA to SPI CS).

### R4. AI-Powered Design Review & Code Generation
Using the Gemini API, the platform must support:
- Design Review: Analyze the active board, components, and pin assignments to generate a structured review with a Safety Score (0-100), detailed warnings, and improvement suggestions.
- Firmware Template: Generate a complete starter firmware structure (e.g., Arduino C++ or MicroPython) mapping the active GPIO configuration and initializing the selected libraries.
- Documentation: Generate a README with a pin connection table and Bill of Materials (BOM).

### R5. Hardware Knowledge Graph & Search
The system must parse published projects, store them in a queryable mock or Firebase graph database, and let users search for component compatibility (e.g. "What components are frequently connected to ESP32 via I2C?").

## Verification Plan

### Manual / Visual Verification
1. Launch the web application locally.
2. Select a board (ESP32) and add 2 components (DHT11 and I2C OLED).
3. Connect DHT11 VCC to 5V and check for voltage warnings if the DHT11 signal goes to a 3.3V GPIO without level translation.
4. Duplicate a GPIO pin assignment and check that a warning appears in the UI.
5. Click "Review Design" and verify that the AI review panel displays a JSON-structured or clearly formatted report with a Safety Score.
6. Click "Generate Firmware" and verify a download or copyable code box appears with the correct GPIO constants.
7. Perform a query in the Search box and verify knowledge graph results populate.

## Acceptance Criteria

### Core Functionality
- [ ] Users can browse, filter, and add boards/components from a registry to a project canvas.
- [ ] Drag-and-drop or dropdown-based pin configuration maps board pins to component pins.
- [ ] Validation engine updates in real-time or upon connection change, listing warnings and errors.
- [ ] AI feature communicates with Gemini API to return design feedback, firmware templates, and project docs.
- [ ] Search interface queries the hardware knowledge base and displays relationship results.

### Code Quality & Stack
- [ ] Built using React, TypeScript, Tailwind CSS, and Firebase (Auth, Firestore).
- [ ] Firestore documents reference boards and components by ID (normalized schemas, no duplication of registry details in project documents).

## Roles and Responsibilities
The teamwork multi-agent system should organize into the following roles as specified:
1. **Solution Architect**: Responsible for entire software architecture, folder structure, API design, communication, modularity, and scalability.
2. **Database Architect**: Responsible for Firebase/Firestore database design, normalized schema, indexes, secure rules, and scalability for millions of documents.
3. **Backend Engineer**: Implements Firebase Auth, Firestore, Storage, Cloud Functions, API endpoints, and safety/security rules.
4. **Frontend Engineer**: Implements the user interface using React, TypeScript, Tailwind CSS, and interactive hardware canvas views.
5. **AI Engineer**: Handles Gemini integration, prompt engineering, RAG, knowledge graph construction, design/firmware reviews, and documentation.
6. **Embedded Systems Engineer**: Analyzes pinout protocols, board limitations, electrical constraints, and recommends proper configuration.
7. **Safety Auditor**: Validates designs for safety errors (voltage mismatch, current overload, boot pin misuse) and outputs a Safety Score (0-100), warnings, and errors.
8. **QA Engineer**: Verifies all software features, designs, and AI integration outputs, generating bug reports and improvements.
