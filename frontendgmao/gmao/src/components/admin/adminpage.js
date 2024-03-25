import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from './AdminNavbar';

const AdminPage = () => {
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchData();
    fetchServices();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return navigate('/login');
      }
      
      const response = await fetch(`http://127.0.0.1:8000/user_infoo/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user_info);
      } else {
        console.error('Failed to fetch user data');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h1>Hello, Admin!</h1>
        {!loading && userData && (
          <div>
            <h2>User Information</h2>
            <p>id: {userData.id}</p>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>Email: {userData.fisrt_name}</p>
            
          </div>
        )}
        <div>
          <h2>Services</h2>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.nom}</td>
                  <td>{service.descrtions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
