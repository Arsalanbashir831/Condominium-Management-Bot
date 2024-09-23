import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { BACKEND_URL } from "../Constant";
import { Box, Button, Flex, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { refreshState } from "../atoms/refreshState";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TicketList = () => {
  const [ticketList, setTicketList] = useState([]);
  const [isLoading , setLoading] = useState(false);
  const refresh  = useRecoilValue(refreshState)
const navigation = useNavigate()
  const processTicketsData = (data) => {
    return data.map(ticket => ({
      id:ticket.id,
        name: ticket.user.name || '',
        email: ticket.user.email || '',
        contactNumber: ticket.user.contactNumber || '',
        condominium: ticket.user.condominium.name || '',
        problemStatement: ticket.ProblemStatement || '',
        priority: ticket.priority || '',
        technician: ticket.assigned_technicians.CompanyName || '',
        role: ticket.assigned_technicians.SectorName || '',
        prefCommunication: ticket.assigned_technicians.prefCommunication.name || '',
        technicianContact: ticket.assigned_technicians.prefCommunication.name==='Email'?ticket.assigned_technicians.email:ticket.assigned_technicians.ContactNumber,
        status:"Pending"
    }));
};
  const fetchTickets = async () => {
    try {
        setLoading(true)
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BACKEND_URL}/api/ticket/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTicketList(processTicketsData(data));
      } else {
        console.error(
          `Fetch failed with status ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally{
        setLoading(false)
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);
  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Contact Number", accessor: "contactNumber" },
    { Header: "Condominium", accessor: "condominium" },
    { Header: "Problem Statment", accessor: "problemStatement" },
    { Header: "Priority", accessor: "priority",type: 'badge' },
    { Header: "Technician", accessor: "technician" },
    { Header: "Technician Role", accessor: "role" },
    { Header: "Preffered Communication", accessor: "prefCommunication" },
    { Header: "Phone/email", accessor: "technicianContact" },
    { Header: "Status", accessor: "status" },
  ];

  return (
    <div className="p-4">
    <Box py={5}>
    <Button onClick={()=> navigation('/')} colorScheme="purple"  >
    <Flex gap={2} alignItems={'center'}>
    <FaArrowLeft color="white" /> 
    <Text> Go Back</Text>
    </Flex>
      </Button>
    </Box>
    
      <h1 className="text-2xl font-bold mb-4">Ticket List</h1>
      <Flex width={'full'} justify={'end'} my={3}>
     <Tooltip label="Click to add a new ticket" aria-label="Add Ticket Tooltip">
     <Button colorScheme="green" >
        Add Ticket
      </Button>
     </Tooltip>
      
      </Flex>
      
      {isLoading ? <>
      <Flex justifyContent={'center'}  alignItems={'center'} h={'100vh'}>
        <Spinner size={'xl'} color="purple.600"/>
      </Flex>
      </>:<>
        <Table columns={columns} data={ticketList}  />
      </>}
      
    </div>
  );
};

export default TicketList;
