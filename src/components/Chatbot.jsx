import React, { useState, useRef, useEffect } from "react";
import { BACKEND_URL } from "../Constant";
import { useToast } from "@chakra-ui/react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Please provide your email/Contact Number so we can assist you further.",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState("email");
  const [userDetail, setUserDetail] = useState(null);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const [UserCondominium, setUserCondominium] = useState("")

  const chatRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);
      setUserInput("");
      setIsTyping(true);

      try {
        if (step === "email") {
          const userDetails = await fetchUserDetails(userInput);
          if (userDetails) {
            setUserDetail(userDetails);
            setStep("condominium");
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: "bot",
                text: "Thanks! Now, please tell me your condominium",
              },
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: "bot",
                text: "Details not found. Please provide a valid email/contact number.",
              },
            ]);
            setIsTyping(false);
          }
        }
        else if (step ==='condominium'){
          setUserCondominium(userInput)
          setStep("problem")
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              text: "Great! Now, please describe your problem.",
            },
          ]);
        }
        else if (step === "problem" && hasMoreQuestions) {
          const { response, hasNextQuestion, tagline, isUrgent } =
            await getBotResponse(userInput);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: response },
          ]);
          setHasMoreQuestions(hasNextQuestion);
          if (!hasNextQuestion) {
            setStep("completed");
            await addTicket(tagline, userDetail.title, UserCondominium,userDetail.email[0],userDetail.phone1, isUrgent);
            toast({
              title: "Ticket Created",
              description: "Your support ticket has been created successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const fetchUserDetails = async (query) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/user/swagger/?searchQuery=${query}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data[0];
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const addTicket = async (
    problemTagline,
    username,
    user_condominium,
    user_email,
    user_phone,
    isUrgent
  ) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProblemStatement: problemTagline,
          username: username,
          isUrgent: isUrgent,
          user_condominium: user_condominium,
          user_email: user_email,
          user_phone: user_phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error Adding Ticket:", error);
    }
  };

  const getBotResponse = async (problemStatement) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/aichat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problemStatement, userId: userDetail.title }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error getting bot response:", error);
      return {
        response: "Sorry, there was an issue processing your problem.",
        hasNextQuestion: false,
      };
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-lg p-6 bg-white shadow-2xl rounded-lg border border-gray-300">
        <div
          className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner"
          ref={chatRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-row mb-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  message.sender === "bot"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                } shadow-md`}
              >
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
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              step === "email"
                ? "Enter your email..."
                : "Describe your problem..."
            }
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
