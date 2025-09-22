import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Flex,
  Spacer,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMoreVertical, FiEdit3, FiTrash2, FiEye, FiBattery, FiWifi, FiCpu } from 'react-icons/fi';

const RobotList: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // 임시 로봇 데이터
  const robots = [
    {
      id: 'Robot-01',
      name: '청소로봇 A',
      status: '작업중',
      battery: 85,
      signal: 90,
      cpu: 42,
      lastSeen: '5분 전',
      type: '청소로봇'
    },
    {
      id: 'Robot-02',
      name: '배송로봇 B',
      status: '대기중',
      battery: 92,
      signal: 85,
      cpu: 25,
      lastSeen: '2분 전',
      type: '배송로봇'
    },
    {
      id: 'Robot-03',
      name: '보안로봇 C',
      status: '오프라인',
      battery: 0,
      signal: 0,
      cpu: 0,
      lastSeen: '2시간 전',
      type: '보안로봇'
    },
    {
      id: 'Robot-04',
      name: '청소로봇 D',
      status: '충전중',
      battery: 45,
      signal: 95,
      cpu: 15,
      lastSeen: '1분 전',
      type: '청소로봇'
    },
    {
      id: 'Robot-05',
      name: '운반로봇 E',
      status: '작업중',
      battery: 67,
      signal: 88,
      cpu: 65,
      lastSeen: '방금 전',
      type: '운반로봇'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '작업중': return 'green';
      case '대기중': return 'blue';
      case '충전중': return 'yellow';
      case '오프라인': return 'red';
      default: return 'gray';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'green';
    if (battery > 20) return 'yellow';
    return 'red';
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">
              로봇 목록 관리
            </Heading>
            <Text color="gray.500">등록된 모든 로봇을 관리하세요</Text>
          </VStack>
          <Spacer />
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={FiPlus as any} />}
            onClick={onAddOpen}
          >
            새 로봇 추가
          </Button>
        </Flex>

        {/* Robot Statistics */}
        <HStack spacing={6} mb={8}>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">총 로봇</Text>
            <Text fontSize="2xl" fontWeight="bold">{robots.length}</Text>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">활성 로봇</Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {robots.filter(r => r.status !== '오프라인').length}
            </Text>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">경고</Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              {robots.filter(r => r.battery < 20).length}
            </Text>
          </Box>
        </HStack>

        {/* Robot Table */}
        <Box bg={cardBg} borderRadius="lg" shadow="sm" overflow="hidden">
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>로봇 ID</Th>
                  <Th>이름</Th>
                  <Th>타입</Th>
                  <Th>상태</Th>
                  <Th>배터리</Th>
                  <Th>신호</Th>
                  <Th>CPU</Th>
                  <Th>마지막 접속</Th>
                  <Th>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {robots.map((robot) => (
                  <Tr key={robot.id}>
                    <Td fontWeight="semibold">{robot.id}</Td>
                    <Td>{robot.name}</Td>
                    <Td>
                      <Badge variant="outline">{robot.type}</Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(robot.status)}>
                        {robot.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Icon as={FiBattery as any} color={`${getBatteryColor(robot.battery)}.500`} />
                        <Text fontSize="sm">{robot.battery}%</Text>
                        <Progress
                          value={robot.battery}
                          size="sm"
                          width="50px"
                          colorScheme={getBatteryColor(robot.battery)}
                        />
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Icon as={FiWifi as any} color={robot.signal > 50 ? 'blue.500' : 'red.500'} />
                        <Text fontSize="sm">{robot.signal}%</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Icon as={FiCpu as any} color={robot.cpu > 70 ? 'red.500' : 'green.500'} />
                        <Text fontSize="sm">{robot.cpu}%</Text>
                      </HStack>
                    </Td>
                    <Td fontSize="sm" color="gray.500">{robot.lastSeen}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FiMoreVertical as any} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <Link to={`/robot-detail/${robot.id}`}>
                            <MenuItem icon={<Icon as={FiEye as any} />}>
                              상세 보기
                            </MenuItem>
                          </Link>
                          <MenuItem icon={<Icon as={FiEdit3 as any} />}>
                            수정
                          </MenuItem>
                          <MenuItem
                            icon={<Icon as={FiTrash2 as any} />}
                            color="red.500"
                            onClick={onDeleteOpen}
                          >
                            삭제
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Add Robot Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>새 로봇 추가</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>로봇 ID</FormLabel>
                  <Input placeholder="Robot-XX" />
                </FormControl>
                <FormControl>
                  <FormLabel>로봇 이름</FormLabel>
                  <Input placeholder="로봇 이름을 입력하세요" />
                </FormControl>
                <FormControl>
                  <FormLabel>로봇 타입</FormLabel>
                  <Select placeholder="타입을 선택하세요">
                    <option value="cleaning">청소로봇</option>
                    <option value="delivery">배송로봇</option>
                    <option value="security">보안로봇</option>
                    <option value="transport">운반로봇</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>IP 주소</FormLabel>
                  <Input placeholder="192.168.1.100" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onAddClose}>
                취소
              </Button>
              <Button colorScheme="blue">추가</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>로봇 삭제</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>정말로 이 로봇을 삭제하시겠습니까?</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                이 작업은 되돌릴 수 없습니다.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onDeleteClose}>
                취소
              </Button>
              <Button colorScheme="red">삭제</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default RobotList;