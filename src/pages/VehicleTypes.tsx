// src/components/VehicleTypes.tsx
import React from 'react';
import axios from 'axios';

interface VehicleType {
  Name: string;
}

const fetchVehicleTypes = async (makeId: string, year: number): Promise<VehicleType[]> => {
  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
    return response.data.Results;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    throw new Error('Unable to fetch vehicle types. Please try again later.');
  }
};

const VehicleTypes = ({ makeId, year }: { makeId: string; year: number }) => {
  const [types, setTypes] = React.useState<VehicleType[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchVehicleTypes(makeId, year);
        setTypes(data);
      } catch (err) {
        setError('Unable to fetch vehicle types. Please try again later.');
      }
    };

    loadTypes();
  }, [makeId, year]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-4">
      {error ? (
        <div className="text-red-600 text-lg font-semibold text-center">{error}</div>
      ) : types.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No vehicle types available for the selected make and year.</div>
      ) : (
        <ul className="list-disc pl-5">
          {types.map((type, index) => (
            <li key={index} className="text-lg mb-2 text-gray-700">
              {type.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleTypes;

