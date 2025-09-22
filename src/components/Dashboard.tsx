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
  StatArrow,
  Badge,
  Flex,
  Spacer,
  Avatar,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiCpu, FiBattery, FiWifi, FiActivity } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">
              로봇 관리 대시보드
            </Heading>
            <Text color="gray.500">로봇 현황을 실시간으로 모니터링하세요</Text>
          </VStack>
          <Spacer />
          <HStack spacing={4}>
            <Button colorScheme="blue" size="sm">
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
                  <StatNumber fontSize="2xl">12</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    2대 증가
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
                  <StatLabel color="gray.500">활성 로봇</StatLabel>
                  <StatNumber fontSize="2xl">8</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    66.7% 가동률
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
                  <StatLabel color="gray.500">배터리 경고</StatLabel>
                  <StatNumber fontSize="2xl">3</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    낮은 배터리
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
                  <StatNumber fontSize="2xl">10</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    온라인
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
              <Heading size="md" mb={4}>로봇 상태 알림</Heading>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">Robot-01 배터리 부족</Text>
                    <Text fontSize="sm" color="gray.500">배터리 잔량 15% - 충전 필요</Text>
                  </VStack>
                  <Badge colorScheme="red">경고</Badge>
                </Flex>

                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">Robot-05 작업 완료</Text>
                    <Text fontSize="sm" color="gray.500">청소 작업이 성공적으로 완료되었습니다</Text>
                  </VStack>
                  <Badge colorScheme="green">완료</Badge>
                </Flex>

                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">Robot-03 연결 끊김</Text>
                    <Text fontSize="sm" color="gray.500">WiFi 연결이 불안정합니다</Text>
                  </VStack>
                  <Badge colorScheme="orange">주의</Badge>
                </Flex>

                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">Robot-08 새로 등록</Text>
                    <Text fontSize="sm" color="gray.500">새로운 로봇이 시스템에 추가되었습니다</Text>
                  </VStack>
                  <Badge colorScheme="blue">정보</Badge>
                </Flex>
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
                  <Link to="/robot-detail/Robot-01" style={{ width: '100%' }}>
                    <Flex w="100%" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }} cursor="pointer">
                      <Box w={3} h={3} bg="green.400" borderRadius="full" />
                      <VStack align="start" spacing={0} ml={3} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold">Robot-01</Text>
                        <Text fontSize="xs" color="gray.500">작업 중 • 85%</Text>
                      </VStack>
                    </Flex>
                  </Link>

                  <Link to="/robot-detail/Robot-05" style={{ width: '100%' }}>
                    <Flex w="100%" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }} cursor="pointer">
                      <Box w={3} h={3} bg="green.400" borderRadius="full" />
                      <VStack align="start" spacing={0} ml={3} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold">Robot-05</Text>
                        <Text fontSize="xs" color="gray.500">대기 중 • 92%</Text>
                      </VStack>
                    </Flex>
                  </Link>

                  <Link to="/robot-detail/Robot-03" style={{ width: '100%' }}>
                    <Flex w="100%" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }} cursor="pointer">
                      <Box w={3} h={3} bg="red.400" borderRadius="full" />
                      <VStack align="start" spacing={0} ml={3} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold">Robot-03</Text>
                        <Text fontSize="xs" color="gray.500">오프라인 • 0%</Text>
                      </VStack>
                    </Flex>
                  </Link>

                  <Link to="/robot-detail/Robot-07" style={{ width: '100%' }}>
                    <Flex w="100%" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }} cursor="pointer">
                      <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
                      <VStack align="start" spacing={0} ml={3} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold">Robot-07</Text>
                        <Text fontSize="xs" color="gray.500">충전 중 • 45%</Text>
                      </VStack>
                    </Flex>
                  </Link>
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