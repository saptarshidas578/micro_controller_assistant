# Firestore Database Schema Design

This document details the database schema, Firestore rules, and indexes for the platform. The schema is fully normalized to avoid duplicating registry components inside project documents.

## Collections

### 1. `boards` (Registry of Development Boards)
- **Path**: `/boards/{boardId}`
- **Description**: Static or community-contributed development boards.
- **Document Structure**:
```json
{
  "name": "ESP32 DevKitC",
  "manufacturer": "Espressif",
  "operatingVoltage": 3.3,
  "pins": [
    { "name": "3V3", "type": "Power", "voltage": 3.3 },
    { "name": "GND", "type": "GND", "voltage": 0 },
    { "name": "GPIO12", "type": "Digital", "voltage": 3.3, "direction": "Bi" },
    { "name": "GPIO13", "type": "Digital", "voltage": 3.3, "direction": "Bi" },
    { "name": "GPIO21", "type": "I2C", "voltage": 3.3, "direction": "Bi", "label": "SDA" },
    { "name": "GPIO22", "type": "I2C", "voltage": 3.3, "direction": "Bi", "label": "SCL" },
    { "name": "GPIO32", "type": "Analog", "voltage": 3.3, "direction": "Input" }
  ],
  "description": "ESP32-WROOM-32D development board",
  "createdAt": "2026-07-02T16:00:00Z"
}
```

### 2. `components` (Registry of Hardware Components)
- **Path**: `/components/{componentId}`
- **Description**: Sensors, displays, actuators, and indicators.
- **Document Structure**:
```json
{
  "name": "DHT11 Temperature & Humidity Sensor",
  "type": "sensor",
  "operatingVoltage": 3.3,
  "pins": [
    { "name": "VCC", "type": "Power", "voltage": 3.3 },
    { "name": "DATA", "type": "Digital", "voltage": 3.3, "direction": "Bi" },
    { "name": "GND", "type": "GND", "voltage": 0 }
  ],
  "mandatoryPins": ["VCC", "DATA", "GND"],
  "description": "Basic, low-cost digital temperature and humidity sensor."
}
```

### 3. `projects` (User Project Designs)
- **Path**: `/projects/{projectId}`
- **Description**: User designs mapping boards, component instances, and pin connections.
- **Document Structure**:
```json
{
  "title": "Smart Greenhouse Monitor",
  "ownerId": "user_12345",
  "isPublic": true,
  "boardId": "esp32_devkitc", 
  "components": [
    {
      "instanceId": "dht11_temp_sensor_1",
      "componentId": "dht11"
    },
    {
      "instanceId": "oled_display_1",
      "componentId": "ssd1306_i2c"
    }
  ],
  "connections": [
    {
      "id": "conn_1",
      "fromComponentId": "board",
      "fromPin": "3V3",
      "toComponentId": "dht11_temp_sensor_1",
      "toPin": "VCC"
    },
    {
      "id": "conn_2",
      "fromComponentId": "board",
      "fromPin": "GND",
      "toComponentId": "dht11_temp_sensor_1",
      "toPin": "GND"
    },
    {
      "id": "conn_3",
      "fromComponentId": "board",
      "fromPin": "GPIO12",
      "toComponentId": "dht11_temp_sensor_1",
      "toPin": "DATA"
    }
  ],
  "createdAt": "2026-07-02T16:10:00Z",
  "updatedAt": "2026-07-02T16:15:00Z"
}
```

### 4. `knowledge_graph` (Extracted Engineering Knowledge)
- **Path**: `/knowledge_graph/{graphNodeId}`
- **Description**: Semantically parsed links extracting component-to-board combinations and connection probabilities.
- **Document Structure**:
```json
{
  "sourceId": "esp32_devkitc",
  "targetId": "ssd1306_i2c",
  "relationship": "COMPATIBLE_WITH",
  "protocol": "I2C",
  "frequencyUsed": 42,
  "samplePins": {
    "SDA": "GPIO21",
    "SCL": "GPIO22"
  },
  "verifiedBySafetyAuditor": true
}
```

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Board & Component Registry is read-only for public, writeable by admin
    match /boards/{boardId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /components/{componentId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User Projects rules
    match /projects/{projectId} {
      allow read: if resource.data.isPublic == true || (request.auth != null && resource.data.ownerId == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
    
    // Knowledge Graph
    match /knowledge_graph/{nodeId} {
      allow read: if true;
      allow write: if false; // System-generated only via Cloud Functions
    }
  }
}
```
