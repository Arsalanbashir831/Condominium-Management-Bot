import React, { useState, useRef, useEffect } from "react";
import { BACKEND_URL } from "../Constant";
import { Button, Flex, Spinner, useToast } from "@chakra-ui/react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState("email");
  const [userDetail, setUserDetail] = useState(null);
  const [isProblem , setProblem] = useState(false)
  const chatRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (isProblem) {
      setStep('problem')
    }
    const initializeChat = async () => {
      if (!localStorage.getItem('email')) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Salve, vi preghiamo di fornire il vostro numero di e-mail/contatto per potervi assistere ulteriormente." },
        ]);
      } else {
        const email = localStorage.getItem('email');
        setStep('problem');
        const userDetails = await fetchUserDetails(email);
        if (userDetails) {
          setUserDetail(userDetails);
        }
      }
      scrollToBottom();
    };

    initializeChat();
  }, [isProblem]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setUserInput("");
    setIsTyping(true);

    try {
      if (step === "email") {
        await handleEmailStep();
      } else if (step === "problem" ) {
         await handleProblemStep()
      }
    } catch (error) {
      //  handleError();
      console.log(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEmailStep = async () => {
    const email = userInput.trim();
    localStorage.setItem('email', email);
    const userDetails = await fetchUserDetails(email);
    
    if (userDetails) {
      setUserDetail(userDetails);
      setStep("problem");
      addBotMessage("Grazie! Ora, per favore, spiegami il tuo problema.");
    } else {
      addBotMessage("Dettagli non trovati. Si prega di fornire un numero di e-mail/contatto valido.");
    }
  };

  const handleProblemStep = async () => {
    console.log('function is called');
   await simpleCustomerSupport(userInput, userDetail.id , userDetail.name, userDetail.condominium.id);
    addBotMessage(response);

 
   
      // await addTicket(userDetail.id, priority, tagline, userDetail.condominium.id,true).then(()=>{
      //   toast({
      //     title: "Ticket Created",
      //     description: "Your support ticket has been created successfully.",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }).catch(()=>{
      //   toast({
      //     title: "Ticket Not Created",
      //     description: "Something went wrong",
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // });
    
    
  };


  const simpleCustomerSupport = async (userInput,userId, username , condominiumId)=>{
    try{
      const response = await fetch(`${BACKEND_URL}/api/aichat/customerSupport/${userInput}/${userId}/${username}/${condominiumId}`,{
        method:'POST',
   
      })
      if (response.ok) {
        const data = await response.json()
       addBotMessage(data.response)
       setProblem(data.isProblem)
      
      }
    }catch(e){
      console.log(e);
      
    }
  }
  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text: text.replace(/"/g, '') }]);
  };
  

  const handleError = () => {
    addBotMessage("Sorry, something went wrong. Please try again.");
  };

  const fetchUserDetails = async (query) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${query}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const addTicket = async (userId, priority, ProblemStatement, condominiumId, IsPermitToAutoMail) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, priority, ProblemStatement, condominiumId , IsPermitToAutoMail }),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };

  const getBotResponse = async (problemStatement) => {
    try {
      console.log("username",userDetail.name);
      const response = await fetch(`${BACKEND_URL}/api/aichat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemStatement, userId: userDetail.id ,username:userDetail.name}),
      });
      return response.ok ? await response.json() : { response: "Sorry, there was an issue processing your problem.", hasNextQuestion: false };
    } catch (error) {
      console.error("Error getting bot response:", error);
      return { response: "Sorry, there was an issue processing your problem.", hasNextQuestion: false };
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
    <Flex my={5} gap={4}>
      <Button 
        onClick={() => {
          localStorage.removeItem('email');
          window.location.reload(); 
        }} 
        colorScheme="blue"
      >
        Aggiungi Nuova Email
      </Button>
      <Button 
        onClick={() => {
          window.location.reload(); 
        }} 
        colorScheme="blue"
      >
        Aggiungi Nuovo Ticket
      </Button>
    </Flex>
  
    <div className="w-full max-w-lg p-6 bg-white shadow-2xl rounded-lg border border-gray-300">
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner" ref={chatRef}>
        {messages.map((message, index) => (
          <div key={index} className={`flex flex-row mb-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-lg ${message.sender === "bot" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"} shadow-md`}>
              {message.text}
              {message.sender === "bot" && isTyping && (
                <div className="inline-block ml-2">
                  <div className="animate-pulse inline-block">
                    <div className="w-2 h-2 bg-white rounded-full inline-block mr-1"></div>
                    <div className="w-2 h-2 bg-white rounded-full inline-block mr-1"></div>
                    <div className="w-2 h-2 bg-white rounded-full inline-block"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping ? <> <Spinner size={'lg'}/> </> : null}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={step === "email" ? "Inserisci la tua email..." : "Descrivi il tuo problema..."}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md"
        >
          Invia
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Chatbot;
