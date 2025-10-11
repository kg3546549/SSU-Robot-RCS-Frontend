import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
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
  FormControl,
  FormLabel,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBattery, FiWifi, FiActivity, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useRobot } from '../hooks/useRobots';
import { useRobotControl } from '../hooks/useRobotControl';
import VirtualJoystick from './VirtualJoystick';
import { useRecentRobot } from '../contexts/RecentRobotContext';

const RobotDetailNew: React.FC = () => {
  const { robotId } = useParams<{ robotId: string }>();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const { recentRobotId, setRecentRobotId } = useRecentRobot();

  React.useEffect(() => {
    if (!robotId && recentRobotId) {
      navigate(`/robot-detail/${recentRobotId}`, { replace: true });
    }
  }, [robotId, recentRobotId, navigate]);

  const { robot, loading, error, refreshRobot } = useRobot(robotId);

  const {
    isConnected,
    isRobotConnected,
    currentMode,
    availableModes,
    logs,
    connectToRobot,
    disconnectFromRobot,
    sendJoystick,
    sendRotate,
    sendStop,
    sendEmergencyStop,
    setMode,
    getMode,
    getModeList,
    clearLogs,
  } = useRobotControl(robotId || '');

  const [maxAngularSpeed, setMaxAngularSpeed] = useState(1.0);
  const [modeSpeed, setModeSpeed] = useState(0.5);

  useEffect(() => {
    if (robotId && isConnected && !isRobotConnected) {
      connectToRobot();
    }
  }, [robotId, isConnected, isRobotConnected, connectToRobot]);

  useEffect(() => {
    if (robot && robotId) {
      setRecentRobotId(robotId);
    }
  }, [robot, robotId, setRecentRobotId]);

  const handleJoystickMove = (data: { x: number; y: number }) => {
    sendJoystick(data);
  };

  const handleJoystickStop = () => {
    sendStop();
  };

  const handleEmergencyStop = () => {
    sendEmergencyStop();
  };

  const handleSetMode = (modeValue: number) => {
    setMode(modeValue, modeSpeed);
  };

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

  const isOnline = isRobotConnected || robot?.status === 'online';

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
        <Flex gap={6} align="flex-start">
          {/* Main Content */}
          <Box flex="1">
            {/* Header */}
            <Flex mb={6}>
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
                {!isRobotConnected ? (
                  <Button colorScheme="green" size="sm" onClick={connectToRobot} isDisabled={!isConnected}>
                    로봇 연결
                  </Button>
                ) : (
                  <Button colorScheme="red" size="sm" onClick={disconnectFromRobot}>
                    연결 해제
                  </Button>
                )}
                <Badge colorScheme={isRobotConnected ? 'green' : getStatusColor(robot.status)} fontSize="md" p={2}>
                  {isRobotConnected ? '연결됨' : getStatusLabel(robot.status)}
                </Badge>
              </HStack>
            </Flex>

            {/* Mode Control - Top */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              shadow="sm"
              mb={6}
              opacity={isOnline ? 1 : 0.5}
              position="relative"
            >
              <Heading size="md" mb={4}>
                🎮 모드 제어
              </Heading>
              <Flex gap={6} align="flex-start">
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="md"
                  border="2px solid"
                  borderColor="blue.200"
                  minW="200px"
                >
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    현재 모드
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {currentMode.modeName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Mode {currentMode.currentMode}
                  </Text>
                </Box>

                <FormControl flex="1" maxW="200px">
                  <FormLabel color={isOnline ? "inherit" : "gray.400"}>모드 속도</FormLabel>
                  <NumberInput
                    value={modeSpeed}
                    onChange={(_, value) => setModeSpeed(value)}
                    min={0}
                    max={2}
                    step={0.1}
                    isDisabled={!isOnline}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <Box flex="2">
                  <Flex justify="space-between" align="center" mb={3}>
                    <FormLabel mb={0} color={isOnline ? "inherit" : "gray.400"}>모드 선택</FormLabel>
                    <Button
                      size="xs"
                      colorScheme="purple"
                      onClick={() => {
                        getMode();
                        getModeList();
                      }}
                      disabled={!isOnline}
                    >
                      새로고침
                    </Button>
                  </Flex>
                  <SimpleGrid columns={4} spacing={2}>
                    {availableModes.map((mode) => {
                      const isActive = mode.value === currentMode.currentMode;
                      const isEmergency = mode.value === 99;

                      return (
                        <Button
                          key={mode.value}
                          size="sm"
                          colorScheme={
                            isEmergency ? 'red' :
                            isActive ? 'blue' :
                            'gray'
                          }
                          variant={isActive ? 'solid' : 'outline'}
                          onClick={() => handleSetMode(mode.value)}
                          disabled={!isOnline}
                          leftIcon={isActive ? <Text>✓</Text> : undefined}
                          h="50px"
                          whiteSpace="normal"
                          textAlign="center"
                        >
                          <VStack spacing={0}>
                            <Text fontWeight="bold" fontSize="xs">
                              {mode.name}
                            </Text>
                            <Text fontSize="2xs" opacity={0.8}>
                              {mode.value}
                            </Text>
                          </VStack>
                        </Button>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </Flex>
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
                  <Text fontSize="lg" color="gray.500" fontWeight="bold">
                    로봇을 먼저 연결하세요
                  </Text>
                </Box>
              )}
            </Box>

            {/* Camera and Joystick Row */}
            <Grid templateColumns="2fr 1fr" gap={6} mb={6}>
              {/* Camera View */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="sm"
              >
                <Heading size="md" mb={4}>
                  📹 카메라 뷰
                </Heading>
                <Box
                  bg="gray.100"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  paddingTop="56.25%"
                >
                  {isOnline ? (
                    <Box
                      as="img"
                      src={`http://localhost:3001/robots/${robotId}/camera?t=${Date.now()}`}
                      alt="Robot Camera Feed"
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      bg="black"
                    />
                  ) : (
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.800"
                    >
                      <VStack spacing={2}>
                        <Text fontSize="lg" color="gray.400" fontWeight="bold">
                          카메라 사용 불가
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          로봇을 먼저 연결하세요
                        </Text>
                      </VStack>
                    </Flex>
                  )}
                </Box>
              </Box>

              {/* Virtual Joystick */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="sm"
                opacity={isOnline ? 1 : 0.5}
                position="relative"
              >
                <Heading size="md" mb={4}>
                  🕹️ 조이스틱
                </Heading>
                <VStack spacing={4} align="center">
                  <VirtualJoystick
                    size={180}
                    onMove={handleJoystickMove}
                    onStop={handleJoystickStop}
                    disabled={!isOnline}
                  />

                  <FormControl>
                    <FormLabel color={isOnline ? "inherit" : "gray.400"}>회전 속도</FormLabel>
                    <NumberInput
                      value={maxAngularSpeed}
                      onChange={(_, value) => setMaxAngularSpeed(value)}
                      min={0}
                      max={5}
                      step={0.1}
                      isDisabled={!isOnline}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <HStack w="100%" spacing={2}>
                    <Button
                      colorScheme="blue"
                      flex={1}
                      size="sm"
                      onMouseDown={() => sendRotate('left', maxAngularSpeed)}
                      onMouseUp={() => sendStop()}
                      onTouchStart={() => sendRotate('left', maxAngularSpeed)}
                      onTouchEnd={() => sendStop()}
                      disabled={!isOnline}
                    >
                      ↺ 좌
                    </Button>
                    <Button
                      colorScheme="blue"
                      flex={1}
                      size="sm"
                      onMouseDown={() => sendRotate('right', maxAngularSpeed)}
                      onMouseUp={() => sendStop()}
                      onTouchStart={() => sendRotate('right', maxAngularSpeed)}
                      onTouchEnd={() => sendStop()}
                      disabled={!isOnline}
                    >
                      ↻ 우
                    </Button>
                  </HStack>

                  <Button
                    colorScheme="red"
                    w="100%"
                    size="md"
                    onClick={handleEmergencyStop}
                    disabled={!isOnline}
                  >
                    🛑 비상 정지
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
                    <Text fontSize="lg" color="gray.500" fontWeight="bold">
                      제어 불가
                    </Text>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Control Logs */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              shadow="sm"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">📋 제어 로그</Heading>
                <Button size="sm" colorScheme="red" onClick={clearLogs}>
                  로그 지우기
                </Button>
              </Flex>
              <Box
                bg="gray.900"
                color="green.300"
                p={4}
                borderRadius="md"
                fontFamily="monospace"
                fontSize="sm"
                maxH="300px"
                overflowY="auto"
              >
                {logs.length === 0 ? (
                  <Text color="gray.500">로그가 없습니다...</Text>
                ) : (
                  logs.map((log, index) => (
                    <Text key={index}>{log}</Text>
                  ))
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar - Status Cards (Fixed) */}
          <Box w="280px" position="sticky" top="8">
            <VStack spacing={4} align="stretch">
              <Heading size="md" mb={2}>📊 상태 정보</Heading>

              {/* Battery */}
              <Box
                bg={cardBg}
                p={4}
                borderRadius="lg"
                shadow="sm"
                opacity={isOnline ? 1 : 0.5}
              >
                <Flex align="center" mb={2}>
                  <Icon as={FiBattery as any} w={5} h={5} color={isOnline ? "green.500" : "gray.400"} />
                  <Text fontSize="sm" fontWeight="bold" ml={2}>배터리</Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color={isOnline ? "green.600" : "gray.400"}>
                  {isOnline ? "85%" : "--"}
                </Text>
                <Progress value={isOnline ? 85 : 0} colorScheme="green" size="sm" mt={2} />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {isOnline ? "4시간 30분 남음" : "데이터 없음"}
                </Text>
              </Box>

              {/* Signal */}
              <Box
                bg={cardBg}
                p={4}
                borderRadius="lg"
                shadow="sm"
                opacity={isOnline ? 1 : 0.5}
              >
                <Flex align="center" mb={2}>
                  <Icon as={FiWifi as any} w={5} h={5} color={isOnline ? "blue.500" : "gray.400"} />
                  <Text fontSize="sm" fontWeight="bold" ml={2}>신호 강도</Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color={isOnline ? "blue.600" : "gray.400"}>
                  {isOnline ? "-45dBm" : "--"}
                </Text>
                <Progress value={isOnline ? 90 : 0} colorScheme="blue" size="sm" mt={2} />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {isOnline ? "우수한 연결" : "연결 없음"}
                </Text>
              </Box>

              {/* CPU */}
              <Box
                bg={cardBg}
                p={4}
                borderRadius="lg"
                shadow="sm"
                opacity={isOnline ? 1 : 0.5}
              >
                <Flex align="center" mb={2}>
                  <Icon as={FiActivity as any} w={5} h={5} color={isOnline ? "purple.500" : "gray.400"} />
                  <Text fontSize="sm" fontWeight="bold" ml={2}>CPU 사용률</Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color={isOnline ? "purple.600" : "gray.400"}>
                  {isOnline ? "42%" : "--"}
                </Text>
                <Progress value={isOnline ? 42 : 0} colorScheme="purple" size="sm" mt={2} />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {isOnline ? "정상 범위" : "데이터 없음"}
                </Text>
              </Box>

              {/* Temperature */}
              <Box
                bg={cardBg}
                p={4}
                borderRadius="lg"
                shadow="sm"
                opacity={isOnline ? 1 : 0.5}
              >
                <Flex align="center" mb={2}>
                  <Icon as={FiSettings as any} w={5} h={5} color={isOnline ? "orange.500" : "gray.400"} />
                  <Text fontSize="sm" fontWeight="bold" ml={2}>온도</Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color={isOnline ? "orange.600" : "gray.400"}>
                  {isOnline ? "38°C" : "--"}
                </Text>
                <Progress value={isOnline ? 60 : 0} colorScheme="orange" size="sm" mt={2} />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {isOnline ? "적정 온도" : "데이터 없음"}
                </Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default RobotDetailNew;
