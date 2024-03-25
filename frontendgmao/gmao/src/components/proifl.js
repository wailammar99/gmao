import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './admin/AdminNavbar';
import PopupMessage from './message';
import Citoyennavbar from './citoyen/citoyennavbar';
import Chefservicenavbar from './chefservice/chefservicenavbar';


const UserProfile = () => {
 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the pop-up form visibility
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [modifiedUser, setModifiedUser] = useState(null); // State to store the modified user
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [error, setError] = useState(null); // State for error handling
  const[firstname,setfirstname]=useState('')
  const[lastname,setlastname]=useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Navigate to login page
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/user_infoo/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user_info);
        setUsername(data.user_info.username);
        setEmail(data.user_info.email);
        setfirstname(data.user_info.first_name); // Corrected typo
        setlastname(data.user_info.last_name)
      } else {
        console.error('Failed to fetch user data');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const openPopup = () => {
    // Open the pop-up form
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    // Close the pop-up form
    setIsPopupOpen(false);

  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlefirtnameChange = (e) => {
    setfirstname(e.target.value);
  };
  const handlelastnameChange = (e) => {
    setlastname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api_modfie_profil/${localStorage.getItem('userId')}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          firstname:firstname,
          lastname:lastname
        }),
      });
      if (response.ok)
      {
       setIsPopupOpen(false);
       window.location.href = '/profil';

      }

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const responseData = await response.json();
      console.log(responseData); // Log response from the backend
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    }
  };

  // Render loading state if data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
        {/* Conditionally render navbar based on user role */}
      {userData && userData.role === 'admin' ? <AdminNavbar /> : 
       userData && userData.role === 'citoyen' ? <Citoyennavbar /> : 
       userData && userData.role === 'chefservice' ? <Chefservicenavbar /> : null}
      <section style={{ backgroundColor: '#eee' }}>
        <div className="container py-5">
        {successMessage && <PopupMessage message={successMessage} color="success" />}
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: '150px' }} />
                  <h5 className="my-3">{userData ? userData.name : 'Loading...'}</h5>
                  <p className="text-muted mb-1">{userData ? userData.role : 'Loading...'}</p>
                  <p className="text-muted mb-4">{userData ? userData.location : 'Loading...'}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <button type="button" className="btn btn-primary" onClick={openPopup}>
                      Modify User Information
                    </button>
                    {/* Pop-up form */}
                    {isPopupOpen && (
                      <div className="popup">
                        <div className="popup-content">
                          <span className="close" onClick={closePopup}>&times;</span>
                          <h2>Modify User Information</h2>
                          <form onSubmit={handleFormSubmit}>
  <label>Username:</label>
  <input readOnly 
    type="text"
    value={username}
    onChange={handleUsernameChange}
  />
  <label>fisrt_name:</label>
  <input
    type="text"
    value={firstname}
    onChange={handlefirtnameChange}
  />
  <label>lastname:</label>
  <input
    type="text"
    value={lastname}
    onChange={handlelastnameChange}
  />
  <label>Email:</label>
  <input
    type="email"
    value={email}
    onChange={handleEmailChange}
  />
  <button type="submit">Save Changes</button>
</form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="card mb-4 mb-lg-0">
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush rounded-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fas fa-globe fa-lg text-warning"></i>
                      <p className="mb-0">https://mdbootstrap.com</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-github fa-lg" style={{ color: '#333333' }}></i>
                      <p className="mb-0">mdbootstrap</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }}></i>
                      <p className="mb-0">@mdbootstrap</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-instagram fa-lg" style={{ color: '#ac2bac' }}></i>
                      <p className="mb-0">mdbootstrap</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }}></i>
                      <p className="mb-0">mdbootstrap</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card m-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">nom</p>
                 

                    </div>
                    <div className="col-sm-9">
                    <p className="text-muted mb-0">{userData ? userData.first_name : 'Loading...'}</p>
                      </div>
                      <hr/>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Email</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData ? userData.email : 'Loading...'}</p>
                      </div>
                    </div>
                    <hr/>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">prenom</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData ? userData.last_name : 'Loading...'}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Phone</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">(097) 234-5678</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Mobile</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">(098) 765-4321</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Address</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">Bay Area, San Francisco, CA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0">
                    {/* Left blank intentionally */}
                  </div>
                </div>
          
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;

