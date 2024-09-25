import React from 'react';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // Dynamic links for the navbar
  const navLinks = [
    { path: '/addUser', name: 'New User' },
    { path: '/ticketList', name: 'Ticket List' },
    // { path: '/addTicket', name: 'Add Ticket' },
  ];

  return (
    <Box bg="gray.800" py={4} px={8} className="shadow-lg">
      <Flex as="nav" justify="space-between" align="center">
        <Box className="text-white font-bold text-xl">Condominium Manager</Box>

        {/* Dynamic Nav Links */}
        <Flex gap={6} alignItems={'center'}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-white bg-blue-500 font-bold px-4 py-2 rounded-md'
                  : 'text-white hover:text-blue-300'
              }
            >
              {link.name}
            </NavLink>
          ))}
        </Flex>

        {/* Example Button */}
        <Button colorScheme="yellow" variant="outline" size="sm">
         Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;