import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  useColorModeValue,
  SimpleGrid,
  Button,
  Input,
  Select,
  Divider,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

const Settings: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <VStack align="start" spacing={1} mb={8}>
          <Heading size="lg" color="gray.700">
            시스템 설정
          </Heading>
          <Text color="gray.500">로봇 관리 시스템의 전반적인 설정을 관리하세요</Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* General Settings */}
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={6}>일반 설정</Heading>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="auto-refresh" mb="0" flex={1}>
                  자동 새로고침
                </FormLabel>
                <Switch id="auto-refresh" colorScheme="blue" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="notifications" mb="0" flex={1}>
                  푸시 알림
                </FormLabel>
                <Switch id="notifications" colorScheme="green" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="dark-mode" mb="0" flex={1}>
                  다크 모드
                </FormLabel>
                <Switch id="dark-mode" colorScheme="purple" />
              </FormControl>

              <FormControl>
                <FormLabel>새로고침 간격</FormLabel>
                <Select defaultValue="30">
                  <option value="10">10초</option>
                  <option value="30">30초</option>
                  <option value="60">1분</option>
                  <option value="300">5분</option>
                </Select>
              </FormControl>
            </VStack>
          </Box>

          {/* Robot Settings */}
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={6}>로봇 설정</Heading>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="auto-connect" mb="0" flex={1}>
                  자동 연결
                </FormLabel>
                <Switch id="auto-connect" colorScheme="blue" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="battery-alerts" mb="0" flex={1}>
                  배터리 경고
                </FormLabel>
                <Switch id="battery-alerts" colorScheme="orange" defaultChecked />
              </FormControl>

              <FormControl>
                <FormLabel>배터리 경고 임계값</FormLabel>
                <Select defaultValue="20">
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>기본 로봇 타입</FormLabel>
                <Select defaultValue="cleaning">
                  <option value="cleaning">청소로봇</option>
                  <option value="delivery">배송로봇</option>
                  <option value="security">보안로봇</option>
                  <option value="transport">운반로봇</option>
                </Select>
              </FormControl>
            </VStack>
          </Box>

          {/* Network Settings */}
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={6}>네트워크 설정</Heading>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>서버 IP 주소</FormLabel>
                <Input defaultValue="192.168.1.100" />
              </FormControl>

              <FormControl>
                <FormLabel>포트 번호</FormLabel>
                <Input defaultValue="8080" />
              </FormControl>

              <FormControl>
                <FormLabel>연결 타임아웃 (초)</FormLabel>
                <Select defaultValue="30">
                  <option value="10">10초</option>
                  <option value="30">30초</option>
                  <option value="60">60초</option>
                  <option value="120">120초</option>
                </Select>
              </FormControl>

              <Button colorScheme="blue" size="sm">
                연결 테스트
              </Button>
            </VStack>
          </Box>

          {/* Security Settings */}
          <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={6}>보안 설정</Heading>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="two-factor" mb="0" flex={1}>
                  2단계 인증
                </FormLabel>
                <Switch id="two-factor" colorScheme="red" />
              </FormControl>

              <FormControl>
                <FormLabel>세션 타임아웃 (분)</FormLabel>
                <Select defaultValue="60">
                  <option value="30">30분</option>
                  <option value="60">1시간</option>
                  <option value="120">2시간</option>
                  <option value="480">8시간</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>로그 보관 기간 (일)</FormLabel>
                <Select defaultValue="30">
                  <option value="7">7일</option>
                  <option value="30">30일</option>
                  <option value="90">90일</option>
                  <option value="365">1년</option>
                </Select>
              </FormControl>

              <Button colorScheme="red" variant="outline" size="sm">
                모든 세션 종료
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        <Divider my={8} />

        {/* System Info */}
        <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={6}>시스템 정보</Heading>
          <Alert status="success" mb={4}>
            <AlertIcon />
            시스템이 정상적으로 작동 중입니다.
          </Alert>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.500">버전</Text>
              <Text fontWeight="semibold">v1.0.0</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">마지막 업데이트</Text>
              <Text fontWeight="semibold">2024-01-15</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">시스템 상태</Text>
              <Text fontWeight="semibold" color="green.500">정상</Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Action Buttons */}
        <HStack spacing={4} mt={8} justify="center">
          <Button colorScheme="blue" size="lg">
            설정 저장
          </Button>
          <Button variant="outline" size="lg">
            기본값 복원
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};

export default Settings;