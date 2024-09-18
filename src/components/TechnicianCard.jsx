import React from 'react';

const TechnicianCard = ({ technician, isSelected, onSelect }) => {
  const { description, address, phone1 } = technician;

  return (
    <div
      onClick={onSelect}
      className={`bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
    >
      <h2 className="text-xl font-semibold mb-2">Technician</h2>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {description}</p>
      <p className="text-gray-700 mb-2"><strong>Address:</strong> {address}</p>
      <p className="text-gray-700"><strong>Contact Number:</strong> {phone1}</p>
    </div>
  );
};

export default TechnicianCard;
