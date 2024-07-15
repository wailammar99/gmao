import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PopupMessage from '../../message';
import "./createservice.scss"
import Navbar from '../admindesign/home/navbar/navbar';
import Sidebar from '../admindesign/home/sidebar/sidebar';
import ListService from '../listeservice';



const CreateService = ({ onServiceCreated }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const[messageee,setmessageee]=useState("");
  const[color,setcolor]=useState("");
  const navigate = useNavigate();
  
const token=localStorage.getItem("token");
const role =localStorage.getItem("role");
const en =localStorage.getItem('enterprise_id')

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      
      if (!token || role!="admin") {
        navigate("/login");
      }
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${en}/services/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: serviceName,
          descriptions: serviceDescription
        }),
      });
      if (response.ok) {
        setSuccessMessage(true);
        setcolor("success")
        console.log('Service created successfully');
        setmessageee("service est bien creaté")
        setTimeout(() => {
          navigate("/listeservice");
        }, 3000);

        
      
        // Navigate back to the admin dashboard
        
        
      } else if (response.status===409) {
        console.error('Failed to create service');
        setSuccessMessage(true);
        setmessageee("le service ready existe");
        setcolor("warning");
      }
      else if (response.status===402)
      {
        setSuccessMessage(true);
        setmessageee("remplire le formelaire si vous plais ");
        setcolor("warning");
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);
 
  return (

    <div className="list">
         <Sidebar/>
        <div className="listContainer">
         <Navbar/>
         {successMessage && (
        <div >
          {successMessage && <PopupMessage message={messageee}  color={color} />}
        </div>
      )}
      <h2>Créer un Nouveau Service </h2>
      <form onSubmit={handleCreateService} required>
        <div className="formInput">
          <label htmlFor="serviceName" className="form-label">Nom du Service</label>
          <input type="text" className="form-control" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)}  required/>
        </div>
        <div className="formInput">
          <label htmlFor="serviceDescription" className="form-label">Description du Service</label>
          <textarea className="form-control" id="serviceDescription" rows="3" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required></textarea>
        </div>
        <div className='formInput'>
        <button
  type="submit"
  className="btn btn-primary custom-button"
  onClick={handleCreateService}
  required
>
  Create Service
</button>

        </div>
       



        
      </form>
    </div>
    </div>
  );
};
 
export default CreateService;