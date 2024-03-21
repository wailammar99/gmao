import React, { useState, useEffect } from 'react';
import UserForm from './userform';
import AdminNavbar from './AdminNavbar';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedUser, setModifiedUser] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/listecustomer/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_delete_user/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleModifyClick = (user) => {
    setModifiedUser(user);
    setShowModal(true); // Show modal when "Modify" button is clicked
  };

  const handleFormSubmit = async (updatedUserData) => {
    if (!modifiedUser) {
      console.error('Modified user is undefined');
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_mofifie_user/${modifiedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
      if (response.ok) {
        setUsers(users.map(user => user.id === modifiedUser.id ? updatedUserData : user));
        setModifiedUser(null);
        setShowModal(false); // Close modal after form submission
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    <AdminNavbar/>
      <h1>Customer List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Poste</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                {(() => {
                  if (user.is_directeur) return 'Directeur';
                  if (user.is_admin) return 'Admin';
                  if (user.is_technicien) return 'Technicien';
                  if (user.is_chefservice) return 'Chef Service';
                  if (user.is_citoyen) return 'Citoyen';
                  return 'Unknown';
                })()}
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Delete</button>
                <button onClick={() => handleModifyClick(user)} className="btn btn-secondary">Modify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modifiedUser && (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{display: showModal ? 'block' : 'none'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify User</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <UserForm user={modifiedUser} onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserListPage;
