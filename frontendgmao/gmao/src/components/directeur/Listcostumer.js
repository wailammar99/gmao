import React, { useState, useEffect, useRef } from 'react';
import UserformA from './directeurdesi/UserformA';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import PopupMessage from '../message';


const Listcostumer = () => {
  const [chefServiceData, setChefServiceData] = useState([]);
  const [technicienData, setTechnicienData] = useState([]);
  const forceUpdate = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupColor, setPopupColor] = useState('info'); // Default color is 'info'

  useEffect(() => {
    forceUpdate.current = () => {}; // Initialize forceUpdate.current
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        // Filter data for chefService and technicien
        const chefsService = data.filter(user => user.is_chefservice);
        setChefServiceData(chefsService);
        const techniciens = data.filter(user => user.is_technicien);
        setTechnicienData(techniciens);
      } else {
        setPopupMessage('Failed to fetch user data');
        setPopupColor('danger');
      }
    } catch (error) {
      setPopupMessage(`Error fetching user data: ${error}`);
      setPopupColor('danger');
    }
  };

  const handleActivate = async (id, userType) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}/`, {
        method: 'GET',
      });
      if (response.ok) {
        if (userType === 'chefService') {
          setChefServiceData(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
              if (user.id === id) {
                return { ...user, is_active: true }; // Update activation status
              }
              return user;
            });
            return updatedUsers;
          });
        } else if (userType === 'technicien') {
          setTechnicienData(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
              if (user.id === id) {
                return { ...user, is_active: true }; // Update activation status
              }
              return user;
            });
            return updatedUsers;
          });
        }
        setPopupMessage('User account activated successfully');
        setPopupColor('success');
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      setPopupMessage(`Error activating user account: ${error}`);
      setPopupColor('danger');
    }
  };

  const toggleModal = (user) => {
    setUser(user);
    setShowModal(!showModal);
  };

  const handleFormSubmit = (formData) => {
    setPopupMessage('Form submitted');
    setPopupColor('info');
    // Send form data to the backend if necessary
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
    setPopupColor('info');
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {popupMessage && <PopupMessage message={popupMessage} color={popupColor} onClose={handleClosePopup} />}
        {showModal && user && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add service</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <UserformA userId={user} onSubmit={handleFormSubmit} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mt-5">
          <h1>Comptes des Chefs de Service</h1>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>first_name</th>
                  <th>last_name</th>
                  <th>service</th>
                  <th>Is Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {chefServiceData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.service ? user.service.nom : ''}</td>
                    <td>{user.is_active ? 'Yes' : 'No'}</td>
                    {!user.is_active && (
                      <td>
                        <button onClick={() => handleActivate(user.id, 'chefService')} className="btn btn-success">Activate</button>
                        <button type="button" className="btn btn-outline-warning" onClick={() => toggleModal(user)}>Assign Service</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h1>Comptes des Techniciens</h1>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>first_name</th>
                  <th>last_name</th>
                  <th>service</th>
                  <th>Is Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {technicienData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.service ? user.service.nom : ''}</td>
                    <td>{user.is_active ? 'Yes' : 'No'}</td>
                    {!user.is_active && (
                      <td>
                        <button onClick={() => handleActivate(user.id, 'technicien')} className="btn btn-success">Activate</button>
                        <button type="button" className="btn btn-outline-warning" onClick={() => toggleModal(user)}>Assign Service</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listcostumer;
