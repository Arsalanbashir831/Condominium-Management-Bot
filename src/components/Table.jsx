import React, { useState } from 'react';
import {
  Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Button, Box, Badge, useDisclosure
} from '@chakra-ui/react';
import AssignModal from './AssignModal';
import ContactModal from './ContactModal'; 

const Table = ({ columns, data }) => {
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onClose: onAssignClose } = useDisclosure();
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure();

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null); 

  const handleAssignClick = (row) => {
    setSelectedRow(row);
    onAssignOpen();
  };

  const handleContactClick = (row) => {
    setSelectedTechnician({
      description:"testing",
      contactNumber:"3424324",
      email:"abc@gmail.com"
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
            <Th color="white" fontWeight="semibold">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column) => (
                <Td key={column.accessor} color="gray.600">
                  {column.type === 'badge' ? (
                    <Badge
                      colorScheme={row[column.accessor] === 'Urgent' ? 'red' : 'green'}
                      variant="solid"
                    >
                      {row[column.accessor] === 'Urgent' ? 'Urgent' : 'Normal'}
                    </Badge>
                  ) : (
                    row[column.accessor] || 'N/A'
                  )}
                </Td>
              ))}
              <Td>
                {row.technician !== 'N/A' ? (
                  <Button
                    onClick={() => handleContactClick(row)}
                    colorScheme="green"
                    variant="solid"
                  >
                    Contact Technician
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAssignClick(row)}
                    colorScheme="purple"
                    variant="solid"
                  >
                    Assign Technician
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      
      <AssignModal
        isOpen={isAssignOpen}
        onClose={onAssignClose}
        selectedRow={selectedRow}
      />
      
      <ContactModal
        isOpen={isContactOpen}
        onClose={onContactClose}
        technician={selectedTechnician} 
      />
    </Box>
  );
};

export default Table;
