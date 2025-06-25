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
import { api_link } from "../../helper/urls"; // Ensure this path is correct

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const UserSignup = () => {
  const toast = useToast();
  const navTo = useNavigate();

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, purple.400, blue.400)"
      p={6}
      bgImage={"/event.jpg"} // Ensure this image path is correct
      bgSize={"cover"}
    >
      <Box bg="white" p={8} rounded="xl" boxShadow="2xl" maxW="md" w="full">
        <Flex justify="center" mb={6}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" // Your logo
            alt="Shadow Events Logo"
            boxSize="60px"
          />
        </Flex>
        <Heading textAlign="center" fontSize="2xl" mb={6}>
          Join Shadow Events
        </Heading>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, actions) => {
            try {
              // Destructure values to send only necessary fields
              const { confirmPassword, ...dataToSend } = values;
              const response = await axios.post(
                `${api_link}/auth/signup`, // Adjust your registration API endpoint
                dataToSend
              );

              console.log(response.data); // Log the response for debugging

              toast({
                title: "Account created!",
                description: "You have successfully signed up. Please log in.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              navTo("/"); // Redirect to login page after successful signup
            } catch (error) {
              if (error.response) {
                if (error.response.status < 500) {
                  toast({
                    title: "Registration Failed",
                    description:
                      error.response.data.message ||
                      "Please check your details and try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                } else if (error.response.status === 500) {
                  toast({
                    title: "Server Error",
                    description:
                      "Something went wrong on our end. Please try again later.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              } else {
                toast({
                  title: "Network Error",
                  description:
                    "Unable to connect to the server. Check your internet connection.",
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
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field name="username">
                {({ field }) => (
                  <FormControl
                    mb={4}
                    isInvalid={errors.username && touched.username}
                  >
                    <FormLabel>Username</FormLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your username"
                    />
                    <Text fontSize="sm" color="red.500">
                      {errors.username && touched.username
                        ? errors.username
                        : ""}
                    </Text>
                  </FormControl>
                )}
              </Field>

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
                      placeholder="Create a password"
                    />
                    <Text fontSize="sm" color="red.500">
                      {errors.password && touched.password
                        ? errors.password
                        : ""}
                    </Text>
                  </FormControl>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field }) => (
                  <FormControl
                    mb={4}
                    isInvalid={
                      errors.confirmPassword && touched.confirmPassword
                    }
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your password"
                    />
                    <Text fontSize="sm" color="red.500">
                      {errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
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
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <Flex w={"100%"} justifyContent={"center"} mt={5}>
          <Text>Already have an account? </Text>
          <Stack pr={1} />
          <Link
            href="/login" // Link to your login page
            fontWeight={"500"}
            color={"blue.500"}
            fontStyle={"italic"}
          >
            Login here
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UserSignup;
