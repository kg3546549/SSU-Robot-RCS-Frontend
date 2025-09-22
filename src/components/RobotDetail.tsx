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
  SliderThumb
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { FiBattery, FiWifi, FiActivity, FiSettings, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';

const RobotDetail: React.FC = () => {
  const { robotId } = useParams<{ robotId: string }>();
  const currentRobotId = robotId || "Robot-01";
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">
              {currentRobotId} 상세 제어
            </Heading>
            <Text color="gray.500">로봇의 실시간 상태를 확인하고 제어하세요</Text>
          </VStack>
          <Spacer />
          <HStack spacing={4}>
            <Button colorScheme="blue" size="sm" leftIcon={<Icon as={FiRefreshCw as any} />}>
              새로고침
            </Button>
            <Badge colorScheme="green" fontSize="md" p={2}>온라인</Badge>
          </HStack>
        </Flex>

        {/* Robot Status Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">배터리</StatLabel>
                  <StatNumber fontSize="2xl">85%</StatNumber>
                  <StatHelpText>4시간 30분 남음</StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="green.100" p={3} borderRadius="lg">
                <Icon as={FiBattery as any} w={6} h={6} color="green.500" />
              </Box>
            </Flex>
            <Progress value={85} colorScheme="green" size="sm" mt={3} />
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">신호 강도</StatLabel>
                  <StatNumber fontSize="2xl">-45dBm</StatNumber>
                  <StatHelpText>우수한 연결</StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="blue.100" p={3} borderRadius="lg">
                <Icon as={FiWifi as any} w={6} h={6} color="blue.500" />
              </Box>
            </Flex>
            <Progress value={90} colorScheme="blue" size="sm" mt={3} />
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">CPU 사용률</StatLabel>
                  <StatNumber fontSize="2xl">42%</StatNumber>
                  <StatHelpText>정상 범위</StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="purple.100" p={3} borderRadius="lg">
                <Icon as={FiActivity as any} w={6} h={6} color="purple.500" />
              </Box>
            </Flex>
            <Progress value={42} colorScheme="purple" size="sm" mt={3} />
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">온도</StatLabel>
                  <StatNumber fontSize="2xl">38°C</StatNumber>
                  <StatHelpText>적정 온도</StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="orange.100" p={3} borderRadius="lg">
                <Icon as={FiSettings as any} w={6} h={6} color="orange.500" />
              </Box>
            </Flex>
            <Progress value={60} colorScheme="orange" size="sm" mt={3} />
          </Box>
        </SimpleGrid>

        {/* Control Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
          {/* Robot Controls */}
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={6}>로봇 제어</Heading>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Button colorScheme="green" leftIcon={<Icon as={FiPlay as any} />} flex={1}>
                    시작
                  </Button>
                  <Button colorScheme="red" leftIcon={<Icon as={FiPause as any} />} flex={1}>
                    정지
                  </Button>
                </HStack>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-mode" mb="0">
                    자동 모드
                  </FormLabel>
                  <Switch id="auto-mode" colorScheme="blue" />
                </FormControl>

                <Box>
                  <FormLabel>속도 조절</FormLabel>
                  <Slider defaultValue={50} min={0} max={100}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>

                <Button colorScheme="orange" w="100%">
                  긴급 정지
                </Button>
              </VStack>
            </Box>
          </GridItem>

          {/* Robot Settings */}
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={6}>로봇 설정</Heading>
              <VStack spacing={6} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="night-mode" mb="0">
                    야간 모드
                  </FormLabel>
                  <Switch id="night-mode" colorScheme="purple" />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sound-alerts" mb="0">
                    소리 알림
                  </FormLabel>
                  <Switch id="sound-alerts" colorScheme="green" defaultChecked />
                </FormControl>

                <Box>
                  <FormLabel>청소 강도</FormLabel>
                  <Slider defaultValue={75} min={0} max={100}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>

                <Button colorScheme="blue" w="100%">
                  설정 저장
                </Button>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Status Log */}
        <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>상태 로그</Heading>
          <VStack spacing={3} align="stretch">
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
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default RobotDetail;