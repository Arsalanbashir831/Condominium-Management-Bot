import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { BACKEND_URL } from "../Constant";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { refreshState } from "../atoms/refreshState";
import AddNewTicketModal from "../components/Modals/AddNewTicketModal";

const TicketList = () => {
  const [ticketList, setTicketList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const refresh = useRecoilValue(refreshState);
  const [isArchieve, setIsArchieve] = useState(false);
  const [ref, setRef] = useRecoilState(refreshState);
  // Manage modal state with Chakra's useDisclosure hook
  const { isOpen, onOpen, onClose } = useDisclosure();

  const processTicketsData = (data) => {
    return data.map((ticket) => ({
      id: ticket.id,
      description: ticket.description,
      name: ticket.user.name || "",
      email: ticket.user.email || "",
      contactNumber: ticket.user.contactNumber || "",
      condominium: ticket.user.condominium.name || "",
      problemStatement: ticket.ProblemStatement || "",
      priority: ticket.priority || "",
      technician: ticket.assigned_technicians.CompanyName || "",
      role: ticket.assigned_technicians.SectorName || "",
      prefCommunication:
        ticket.assigned_technicians.prefCommunication.name ,
      technicianContact:
        ticket.assigned_technicians.prefCommunication.name === "Email"
          ? ticket.assigned_technicians.email
          : ticket.assigned_technicians.ContactNumber,
      status: ticket.status.name,
      technician_id: ticket.assigned_technicians.id,
      user_id: ticket.user.id,
      status_id : ticket.status.id,
      condominium_id : ticket.user.condominium.id
    }));
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BACKEND_URL}/api/ticket/?isArchieve=${isArchieve}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Nome", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Numero di Contatto", accessor: "contactNumber" },
    { Header: "Condominio", accessor: "condominium" },
    { Header: "Dichiarazione del Problema", accessor: "problemStatement" },
    { Header: "Priorità", accessor: "priority", type: "badge" },
    { Header: "Tecnico", accessor: "technician" },
    { Header: "Ruolo del Tecnico", accessor: "role" },
    { Header: "Comunicazione Preferita", accessor: "prefCommunication" },
    { Header: "Telefono/email", accessor: "technicianContact" },
    { Header: "Note", accessor: "description" },
    { Header: "Stato", accessor: "status" },
  ];

  return (
    <div className="p-4">
      <Box py={5}>{/* Uncomment if needed */}</Box>

      <h1 className="text-2xl font-bold mb-4">Elenco Ticket</h1>
      <Flex width={"full"} justify={"end"} my={3}>
        <AddNewTicketModal onOpen={isOpen} onClose={onClose} />
      </Flex>

      {isLoading ? (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
          <Spinner size={"xl"} color="purple.600" />
        </Flex>
      ) : (
        <>
          <Flex gap={3}>
            <Button
              onClick={() => {
                setIsArchieve(false);
                setRef(!ref);
              }}
              variant={isArchieve ? "outline" : "solid"} // Solid when active
              colorScheme="green"
              my={2}
            >
              <Flex gap={2} alignItems={"center"}>
                <Text>Tutti i Ticket</Text>
              </Flex>
            </Button>
            <Button
              onClick={() => {
                setIsArchieve(true);
                setRef(!ref);
              }}
              variant={isArchieve ? "solid" : "outline"} // Solid when active
              colorScheme="red"
              my={2}
            >
              <Flex gap={2} alignItems={"center"}>
                <Text>Ticket Chiusi</Text>
              </Flex>
            </Button>
          </Flex>

          <Table columns={columns} data={ticketList} />
        </>
      )}

      {/* Add New Ticket Modal */}
    </div>
  );
};

export default TicketList;
