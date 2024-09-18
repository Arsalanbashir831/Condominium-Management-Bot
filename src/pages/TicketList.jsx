import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { BACKEND_URL } from "../Constant";
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { refreshState } from "../atoms/refreshState";

const TicketList = () => {
  const [ticketList, setTicketList] = useState([]);
  const [isLoading , setLoading] = useState(false);
  const refresh  = useRecoilValue(refreshState)
  const processTicketsData = (data) => {
    return data.map(ticket => ({
      id:ticket.id,
        name: ticket.username || '',
        email: ticket.user_email || '',
        condominium: ticket.user_condominium || '',
        problemStatement: ticket.ProblemStatement || '',
        priority: ticket.isUrgent ? 'Urgent' : 'Normal',
        technician: ticket.technician_name ? ticket.technician_name || 'N/A' : 'N/A',
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
    { Header: "Condominium", accessor: "condominium" },
    { Header: "Problem Statment", accessor: "problemStatement" },
    { Header: "Priority", accessor: "priority",type: 'badge' },
    { Header: "Technician", accessor: "technician" },
  ];

 
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ticket List</h1>
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
