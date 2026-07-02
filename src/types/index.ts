export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  reputationScore: number;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Pin {
  name: string;
  type: 'Digital' | 'Analog' | 'I2C' | 'SPI' | 'Power' | 'GND';
  voltage: 3.3 | 5.0;
  direction?: 'Input' | 'Output' | 'Bi';
  label?: string;
}

export interface BoardSpec {
  id: string;
  name: string;
  manufacturerId: string;
  architecture: string;
  cpu: string;
  clockSpeed: string; // e.g. "240 MHz"
  ram: string; // e.g. "520 KB"
  flash: string; // e.g. "4 MB"
  operatingVoltage: 3.3 | 5.0;
  maxCurrent: number; // in mA, e.g. 500
  gpioCount: number;
  pins: Pin[];
  usbInterface: string;
  imageURL: string;
  pinoutImageURL: string;
  datasheetLink: string;
  documentationLink: string;
  supportedFrameworks: string[]; // e.g. ["Arduino", "ESP-IDF"]
  compatibleLibraries: string[]; // References to library IDs
  version: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  category: 'sensor' | 'display' | 'actuator' | 'indicator' | 'power' | 'driver' | 'ic' | 'passive';
  manufacturerId: string;
  description: string;
  imageURL: string;
  operatingVoltage: 3.3 | 5.0;
  maxVoltage: number; // e.g. 6.0
  typicalCurrent: number; // in mA, e.g. 15
  maxCurrent: number; // in mA, e.g. 50
  protocol: string; // e.g. "I2C", "SPI", "GPIO"
  pinCount: number;
  pins: Pin[];
  mandatoryPins: string[];
  requiredGpioTypes: string[]; // e.g. ["Digital", "Analog"]
  powerRequirements: string; // e.g. "3.3V stable power"
  requiredLibraries: string[]; // Library IDs
  initializationExample: string;
  exampleFirmware: string;
  knownIssues: string[];
  engineeringTips: string[];
  alternativeComponents: string[]; // Component IDs
  datasheetLink: string;
  documentationLink: string;
  version: string;
  tags: string[];
  approvalStatus: 'pending' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface Library {
  id: string;
  name: string;
  description: string;
  author: string;
  compatibleBoards: string[]; // board IDs
  repositoryUrl: string;
  version: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  website: string;
  country: string;
}

export interface ProtocolSpec {
  id: string;
  name: string;
  type: 'serial' | 'parallel' | 'analog' | 'digital';
  maxSpeed?: string;
}

export interface ProjectComponent {
  instanceId: string;
  componentId: string;
}

export interface PinConnection {
  id: string;
  fromComponentId: string; // 'board' or instanceId
  fromPin: string;
  toComponentId: string; // instanceId
  toPin: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  boardId: string;
  components: ProjectComponent[];
  connections: PinConnection[];
  firmwareCode?: string;
  markdownDoc?: string;
  forkOfProjectId?: string | null;
  forksCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationIssue {
  type: 'warning' | 'error';
  message: string;
  affectedPins: string[];
}
