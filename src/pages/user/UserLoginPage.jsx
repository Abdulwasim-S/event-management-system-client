import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Image,
  useToast,
  Link,
  Stack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_link } from "../../helper/urls";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

const UserLogin = () => {
  const toast = useToast();
  const navTo = useNavigate();

  const handleDemoLogin = (setFieldValue) => {
    setFieldValue("email", "user@shadowevents.com");
    setFieldValue("password", "12345678");
    toast({
      title: "Demo credentials filled.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, purple.400, blue.400)"
      p={6}
      bgImage={"/event.jpg"}
      bgSize={"cover"}
    >
      <Box bg="white" p={8} rounded="xl" boxShadow="2xl" maxW="md" w="full">
        <Flex justify="center" mb={6}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
            alt="Shadow Events Logo"
            boxSize="60px"
          />
        </Flex>
        <Heading textAlign="center" fontSize="2xl" mb={6}>
          Welcome to Shadow Events
        </Heading>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, actions) => {
            try {
              const response = await axios.post(
                `${api_link}/auth/login`,
                values
              );
              console.log(response.data.token);
              localStorage.setItem("token", response.data.token);

              toast({
                title: "Logged in successfully!",
                description: `Welcome, ${values.email}`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              navTo("/user/home");
            } catch (error) {
              if (error.response) {
                if (error.response.status < 500) {
                  toast({
                    title: "Login Failed",
                    description:
                      error.response.data.message || "Invalid credentials",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                } else if (error.response.status === 500) {
                  toast({
                    title: "Server Error",
                    description:
                      "Something went wrong. Please try again later.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              } else {
                toast({
                  title: "Error",
                  description: "Unable to connect to the server.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Field name="email">
                {({ field }) => (
                  <FormControl mb={4} isInvalid={errors.email && touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                    <Text fontSize="sm" color="red.500">
                      {errors.email && touched.email ? errors.email : ""}
                    </Text>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }) => (
                  <FormControl
                    mb={4}
                    isInvalid={errors.password && touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                    <Text fontSize="sm" color="red.500">
                      {errors.password && touched.password
                        ? errors.password
                        : ""}
                    </Text>
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                isLoading={isSubmitting}
                mb={3}
              >
                Login
              </Button>

              <Button
                variant="outline"
                colorScheme="purple"
                w="full"
                onClick={() => handleDemoLogin(setFieldValue)}
              >
                Use Demo Credentials
              </Button>
            </Form>
          )}
        </Formik>
        <Flex w={"100%"} justifyContent={"center"} mt={5}>
          <Text>SignUp for New account - </Text>
          <Stack pr={1} />
          <Link
            href="/user/signup"
            fontWeight={"500"}
            color={"blue.500"}
            fontStyle={"italic"}
          >
            click here
          </Link>
        </Flex>
        <Flex w={"100%"} justifyContent={"center"}>
          <Text>Login as Admin - </Text>
          <Stack pr={1} />
          <Link
            href="/admin/login"
            fontWeight={"500"}
            color={"blue.500"}
            fontStyle={"italic"}
          >
            click here
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UserLogin;
