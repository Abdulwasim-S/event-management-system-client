import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Avatar,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Dummy user data - replace with actual user context/state
  const user = {
    isAuthenticated: true,
    name: "Aa Nn",
    profilePic: "https://via.placeholder.com/150",
  };

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef();

  const confirmLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have successfully logged out.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    setIsLogoutOpen(false);
    navigate("/user/login");
  };

  return (
    <Box
      bg="white"
      px={4}
      py={3}
      shadow="md"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex>
        {/* Logo */}
        <Link
          onClick={() => navigate("/user/home")}
          _hover={{ textDecoration: "none" }}
        >
          <Flex align="center">
            <Image
              src="/logo2.png"
              alt="Your Event Logo"
              h="30px"
              mr={2}
              height={"5vh"}
            />
            <Heading
              fontSize="3xl"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
            >
              Shadow Events
            </Heading>
          </Flex>
        </Link>

        <Spacer />

        {/* Right */}
        <Flex align="center">
          {user.isAuthenticated ? (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  p={0}
                  _hover={{ bg: "transparent" }}
                >
                  <Avatar
                    name={user.name || "AN"}
                    src={user.profilePic}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                    bg="purple.500"
                    color="white"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate("/user/home")}>
                    Home
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/user/my-tickets")}>
                    My Tickets
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => setIsLogoutOpen(true)}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* Logout Confirmation Dialog */}
              <AlertDialog
                isOpen={isLogoutOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsLogoutOpen(false)}
                isCentered
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Confirm Logout
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to log out?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={() => setIsLogoutOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={confirmLogout} ml={3}>
                        Logout
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          ) : (
            <Button colorScheme="blue" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavbarComponent;
