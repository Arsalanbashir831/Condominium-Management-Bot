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
import EditModal from "./Modals/EditModal";
import CloseTicketModal from "./Modals/CloseTicketModal";

const Table = ({ columns, data }) => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isCloseTicketOpen,
    onOpen: onCloseTicketOpen,
    onClose: onCloseTicketClose,
  } = useDisclosure();

  const [selectedRow, setSelectedRow] = useState(null);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    onEditOpen();
  };

  const handleCloseTicketClick = (row) => {
    setSelectedRow(row);
    onCloseTicketOpen();
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
                        row[column.accessor] === "fairly urgent." ||
                        row[column.accessor] === "fairly urgent"
                          ? "red"
                          : row[column.accessor] === "urgent." ||
                            row[column.accessor] === "urgent"
                          ? "yellow"
                          : "green"
                      }
                      variant="solid"
                    >
                      {row[column.accessor] === "fairly urgent." ||
                      row[column.accessor] === "fairly urgent"
                        ? "Fairly Urgent"
                        : row[column.accessor] === "urgent." ||
                          row[column.accessor] === "urgent"
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
                    onClick={() => handleEditClick(row)}
                    colorScheme="blue"
                    variant="solid"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleCloseTicketClick(row)}
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

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        selectedRow={selectedRow}
      />

      {/* Close Ticket Modal */}
      <CloseTicketModal
        isOpen={isCloseTicketOpen}
        onClose={onCloseTicketClose}
        selectedRow={selectedRow}
      />
    </Box>
  );
};

export default Table;
