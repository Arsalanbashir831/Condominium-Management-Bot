import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { BACKEND_URL } from "../Constant";
import { Flex, Spinner } from "@chakra-ui/react";

const TicketList = () => {
  const [ticketList, setTicketList] = useState([]);
  const [isLoading , setLoading] = useState(false)
  const processTicketsData = (data) => {
    return data.map(ticket => ({
        name: ticket.user?.name || '',
        email: ticket.user?.email || '',
        condominium: ticket.user?.condominium?.name || '',
        problemStatement: ticket.ProblemStatement || '',
        priority: ticket.isUrgent ? 'Urgent' : 'Normal',
        prefCommunication: ticket.assigned_technicians?.prefCommunication?.name || 'N/A',
        technician: ticket.assigned_technicians ? ticket.assigned_technicians.CompanyName || 'N/A' : 'N/A',
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
          Authorization: `Bearer ${token}`,
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
  }, []);
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Condominium", accessor: "condominium" },
    { Header: "Problem Statment", accessor: "problemStatement" },
    { Header: "Priority", accessor: "priority",type: 'badge' },
    { Header: "Preferred Communication", accessor: "prefCommunication" },
    { Header: "Technician", accessor: "technician" },
  ];

 
  const handleActionClick = (row) => {
    console.log("Action clicked for:", row);
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ticket List</h1>
      {isLoading ? <>
      <Flex justifyContent={'center'}  alignItems={'center'} h={'100vh'}>
        <Spinner size={'xl'} color="purple.600"/>
      </Flex>
      </>:<>
        <Table columns={columns} data={ticketList} onActionClick={handleActionClick} />
      </>}
      
    </div>
  );
};

export default TicketList;
