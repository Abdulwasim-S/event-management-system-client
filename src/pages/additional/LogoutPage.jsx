import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner, Text, useToast } from "@chakra-ui/react";

const LogoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    localStorage.removeItem("token");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      status: "warning",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });

    const timeout = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Flex w={"100%"} h={"100vh"} justify={"center"} align={"center"}>
      <Flex>
        <Text>Redirecting...</Text>
        <Spinner />
      </Flex>
    </Flex>
  );
};

export default LogoutPage;
