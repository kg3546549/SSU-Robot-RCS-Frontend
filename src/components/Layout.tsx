import React from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Icon
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // 모바일에서는 drawer, 데스크톱에서는 fixed sidebar
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Menu Button */}
      {isMobile && (
        <Box position="fixed" top={4} left={4} zIndex={1000}>
          <IconButton
            icon={<Icon as={FiMenu as any} />}
            aria-label="Open Menu"
            onClick={onOpen}
            colorScheme="blue"
            size="md"
          />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <Sidebar onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box
        ml={isMobile ? 0 : "280px"}
        transition="margin-left 0.3s"
      >
        <Box minH="100vh">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;