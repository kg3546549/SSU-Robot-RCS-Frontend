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
import { FiUsers, FiTrendingUp, FiDollarSign, FiShoppingBag } from 'react-icons/fi';

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
              대시보드
            </Heading>
            <Text color="gray.500">오늘의 현황을 확인하세요</Text>
          </VStack>
          <Spacer />
          <HStack spacing={4}>
            <Button colorScheme="blue" size="sm">
              새로고침
            </Button>
            <Avatar size="sm" name="사용자" />
          </HStack>
        </Flex>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">총 사용자</StatLabel>
                  <StatNumber fontSize="2xl">1,234</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="blue.100" p={3} borderRadius="lg">
                <Icon as={FiUsers as any} w={6} h={6} color="blue.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">매출</StatLabel>
                  <StatNumber fontSize="2xl">₩2,456,000</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    4.05%
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="green.100" p={3} borderRadius="lg">
                <Icon as={FiDollarSign as any} w={6} h={6} color="green.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">주문</StatLabel>
                  <StatNumber fontSize="2xl">89</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    1.05%
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="orange.100" p={3} borderRadius="lg">
                <Icon as={FiShoppingBag as any} w={6} h={6} color="orange.500" />
              </Box>
            </Flex>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Flex align="center">
              <Box>
                <Stat>
                  <StatLabel color="gray.500">전환율</StatLabel>
                  <StatNumber fontSize="2xl">3.2%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    0.8%
                  </StatHelpText>
                </Stat>
              </Box>
              <Spacer />
              <Box bg="purple.100" p={3} borderRadius="lg">
                <Icon as={FiTrendingUp as any} w={6} h={6} color="purple.500" />
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>

        {/* Content Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Main Content */}
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4}>최근 활동</Heading>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">새로운 주문</Text>
                    <Text fontSize="sm" color="gray.500">주문 #1234가 접수되었습니다</Text>
                  </VStack>
                  <Badge colorScheme="green">새로운</Badge>
                </Flex>

                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">사용자 등록</Text>
                    <Text fontSize="sm" color="gray.500">5명의 새로운 사용자가 가입했습니다</Text>
                  </VStack>
                  <Badge colorScheme="blue">정보</Badge>
                </Flex>

                <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">시스템 업데이트</Text>
                    <Text fontSize="sm" color="gray.500">버전 1.2.3이 배포되었습니다</Text>
                  </VStack>
                  <Badge colorScheme="purple">업데이트</Badge>
                </Flex>
              </VStack>
            </Box>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm" w="100%">
                <Heading size="md" mb={4}>빠른 액션</Heading>
                <VStack spacing={3}>
                  <Button colorScheme="blue" w="100%" size="sm">
                    새 사용자 추가
                  </Button>
                  <Button colorScheme="green" w="100%" size="sm">
                    리포트 생성
                  </Button>
                  <Button colorScheme="orange" w="100%" size="sm">
                    설정 관리
                  </Button>
                </VStack>
              </Box>

              <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm" w="100%">
                <Heading size="md" mb={4}>최근 사용자</Heading>
                <VStack spacing={3}>
                  <Flex w="100%" align="center">
                    <Avatar size="sm" name="김철수" />
                    <VStack align="start" spacing={0} ml={3} flex={1}>
                      <Text fontSize="sm" fontWeight="semibold">김철수</Text>
                      <Text fontSize="xs" color="gray.500">5분 전</Text>
                    </VStack>
                  </Flex>

                  <Flex w="100%" align="center">
                    <Avatar size="sm" name="이영희" />
                    <VStack align="start" spacing={0} ml={3} flex={1}>
                      <Text fontSize="sm" fontWeight="semibold">이영희</Text>
                      <Text fontSize="xs" color="gray.500">10분 전</Text>
                    </VStack>
                  </Flex>

                  <Flex w="100%" align="center">
                    <Avatar size="sm" name="박민수" />
                    <VStack align="start" spacing={0} ml={3} flex={1}>
                      <Text fontSize="sm" fontWeight="semibold">박민수</Text>
                      <Text fontSize="xs" color="gray.500">1시간 전</Text>
                    </VStack>
                  </Flex>
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