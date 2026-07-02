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
  operatingVoltage: 3.3 | 5.0;
  pins: Pin[];
  description: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  category: 'sensor' | 'display' | 'actuator' | 'indicator';
  manufacturerId: string;
  operatingVoltage: 3.3 | 5.0;
  pins: Pin[];
  mandatoryPins: string[];
  description: string;
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
