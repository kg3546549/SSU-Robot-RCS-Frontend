import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Flex,
  Spacer,
  Avatar,
  Divider
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCpu, FiList, FiSettings } from 'react-icons/fi';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const menuItems = [
    {
      path: '/',
      label: '대시보드',
      icon: FiHome,
      description: '전체 현황'
    },
    {
      path: '/robot-list',
      label: '로봇 목록',
      icon: FiList,
      description: '전체 관리'
    },
    {
      path: '/robot-detail',
      label: '로봇 제어',
      icon: FiCpu,
      description: '개별 제어'
    },
    {
      path: '/settings',
      label: '설정',
      icon: FiSettings,
      description: '시스템 설정'
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      w="280px"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      p={6}
    >
      {/* Logo/Header */}
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" py={4}>
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            Robot Manager
          </Text>
          <Text fontSize="sm" color="gray.500">
            로봇 관리 시스템
          </Text>
        </Box>

        <Divider />

        {/* User Info */}
        <HStack spacing={3} p={3} bg="gray.50" borderRadius="lg">
          <Avatar size="sm" name="관리자" />
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold">관리자</Text>
            <Text fontSize="xs" color="gray.500">admin@robot.com</Text>
          </Box>
        </HStack>

        <Divider />

        {/* Navigation Menu */}
        <VStack spacing={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p={4}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? 'blue.50' : 'transparent'}
                  borderLeft={isActive ? '4px solid' : '4px solid transparent'}
                  borderColor={isActive ? 'blue.500' : 'transparent'}
                  _hover={{
                    bg: isActive ? 'blue.50' : 'gray.50',
                    transform: 'translateX(2px)'
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={3}>
                    <Icon
                      as={item.icon as any}
                      w={5}
                      h={5}
                      color={isActive ? 'blue.500' : 'gray.500'}
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text
                        fontSize="sm"
                        fontWeight={isActive ? 'semibold' : 'medium'}
                        color={isActive ? 'blue.600' : 'gray.700'}
                      >
                        {item.label}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Link>
            );
          })}
        </VStack>

        <Spacer />

        {/* Status Info */}
        <Box mt="auto" p={4} bg="green.50" borderRadius="lg">
          <HStack spacing={2}>
            <Box w={2} h={2} bg="green.400" borderRadius="full" />
            <Text fontSize="xs" color="green.700">시스템 정상</Text>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>
            마지막 업데이트: 방금 전
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;