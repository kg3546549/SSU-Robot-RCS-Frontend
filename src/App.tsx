import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { RecentRobotProvider } from './contexts/RecentRobotContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RobotDetail from './components/RobotDetail';
import RobotList from './components/RobotList';
import Settings from './components/Settings';

function App() {
  return (
    <ChakraProvider>
      <SocketProvider>
        <RecentRobotProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/robot-detail" element={<RobotDetail />} />
                <Route path="/robot-detail/:robotId" element={<RobotDetail />} />
                <Route path="/robot-list" element={<RobotList />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </RecentRobotProvider>
      </SocketProvider>
    </ChakraProvider>
  );
}

export default App;
