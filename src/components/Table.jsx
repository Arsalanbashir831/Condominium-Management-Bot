import React, { useState } from 'react';
import { 
  Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Button, Box, Badge,  useDisclosure 
} from '@chakra-ui/react';
import AssignModal from './AssignModal';

const Table = ({ columns, data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  
  const handleAssignClick = (row) => {
    setSelectedRow(row);
    onOpen();
  };
  
  const handleContactClick = (row) => {
    console.log('Contact Technician clicked for:', row);
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
                {row.technician !='N/A' ? (
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

    isOpen={isOpen}
    onClose={onClose}
    selectedRow={selectedRow}
/>
     
    </Box>
  );
};

export default Table;
