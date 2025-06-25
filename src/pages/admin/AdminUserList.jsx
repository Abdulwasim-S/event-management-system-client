import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Button,
  Flex,
  Heading,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { api_link } from "../../helper/urls";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNumber = 0, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${api_link}/admin/users`, {
        params: {
          page: pageNumber,
          size: 5,
          search: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${localStorage["token"]}`,
        },
      });

      const data = response.data.data;
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(0, value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box w={"100%"} mx="auto" px={4} py={6}>
      <Heading fontSize={["2xl", "3xl", "4xl"]} mb={6}>
        Admin - User List
      </Heading>

      <Input
        placeholder="Search by username or email"
        value={search}
        onChange={handleSearchChange}
        mb={4}
        size="md"
      />

      <Box overflowX="auto" borderRadius="lg" boxShadow="md">
        {loading ? (
          <Flex justify="center" align="center" py={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table variant="simple" size="md">
            <Thead bg="blue.500">
              <Tr>
                <Th color="white">S.No</Th>
                <Th color="white">Email</Th>
                <Th color="white">Username</Th>
                <Th color="white">Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <Tr key={user.id}>
                    <Td>{page * 5 + index + 1}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.username}</Td>
                    <Td textTransform="capitalize">{user.role}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center" py={4}>
                    <Text>No users found.</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </Box>

      {totalPages > 1 && (
        <Flex justify="center" align="center" mt={6} gap={4} wrap="wrap">
          <IconButton
            icon={<ArrowLeftIcon />}
            aria-label="Previous"
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 0}
            colorScheme="blue"
            size={"sm"}
            px={5}
          />
          <Text>
            Page {page + 1} of {totalPages}
          </Text>
          <IconButton
            icon={<ArrowRightIcon />}
            aria-label="Next"
            onClick={() => handlePageChange(page + 1)}
            isDisabled={page === totalPages - 1}
            colorScheme="blue"
            size={"sm"}
            px={5}
          />
        </Flex>
      )}
    </Box>
  );
};

export default AdminUserList;
