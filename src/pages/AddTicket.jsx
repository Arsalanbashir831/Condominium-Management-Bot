import React from 'react';
import Chatbot from '../components/Chatbot';

const AddTicket = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Support Chatbot</h1>
        <p className="text-gray-700 mb-6">
          Our chatbot is here to assist you. Please follow the prompts to provide your email and describe the problem you are facing. We will make sure to handle your issue as efficiently as possible.
        </p>
        <Chatbot />
      </div>
    </div>
  );
}

export default AddTicket;
