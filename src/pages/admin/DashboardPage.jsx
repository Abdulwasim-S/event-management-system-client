import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
  useColorModeValue,
  SimpleGrid,
  Divider,
  VStack,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatBox from "./StatBox"; // Import the reusable StatBox
import {
  FaCalendarAlt,
  FaClipboardList,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { CheckCircleIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { api_link } from "../../helper/urls";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  //   const sectionBg = useColorModeValue("gray.50", "gray.900");
  const sectionBg = "white";
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${api_link}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage["token"]}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box bg={sectionBg} minH="100vh" py={10} px={{ base: 4, md: 10 }}>
      <Heading mb={8} textAlign="center">
        📊 Admin Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatBox
          label="Total Events"
          value={stats.totalEvents}
          icon={FaCalendarAlt}
          iconColor="#3182ce" // blue
        />
        <StatBox
          label="Total Bookings"
          value={stats.totalBookings}
          icon={FaClipboardList}
          iconColor="#dd6b20" // orange
        />
        <StatBox
          label="Total Users"
          value={stats.totalUsers}
          icon={FaUsers}
          iconColor="#ed64a6" // pink
        />
        <StatBox
          label="Booking Completion"
          value={stats.bookingCompletionRate.toFixed(1) + "%"}
          icon={FaChartLine}
          iconColor="#805ad5" // purple
        />
      </SimpleGrid>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 3fr" }}
        gap={6}
        mt={10}
      >
        {/* Income Summary */}
        <Flex
          flexDir={"column"}
          justifyContent={"center"}
          bg={cardBg}
          borderRadius="lg"
          p={6}
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            💰 Total Income
          </Text>

          <Text fontSize="3xl" fontWeight="bold" color="green.500">
            ₹ {stats.totalIncome.toFixed(2)}
          </Text>

          <Divider my={4} />

          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Booking Status Summary
          </Text>

          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Confirmed Bookings: <strong>{stats.confirmedCount}</strong>
            </ListItem>
            <ListItem>
              <ListIcon as={WarningIcon} color="orange.400" />
              Pending Bookings: <strong>{stats.pendingCount}</strong>
            </ListItem>
            <ListItem>
              <ListIcon as={CloseIcon} color="red.500" />
              Cancelled Bookings: <strong>{stats.cancelledCount}</strong>
            </ListItem>
          </List>
        </Flex>

        {/* Income Graph */}
        <Box
          bg={cardBg}
          borderRadius="lg"
          p={6}
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            📈 Income Over Time
          </Text>
          {stats.incomeOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.incomeOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Income"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={
                    stats.incomeOverTime.length > 1 &&
                    stats.incomeOverTime.at(-1).income >
                      stats.incomeOverTime.at(-2).income
                      ? "#38A169"
                      : "#E53E3E"
                  }
                  strokeWidth={3}
                  dot={({ index, cx, cy }) =>
                    index === stats.incomeOverTime.length - 1 ? (
                      <circle
                        key={`dot-${index}`}
                        cx={cx}
                        cy={cy}
                        r={6}
                        stroke="black"
                        strokeWidth={2}
                        fill="white"
                      />
                    ) : null
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Text color="gray.500">No income data available.</Text>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
