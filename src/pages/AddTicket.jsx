import React from 'react';
import Chatbot from '../components/Chatbot';

const AddTicket = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Chatbot di Supporto</h1>
        <p className="text-gray-700 mb-6">
          Il nostro chatbot è qui per assisterti. Segui le istruzioni per fornire la tua email e descrivere il problema che stai affrontando. Faremo del nostro meglio per risolvere il tuo problema nel modo più efficiente possibile.
        </p>
        <Chatbot />
      </div>
    </div>
  );
}

export default AddTicket;
