import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

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
  const { socket, isConnected } = useSocket(); // Use global socket
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

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!socket || !robotId) return;

    console.log(`Setting up listeners for robot ${robotId}`);

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

    // Cleanup: remove listeners when robotId changes or component unmounts
    return () => {
      console.log(`Cleaning up listeners for robot ${robotId}`);
      socket.off('robot:connected');
      socket.off('robot:disconnected');
      socket.off('robot:statusChanged');
      socket.off('robot:modeChanged');
      socket.off('robot:modeList');
      socket.off('robot:log');
      socket.off('robot:error');
    };
  }, [socket, robotId, addLog]);

  // Connect to robot
  const connectToRobot = useCallback(() => {
    if (socket) {
      socket.emit('robot:connect', { robotId });
    }
  }, [socket, robotId]);

  // Disconnect from robot
  const disconnectFromRobot = useCallback(() => {
    if (socket) {
      socket.emit('robot:disconnect', { robotId });
    }
  }, [socket, robotId]);

  // Joystick control
  const sendJoystick = useCallback(
    (data: JoystickData) => {
      if (socket && isRobotConnected) {
        socket.emit('robot:joystick', {
          robotId,
          x: data.x,
          y: data.y,
        });
      }
    },
    [socket, robotId, isRobotConnected],
  );

  // Move command
  const sendMove = useCallback(
    (direction: 'forward' | 'backward' | 'left' | 'right', speed: number) => {
      if (socket && isRobotConnected) {
        socket.emit('robot:move', {
          robotId,
          direction,
          speed,
        });
      }
    },
    [socket, robotId, isRobotConnected],
  );

  // Rotate command
  const sendRotate = useCallback(
    (direction: 'left' | 'right', speed: number) => {
      if (socket && isRobotConnected) {
        socket.emit('robot:rotate', {
          robotId,
          direction,
          speed,
        });
      }
    },
    [socket, robotId, isRobotConnected],
  );

  // Stop command
  const sendStop = useCallback(() => {
    if (socket && isRobotConnected) {
      socket.emit('robot:stop', { robotId });
    }
  }, [socket, robotId, isRobotConnected]);

  // Emergency stop
  const sendEmergencyStop = useCallback(() => {
    if (socket && isRobotConnected) {
      socket.emit('robot:emergency', { robotId });
    }
  }, [socket, robotId, isRobotConnected]);

  // Set mode
  const setMode = useCallback(
    (mode: number, speed: number = 0.5) => {
      if (socket && isRobotConnected) {
        socket.emit('robot:setMode', {
          robotId,
          mode,
          speed,
        });
      }
    },
    [socket, robotId, isRobotConnected],
  );

  // Get current mode
  const getMode = useCallback(() => {
    if (socket && isRobotConnected) {
      socket.emit('robot:getMode', { robotId });
    }
  }, [socket, robotId, isRobotConnected]);

  // Get mode list
  const getModeList = useCallback(() => {
    if (socket && isRobotConnected) {
      socket.emit('robot:getModeList', { robotId });
    }
  }, [socket, robotId, isRobotConnected]);

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
