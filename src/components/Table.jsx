import React, { useState } from "react";
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Badge,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import AssignModal from "./AssignModal";
import ContactModal from "./ContactModal";

const Table = ({ columns, data }) => {
  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose,
  } = useDisclosure();

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const handleAssignClick = (row) => {
    setSelectedRow(row);
    onAssignOpen();
  };

  const handleContactClick = (row) => {
    setSelectedTechnician({
      description: "testing",
      contactNumber: "3424324",
      email: "abc@gmail.com",
    });
    onContactOpen();
  };

  return (
    <Box overflowX="auto">
      <ChakraTable variant="striped" colorScheme="purple" minWidth="full">
        <Thead bg="purple.900">
          <Tr>
            {columns.map((column) => (
              <Th key={column.accessor} color="white" fontWeight="semibold">
                {column.Header}
              </Th>
            ))}
            <Th color="white" fontWeight="semibold">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column) => (
                <Td key={column.accessor} color="gray.600">
                  {column.type === "badge" ? (
                    <Badge
                      colorScheme={
                        row[column.accessor] === "very urgent"
                          ? "red"
                          : row[column.accessor] === "urgent"
                          ? "yellow"
                          : "green"
                      }
                      variant="solid"
                    >
                      {row[column.accessor] === "very urgent"
                        ? "Very Urgent"
                        : row[column.accessor] === "urgent"
                        ? "Urgent"
                        : "Normal"}
                    </Badge>
                  ) : (
                    row[column.accessor] || "N/A"
                  )}
                </Td>
              ))}
              <Td>
            <Flex gap={2}>
            <Button
                    // onClick={() => handleContactClick(row)}
                    colorScheme="blue"
                    variant="solid"
                  >
                  Edit
                  </Button>
              
                  <Button
                    // onClick={() => handleAssignClick(row)}
                    colorScheme="red"
                    variant="solid"
                  >
                   Close Ticket
                  </Button>
            </Flex>
              
             
              </Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>

      {/* <AssignModal
        isOpen={isAssignOpen}
        onClose={onAssignClose}
        selectedRow={selectedRow}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={onContactClose}
        technician={selectedTechnician}
      /> */}
    </Box>
  );
};

export default Table;
