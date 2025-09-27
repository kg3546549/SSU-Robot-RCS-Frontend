export interface RobotCapability {
  name: string;
  type: 'movement' | 'sensor' | 'camera' | 'arm' | 'gripper' | 'custom';
  enabled: boolean;
  parameters?: Record<string, any>;
}

export interface Robot {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  port: number;
  status: 'online' | 'offline' | 'error';
  description?: string;
  lastSeen: string;
  capabilities: RobotCapability[];
  metadata: Record<string, any>;
}

export interface CreateRobotDto {
  name: string;
  type: string;
  ipAddress: string;
  port: number;
  description?: string;
  capabilities?: RobotCapability[];
  metadata?: Record<string, any>;
}

export interface UpdateRobotDto {
  name?: string;
  type?: string;
  ipAddress?: string;
  port?: number;
  description?: string;
  capabilities?: RobotCapability[];
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  timestamp?: string;
  error?: any;
}

export interface RobotHealthData {
  robotId: string;
  healthy: boolean;
  status: string;
  lastSeen: string;
  uptime: number;
}