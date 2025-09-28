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
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Progress,
  Switch,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBattery, FiWifi, FiActivity, FiSettings, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import { useRobot } from '../hooks/useRobots';
import { useRecentRobot } from '../contexts/RecentRobotContext';

const RobotDetail: React.FC = () => {
  const { robotId } = useParams<{ robotId: string }>();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const { recentRobotId, setRecentRobotId } = useRecentRobot();

  // robotId가 없고 최근 조회한 로봇이 있다면 리다이렉트
  React.useEffect(() => {
    if (!robotId && recentRobotId) {
      navigate(`/robot-detail/${recentRobotId}`, { replace: true });
    }
  }, [robotId, recentRobotId, navigate]);

  // API 연동을 위한 hooks
  const { robot, loading, error, refreshRobot } = useRobot(robotId);

  // 로봇 정보가 로드되면 최근 조회한 로봇으로 설정
  React.useEffect(() => {
    if (robot && robotId) {
      setRecentRobotId(robotId);
    }
  }, [robot, robotId, setRecentRobotId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

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

  // 로봇 온라인 상태 확인
  const isOnline = robot?.status === 'online';

  // robotId가 없고 최근 조회한 로봇도 없는 경우
  if (!robotId && !recentRobotId) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Alert status="info">
            <AlertIcon />
            <Box>
              <AlertTitle>로봇을 선택해주세요</AlertTitle>
              <AlertDescription>
                제어할 로봇을 선택하거나 로봇 목록에서 로봇을 선택해주세요.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" h="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.500">로봇 정보를 불러오는 중...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error || !robot) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>로봇을 찾을 수 없습니다</AlertTitle>
              <AlertDescription>
                {error || '요청한 로봇 정보가 존재하지 않습니다.'}
                <Button ml={4} size="sm" onClick={refreshRobot}>
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
              {robot.name} 상세 제어
            </Heading>
            <Text color="gray.500">{robot.description || '로봇의 실시간 상태를 확인하고 제어하세요'}</Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                ID: {robot.id}
              </Text>
              <Text fontSize="sm" color="gray.600">
                IP: {robot.ipAddress}:{robot.port}
              </Text>
              <Text fontSize="sm" color="gray.600">
                타입: {robot.type}
              </Text>
              <Text fontSize="sm" color="gray.600">
                마지막 접속: {formatLastSeen(robot.lastSeen)}
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          <HStack spacing={4}>
            <Button colorScheme="blue" size="sm" leftIcon={<Icon as={FiRefreshCw as any} />} onClick={refreshRobot}>
              새로고침
            </Button>
            <Button colorScheme="red" size="sm" leftIcon={<Icon as={FiPause as any} />} disabled={!isOnline}>
              정지
            </Button>
            <Button colorScheme="green" size="sm" leftIcon={<Icon as={FiPlay as any} />} disabled={!isOnline}>
              시작
            </Button>
            <Badge colorScheme={getStatusColor(robot.status)} fontSize="md" p={2}>
              {getStatusLabel(robot.status)}
            </Badge>
          </HStack>
        </Flex>

        {/* Robot Status Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            shadow="sm"
            opacity={isOnline ? 1 : 0.5}
            position="relative"
          >
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">배터리</StatLabel>
                  <StatNumber fontSize="2xl" color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "85%" : "-- %"}
                  </StatNumber>
                  <StatHelpText color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "4시간 30분 남음" : "데이터 없음"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg={isOnline ? "green.100" : "gray.100"} p={3} borderRadius="lg">
                <Icon as={FiBattery as any} w={6} h={6} color={isOnline ? "green.500" : "gray.400"} />
              </Box>
            </Flex>
            <Progress value={isOnline ? 85 : 0} colorScheme={isOnline ? "green" : "gray"} size="sm" mt={3} />
            {!isOnline && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.100"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="gray.500" fontWeight="semibold">오프라인</Text>
              </Box>
            )}
          </Box>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            shadow="sm"
            opacity={isOnline ? 1 : 0.5}
            position="relative"
          >
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">신호 강도</StatLabel>
                  <StatNumber fontSize="2xl" color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "-45dBm" : "-- dBm"}
                  </StatNumber>
                  <StatHelpText color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "우수한 연결" : "연결 없음"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg={isOnline ? "blue.100" : "gray.100"} p={3} borderRadius="lg">
                <Icon as={FiWifi as any} w={6} h={6} color={isOnline ? "blue.500" : "gray.400"} />
              </Box>
            </Flex>
            <Progress value={isOnline ? 90 : 0} colorScheme={isOnline ? "blue" : "gray"} size="sm" mt={3} />
            {!isOnline && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.100"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="gray.500" fontWeight="semibold">오프라인</Text>
              </Box>
            )}
          </Box>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            shadow="sm"
            opacity={isOnline ? 1 : 0.5}
            position="relative"
          >
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">CPU 사용률</StatLabel>
                  <StatNumber fontSize="2xl" color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "42%" : "-- %"}
                  </StatNumber>
                  <StatHelpText color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "정상 범위" : "데이터 없음"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg={isOnline ? "purple.100" : "gray.100"} p={3} borderRadius="lg">
                <Icon as={FiActivity as any} w={6} h={6} color={isOnline ? "purple.500" : "gray.400"} />
              </Box>
            </Flex>
            <Progress value={isOnline ? 42 : 0} colorScheme={isOnline ? "purple" : "gray"} size="sm" mt={3} />
            {!isOnline && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.100"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="gray.500" fontWeight="semibold">오프라인</Text>
              </Box>
            )}
          </Box>

          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            shadow="sm"
            opacity={isOnline ? 1 : 0.5}
            position="relative"
          >
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">온도</StatLabel>
                  <StatNumber fontSize="2xl" color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "38°C" : "-- °C"}
                  </StatNumber>
                  <StatHelpText color={isOnline ? "inherit" : "gray.400"}>
                    {isOnline ? "적정 온도" : "데이터 없음"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg={isOnline ? "orange.100" : "gray.100"} p={3} borderRadius="lg">
                <Icon as={FiSettings as any} w={6} h={6} color={isOnline ? "orange.500" : "gray.400"} />
              </Box>
            </Flex>
            <Progress value={isOnline ? 60 : 0} colorScheme={isOnline ? "orange" : "gray"} size="sm" mt={3} />
            {!isOnline && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.100"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="gray.500" fontWeight="semibold">오프라인</Text>
              </Box>
            )}
          </Box>
        </SimpleGrid>

        {/* Control Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
          {/* Robot Controls */}
          <GridItem>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              shadow="sm"
              opacity={isOnline ? 1 : 0.5}
              position="relative"
            >
              <Heading size="md" mb={6} color={isOnline ? "inherit" : "gray.400"}>
                로봇 제어
              </Heading>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Button
                    colorScheme="green"
                    leftIcon={<Icon as={FiPlay as any} />}
                    flex={1}
                    disabled={!isOnline}
                  >
                    시작
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<Icon as={FiPause as any} />}
                    flex={1}
                    disabled={!isOnline}
                  >
                    정지
                  </Button>
                </HStack>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-mode" mb="0" color={isOnline ? "inherit" : "gray.400"}>
                    자동 모드
                  </FormLabel>
                  <Switch id="auto-mode" colorScheme="blue" disabled={!isOnline} />
                </FormControl>

                <Box>
                  <FormLabel color={isOnline ? "inherit" : "gray.400"}>속도 조절</FormLabel>
                  <Slider defaultValue={50} min={0} max={100} isDisabled={!isOnline}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>

                <Button colorScheme="orange" w="100%" disabled={!isOnline}>
                  긴급 정지
                </Button>
              </VStack>
              {!isOnline && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="blackAlpha.100"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VStack spacing={2}>
                    <Text fontSize="lg" color="gray.500" fontWeight="bold">
                      제어 불가
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      로봇이 오프라인 상태입니다
                    </Text>
                  </VStack>
                </Box>
              )}
            </Box>
          </GridItem>

          {/* Robot Settings */}
          <GridItem>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              shadow="sm"
              opacity={isOnline ? 1 : 0.5}
              position="relative"
            >
              <Heading size="md" mb={6} color={isOnline ? "inherit" : "gray.400"}>
                로봇 설정
              </Heading>
              <VStack spacing={6} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="night-mode" mb="0" color={isOnline ? "inherit" : "gray.400"}>
                    야간 모드
                  </FormLabel>
                  <Switch id="night-mode" colorScheme="purple" disabled={!isOnline} />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sound-alerts" mb="0" color={isOnline ? "inherit" : "gray.400"}>
                    소리 알림
                  </FormLabel>
                  <Switch id="sound-alerts" colorScheme="green" defaultChecked disabled={!isOnline} />
                </FormControl>

                <Box>
                  <FormLabel color={isOnline ? "inherit" : "gray.400"}>청소 강도</FormLabel>
                  <Slider defaultValue={75} min={0} max={100} isDisabled={!isOnline}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>

                <Button colorScheme="blue" w="100%" disabled={!isOnline}>
                  설정 저장
                </Button>
              </VStack>
              {!isOnline && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="blackAlpha.100"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VStack spacing={2}>
                    <Text fontSize="lg" color="gray.500" fontWeight="bold">
                      설정 불가
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      로봇이 오프라인 상태입니다
                    </Text>
                  </VStack>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>

        {/* Status Log */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          shadow="sm"
          opacity={isOnline ? 1 : 0.5}
          position="relative"
        >
          <Heading size="md" mb={4} color={isOnline ? "inherit" : "gray.400"}>
            상태 로그
          </Heading>
          <VStack spacing={3} align="stretch">
            {isOnline ? (
              <>
                <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">14:32 - 청소 작업 시작</Text>
                  <Badge colorScheme="blue">진행중</Badge>
                </Flex>
                <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">14:25 - 배터리 85%로 충전 완료</Text>
                  <Badge colorScheme="green">완료</Badge>
                </Flex>
                <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">13:45 - 자동 충전 모드 시작</Text>
                  <Badge colorScheme="yellow">충전</Badge>
                </Flex>
                <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">13:30 - 거실 청소 완료</Text>
                  <Badge colorScheme="green">완료</Badge>
                </Flex>
              </>
            ) : (
              <>
                <Flex justify="space-between" align="center" p={3} bg="gray.100" borderRadius="md">
                  <Text fontSize="sm" color="gray.400">{formatLastSeen(robot.lastSeen)} - 연결 끊김</Text>
                  <Badge colorScheme="gray">오프라인</Badge>
                </Flex>
                <Flex justify="center" align="center" p={8}>
                  <VStack spacing={2}>
                    <Text fontSize="md" color="gray.500" fontWeight="semibold">
                      로그 데이터 없음
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      로봇이 온라인 상태가 되면 실시간 로그가 표시됩니다
                    </Text>
                  </VStack>
                </Flex>
              </>
            )}
          </VStack>
          {!isOnline && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.100"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Text fontSize="lg" color="gray.500" fontWeight="bold">
                  로그 확인 불가
                </Text>
                <Text fontSize="sm" color="gray.500">
                  로봇이 오프라인 상태입니다
                </Text>
              </VStack>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default RobotDetail;