import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

interface JoystickData {
  x: number;
  y: number;
}

interface ModeInfo {
  currentMode: number;
  modeName: string;
}

interface ModeOption {
  value: number;
  name: string;
}

interface RobotLog {
  robotId: string;
  message: string;
  timestamp: string;
}

interface RobotError {
  robotId: string;
  error: string;
}

export const useRobotControl = (robotId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRobotConnected, setIsRobotConnected] = useState(false);
  const [currentMode, setCurrentMode] = useState<ModeInfo>({ currentMode: 0, modeName: 'IDLE' });
  const [availableModes, setAvailableModes] = useState<ModeOption[]>([
    { value: 0, name: 'IDLE' },
    { value: 1, name: 'AUTO_PATROL' },
    { value: 2, name: 'AUTO_NAVIGATION' },
    { value: 3, name: 'KEYBOARD' },
    { value: 4, name: 'WEB_JOY' },
    { value: 5, name: 'JOY' },
    { value: 99, name: 'EMERGENCY' },
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Socket 연결
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setIsRobotConnected(false);
    });

    // Robot connection events
    socket.on('robot:connected', (data: { robotId: string; message: string }) => {
      if (data.robotId === robotId) {
        setIsRobotConnected(true);
        addLog(data.message);

        // 연결 성공 시 자동으로 모드 정보 요청
        socket.emit('robot:getModeList', { robotId });
        socket.emit('robot:getMode', { robotId });
      }
    });

    socket.on('robot:disconnected', (data: { robotId: string; reason?: string }) => {
      if (data.robotId === robotId) {
        setIsRobotConnected(false);
        const message = data.reason ? `Disconnected: ${data.reason}` : 'Disconnected from robot';
        addLog(message);
      }
    });

    // Status change events (for real-time updates)
    socket.on('robot:statusChanged', (data: { robotId: string; status: string; timestamp: string }) => {
      if (data.robotId === robotId) {
        if (data.status === 'offline') {
          setIsRobotConnected(false);
          addLog('⚠️ Robot connection lost - Status changed to offline');
        } else if (data.status === 'online') {
          // Status updated to online (might be from another client)
          addLog('✅ Robot status changed to online');
        }
      }
    });

    // Mode events
    socket.on('robot:modeChanged', (data: { robotId: string; currentMode: number; modeName: string }) => {
      if (data.robotId === robotId) {
        setCurrentMode({ currentMode: data.currentMode, modeName: data.modeName });
      }
    });

    socket.on('robot:modeList', (data: { robotId: string; modes: ModeOption[] }) => {
      if (data.robotId === robotId) {
        setAvailableModes(data.modes);
      }
    });

    // Log events
    socket.on('robot:log', (data: RobotLog) => {
      if (data.robotId === robotId) {
        addLog(data.message);
      }
    });

    // Error events
    socket.on('robot:error', (data: RobotError) => {
      if (data.robotId === robotId) {
        addLog(`ERROR: ${data.error}`);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [robotId]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Connect to robot
  const connectToRobot = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('robot:connect', { robotId });
    }
  }, [robotId]);

  // Disconnect from robot
  const disconnectFromRobot = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('robot:disconnect', { robotId });
    }
  }, [robotId]);

  // Joystick control
  const sendJoystick = useCallback(
    (data: JoystickData) => {
      if (socketRef.current && isRobotConnected) {
        socketRef.current.emit('robot:joystick', {
          robotId,
          x: data.x,
          y: data.y,
        });
      }
    },
    [robotId, isRobotConnected],
  );

  // Move command
  const sendMove = useCallback(
    (direction: 'forward' | 'backward' | 'left' | 'right', speed: number) => {
      if (socketRef.current && isRobotConnected) {
        socketRef.current.emit('robot:move', {
          robotId,
          direction,
          speed,
        });
      }
    },
    [robotId, isRobotConnected],
  );

  // Rotate command
  const sendRotate = useCallback(
    (direction: 'left' | 'right', speed: number) => {
      if (socketRef.current && isRobotConnected) {
        socketRef.current.emit('robot:rotate', {
          robotId,
          direction,
          speed,
        });
      }
    },
    [robotId, isRobotConnected],
  );

  // Stop command
  const sendStop = useCallback(() => {
    if (socketRef.current && isRobotConnected) {
      socketRef.current.emit('robot:stop', { robotId });
    }
  }, [robotId, isRobotConnected]);

  // Emergency stop
  const sendEmergencyStop = useCallback(() => {
    if (socketRef.current && isRobotConnected) {
      socketRef.current.emit('robot:emergency', { robotId });
    }
  }, [robotId, isRobotConnected]);

  // Set mode
  const setMode = useCallback(
    (mode: number, speed: number = 0.5) => {
      if (socketRef.current && isRobotConnected) {
        socketRef.current.emit('robot:setMode', {
          robotId,
          mode,
          speed,
        });
      }
    },
    [robotId, isRobotConnected],
  );

  // Get current mode
  const getMode = useCallback(() => {
    if (socketRef.current && isRobotConnected) {
      socketRef.current.emit('robot:getMode', { robotId });
    }
  }, [robotId, isRobotConnected]);

  // Get mode list
  const getModeList = useCallback(() => {
    if (socketRef.current && isRobotConnected) {
      socketRef.current.emit('robot:getModeList', { robotId });
    }
  }, [robotId, isRobotConnected]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    isConnected,
    isRobotConnected,
    currentMode,
    availableModes,
    logs,
    connectToRobot,
    disconnectFromRobot,
    sendJoystick,
    sendMove,
    sendRotate,
    sendStop,
    sendEmergencyStop,
    setMode,
    getMode,
    getModeList,
    clearLogs,
  };
};
