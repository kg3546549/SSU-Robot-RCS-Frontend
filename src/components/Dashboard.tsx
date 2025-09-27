import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Flex,
  Spacer,
  Avatar,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiCpu, FiBattery, FiWifi, FiActivity, FiRefreshCw } from 'react-icons/fi';
import { useRobots } from '../hooks/useRobots';

const Dashboard: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const notificationBg = useColorModeValue('gray.50', 'gray.700');

  // API 연동을 위한 hooks
  const { robots, loading, error, refreshRobots } = useRobots();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return '온라인';
      case 'offline': return '오프라인';
      case 'error': return '오류';
      default: return status;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  // 통계 계산
  const totalRobots = robots.length;
  const onlineRobots = robots.filter(r => r.status === 'online').length;
  const offlineRobots = robots.filter(r => r.status === 'offline' || r.status === 'error').length;
  const errorRobots = robots.filter(r => r.status === 'error').length;

  // 알림 생성 함수
  const generateNotifications = () => {
    const notifications: Array<{
      id: string;
      title: string;
      description: string;
      type: 'error' | 'warning' | 'success' | 'info';
      colorScheme: string;
      label: string;
    }> = [];

    // 오류 상태 로봇들
    robots.filter(r => r.status === 'error').forEach(robot => {
      notifications.push({
        id: `error-${robot.id}`,
        title: `${robot.name} 오류 발생`,
        description: `로봇에 문제가 발생했습니다. 점검이 필요합니다.`,
        type: 'error',
        colorScheme: 'red',
        label: '오류'
      });
    });

    // 오프라인 로봇들 (최근 1시간 이내에 연결이 끊어진 경우)
    robots.filter(r => r.status === 'offline').forEach(robot => {
      const lastSeenTime = new Date(robot.lastSeen).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);

      if (lastSeenTime > oneHourAgo) {
        notifications.push({
          id: `offline-${robot.id}`,
          title: `${robot.name} 연결 끊김`,
          description: `${formatLastSeen(robot.lastSeen)}에 마지막으로 연결되었습니다.`,
          type: 'warning',
          colorScheme: 'orange',
          label: '주의'
        });
      }
    });

    // 새로 추가된 로봇들 (최근 24시간 이내)
    robots.forEach(robot => {
      const lastSeenTime = new Date(robot.lastSeen).getTime();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

      if (lastSeenTime > oneDayAgo && robot.status === 'online') {
        notifications.push({
          id: `new-${robot.id}`,
          title: `${robot.name} 새로 연결됨`,
          description: `새로운 ${robot.type} 로봇이 시스템에 연결되었습니다.`,
          type: 'info',
          colorScheme: 'blue',
          label: '정보'
        });
      }
    });

    // 온라인 로봇들 중 정상 작동 중인 로봇들
    const recentlyActiveRobots = robots.filter(r => {
      if (r.status !== 'online') return false;
      const lastSeenTime = new Date(r.lastSeen).getTime();
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return lastSeenTime > fiveMinutesAgo;
    });

    if (recentlyActiveRobots.length > 0 && notifications.length < 3) {
      const robot = recentlyActiveRobots[0];
      notifications.push({
        id: `active-${robot.id}`,
        title: `${robot.name} 정상 작동 중`,
        description: `모든 시스템이 정상적으로 작동하고 있습니다.`,
        type: 'success',
        colorScheme: 'green',
        label: '정상'
      });
    }

    // 알림이 없는 경우 기본 메시지
    if (notifications.length === 0) {
      notifications.push({
        id: 'no-notifications',
        title: '모든 로봇이 정상입니다',
        description: '현재 특별한 알림이 없습니다.',
        type: 'success',
        colorScheme: 'green',
        label: '정상'
      });
    }

    return notifications.slice(0, 4); // 최대 4개까지만 표시
  };

  const notifications = generateNotifications();

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" h="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.500">대시보드를 불러오는 중...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>연결 오류</AlertTitle>
              <AlertDescription>
                {error}
                <Button ml={4} size="sm" onClick={refreshRobots}>
                  다시 시도
                </Button>
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">
              로봇 관리 대시보드
            </Heading>
            <Text color="gray.500">등록된 {totalRobots}대의 로봇을 실시간으로 모니터링하세요</Text>
          </VStack>
          <Spacer />
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              size="sm"
              leftIcon={<Icon as={FiRefreshCw as any} />}
              onClick={refreshRobots}
            >
              전체 새로고침
            </Button>
            <Avatar size="sm" name="관리자" />
          </HStack>
        </Flex>

        {/* Robot Status Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">총 로봇 수</StatLabel>
                  <StatNumber fontSize="2xl">{totalRobots}</StatNumber>
                  <StatHelpText>
                    등록된 전체 로봇
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="blue.100" p={3} borderRadius="lg">
                <Icon as={FiCpu as any} w={6} h={6} color="blue.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">온라인 로봇</StatLabel>
                  <StatNumber fontSize="2xl">{onlineRobots}</StatNumber>
                  <StatHelpText>
                    {totalRobots > 0 ? Math.round((onlineRobots / totalRobots) * 100) : 0}% 가동률
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="green.100" p={3} borderRadius="lg">
                <Icon as={FiActivity as any} w={6} h={6} color="green.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">오프라인 로봇</StatLabel>
                  <StatNumber fontSize="2xl">{offlineRobots}</StatNumber>
                  <StatHelpText>
                    {errorRobots > 0 && <Text color="red.500">{errorRobots}대 오류</Text>}
                    {errorRobots === 0 && "정상"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="orange.100" p={3} borderRadius="lg">
                <Icon as={FiBattery as any} w={6} h={6} color="orange.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">연결 상태</StatLabel>
                  <StatNumber fontSize="2xl">{onlineRobots}</StatNumber>
                  <StatHelpText>
                    <Text color={onlineRobots > 0 ? "green.500" : "red.500"}>
                      {onlineRobots > 0 ? "양호" : "연결 없음"}
                    </Text>
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="purple.100" p={3} borderRadius="lg">
                <Icon as={FiWifi as any} w={6} h={6} color="purple.500" />
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>

        {/* Content Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Main Content */}
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">로봇 상태 알림</Heading>
                <Button size="sm" variant="ghost" onClick={refreshRobots}>
                  <Icon as={FiRefreshCw as any} />
                </Button>
              </Flex>
              <VStack spacing={4} align="stretch">
                {notifications.map((notification) => (
                  <Flex
                    key={notification.id}
                    justify="space-between"
                    align="center"
                    p={4}
                    bg={notificationBg}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor={`${notification.colorScheme}.400`}
                  >
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold">{notification.title}</Text>
                      <Text fontSize="sm" color="gray.500">{notification.description}</Text>
                    </VStack>
                    <Badge colorScheme={notification.colorScheme}>{notification.label}</Badge>
                  </Flex>
                ))}

                {notifications.length === 0 && (
                  <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                    현재 알림이 없습니다
                  </Text>
                )}
              </VStack>
            </Box>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm" w="100%">
                <Heading size="md" mb={4}>로봇 제어</Heading>
                <VStack spacing={3}>
                  <Button colorScheme="blue" w="100%" size="sm">
                    모든 로봇 재시작
                  </Button>
                  <Button colorScheme="green" w="100%" size="sm">
                    배터리 충전 모드
                  </Button>
                  <Button colorScheme="orange" w="100%" size="sm">
                    긴급 정지
                  </Button>
                  <Link to="/robot-list" style={{ width: '100%' }}>
                    <Button colorScheme="purple" w="100%" size="sm">
                      로봇 목록 보기
                    </Button>
                  </Link>
                </VStack>
              </Box>

              <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm" w="100%">
                <Heading size="md" mb={4}>활성 로봇</Heading>
                <VStack spacing={3}>
                  {robots.slice(0, 5).map((robot) => {
                    const statusColor = robot.status === 'online' ? 'green.400' :
                                      robot.status === 'error' ? 'red.400' : 'gray.400';

                    return (
                      <Link key={robot.id} to={`/robot-detail/${robot.id}`} style={{ width: '100%' }}>
                        <Flex w="100%" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }} cursor="pointer">
                          <Box w={3} h={3} bg={statusColor} borderRadius="full" />
                          <VStack align="start" spacing={0} ml={3} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold">{robot.name}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {getStatusLabel(robot.status)} • {formatLastSeen(robot.lastSeen)}
                            </Text>
                          </VStack>
                        </Flex>
                      </Link>
                    );
                  })}
                  {robots.length === 0 && (
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      등록된 로봇이 없습니다
                    </Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;