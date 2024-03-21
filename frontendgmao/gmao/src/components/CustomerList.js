import React, { useState, useEffect } from 'react';

function CustomerList() {
  const [equipements, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the customer list from the Django backend
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/equipements/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCustomers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Customer List</h1>
      <table>
        <thead>
          <tr>
            <th>nom</th>
           
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {equipements.map(equipements => (
            <tr key={equipements.id}>
              <td>{equipements.nom}</td>
              
              <td>
               
              </td>
              {/* Add more table cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
