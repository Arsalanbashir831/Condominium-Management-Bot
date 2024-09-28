import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigation = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Benvenuti nella Nostra Comunità Condominiale</h1>
      <p className="text-lg text-gray-600 mb-8">
        Scopri un ambiente di vita armonioso dove il comfort incontra la comodità.
      </p>
      <div className="flex space-x-4">
        <button onClick={() => navigation('/addTicket')} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Residente</button>
        <button onClick={() => navigation('/login')} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Gestore Condominiale</button>
      </div>
    </div>
  );
};

export default LandingPage;
