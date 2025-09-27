import React, { useState } from 'react';
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
  Select,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMoreVertical, FiEdit3, FiTrash2, FiEye, FiRefreshCw } from 'react-icons/fi';
import { useRobots } from '../hooks/useRobots';
import { CreateRobotDto } from '../types/robot';
import apiService from '../services/api';

const RobotList: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // API 연동을 위한 hooks
  const { robots, loading, error, refreshRobots } = useRobots();

  // Form 상태 관리
  const [formData, setFormData] = useState<CreateRobotDto>({
    name: '',
    type: '',
    ipAddress: '',
    port: 8080,
    description: ''
  });
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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


  const handleCreateRobot = async () => {
    if (!formData.name || !formData.type || !formData.ipAddress) {
      toast({
        title: '입력 오류',
        description: '필수 항목을 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createRobot(formData);
      if (response.success) {
        toast({
          title: '로봇 생성 완료',
          description: '새 로봇이 성공적으로 등록되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onAddClose();
        setFormData({ name: '', type: '', ipAddress: '', port: 8080, description: '' });
        refreshRobots();
      } else {
        throw new Error(response.message || '로봇 생성에 실패했습니다.');
      }
    } catch (error) {
      toast({
        title: '생성 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRobot = async () => {
    if (!selectedRobotId) return;

    setIsSubmitting(true);
    try {
      const response = await apiService.deleteRobot(selectedRobotId);
      if (response.success) {
        toast({
          title: '로봇 삭제 완료',
          description: '로봇이 성공적으로 삭제되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        refreshRobots();
      } else {
        throw new Error(response.message || '로봇 삭제에 실패했습니다.');
      }
    } catch (error) {
      toast({
        title: '삭제 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" h="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.500">로봇 목록을 불러오는 중...</Text>
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
              로봇 목록 관리
            </Heading>
            <Text color="gray.500">등록된 모든 로봇을 관리하세요</Text>
          </VStack>
          <Spacer />
          <HStack spacing={3}>
            <Button
              size="sm"
              leftIcon={<Icon as={FiRefreshCw as any} />}
              onClick={refreshRobots}
              variant="outline"
            >
              새로고침
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FiPlus as any} />}
              onClick={onAddOpen}
            >
              새 로봇 추가
            </Button>
          </HStack>
        </Flex>

        {/* Robot Statistics */}
        <HStack spacing={6} mb={8}>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">총 로봇</Text>
            <Text fontSize="2xl" fontWeight="bold">{robots.length}</Text>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">온라인 로봇</Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {robots.filter(r => r.status === 'online').length}
            </Text>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">오프라인 로봇</Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              {robots.filter(r => r.status === 'offline' || r.status === 'error').length}
            </Text>
          </Box>
        </HStack>

        {/* Robot Table */}
        <Box bg={cardBg} borderRadius="lg" shadow="sm" overflow="hidden">
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>이름</Th>
                  <Th>로봇 ID</Th>
                  <Th>타입</Th>
                  <Th>상태</Th>
                  <Th>IP 주소</Th>
                  <Th>포트</Th>
                  <Th>마지막 접속</Th>
                  <Th>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {robots.map((robot) => {
                  return (
                    <Tr
                      key={robot.id}
                      _hover={{ bg: hoverBg, cursor: 'pointer' }}
                      onClick={() => navigate(`/robot-detail/${robot.id}`)}
                    >
                      <Td fontWeight="semibold">{robot.name}</Td>
                      <Td fontSize="sm" color="gray.600">{robot.id}</Td>
                      <Td>
                        <Badge variant="outline">{robot.type}</Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(robot.status)}>
                          {getStatusLabel(robot.status)}
                        </Badge>
                      </Td>
                      <Td fontSize="sm" color="gray.600">{robot.ipAddress}</Td>
                      <Td fontSize="sm" color="gray.600">{robot.port}</Td>
                      <Td fontSize="sm" color="gray.500">{formatLastSeen(robot.lastSeen)}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<Icon as={FiMoreVertical as any} />}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
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
                              onClick={() => {
                                setSelectedRobotId(robot.id);
                                onDeleteOpen();
                              }}
                            >
                              삭제
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })}
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
                <FormControl isRequired>
                  <FormLabel>로봇 이름</FormLabel>
                  <Input
                    placeholder="로봇 이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>로봇 타입</FormLabel>
                  <Select
                    placeholder="타입을 선택하세요"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Industrial Arm">산업용 로봇팔</option>
                    <option value="Mobile Robot">이동형 로봇</option>
                    <option value="Service Robot">서비스 로봇</option>
                    <option value="Cleaning Robot">청소 로봇</option>
                    <option value="Security Robot">보안 로봇</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>IP 주소</FormLabel>
                  <Input
                    placeholder="192.168.1.100"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>포트</FormLabel>
                  <Input
                    type="number"
                    placeholder="8080"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: parseInt(e.target.value) || 8080})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>설명</FormLabel>
                  <Input
                    placeholder="로봇 설명 (선택사항)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onAddClose} disabled={isSubmitting}>
                취소
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateRobot}
                isLoading={isSubmitting}
                loadingText="추가 중..."
              >
                추가
              </Button>
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
                로봇 ID: {selectedRobotId}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={1}>
                이 작업은 되돌릴 수 없습니다.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onDeleteClose} disabled={isSubmitting}>
                취소
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteRobot}
                isLoading={isSubmitting}
                loadingText="삭제 중..."
              >
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default RobotList;