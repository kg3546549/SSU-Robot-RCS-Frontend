import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RecentRobotContextType {
  recentRobotId: string | null;
  setRecentRobotId: (robotId: string) => void;
}

const RecentRobotContext = createContext<RecentRobotContextType | undefined>(undefined);

interface RecentRobotProviderProps {
  children: ReactNode;
}

export const RecentRobotProvider: React.FC<RecentRobotProviderProps> = ({ children }) => {
  const [recentRobotId, setRecentRobotIdState] = useState<string | null>(null);

  const setRecentRobotId = (robotId: string) => {
    setRecentRobotIdState(robotId);
  };

  return (
    <RecentRobotContext.Provider value={{ recentRobotId, setRecentRobotId }}>
      {children}
    </RecentRobotContext.Provider>
  );
};

export const useRecentRobot = () => {
  const context = useContext(RecentRobotContext);
  if (context === undefined) {
    throw new Error('useRecentRobot must be used within a RecentRobotProvider');
  }
  return context;
};