import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import AdminPage from './components/admin/adminpage';
import Citoyenpage from './components/citoyen/citoyenpage';
import Userlistepage from './components/admin/userlistepage';
import CreateService from './components/admin/create_service';
import CreateUser from './components/admin/create_user';
import UserProfile from './components/proifl';
import CreateInterventionForm from './components/citoyen/create_intervetion';
import ConversationMessages from './components/citoyen/conversationMessages';






function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />} // Specify the Login component for the /login route
          />
            <Route path="/userlist" element={<Userlistepage />} />
          <Route
            path="/admin_dashboard/:id"
            element={isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/citoyen_dashboard/:id"
            element={isLoggedIn ? <Citoyenpage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
           <Route
            path="/create_service"
            element={isLoggedIn ? <CreateService onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
             <Route
            path="/profil"
            element={isLoggedIn ? <UserProfile /> : <Login onLogin={handleLogin} />}
  
          />
          <Route path="/create_intervention" element={<CreateInterventionForm onInterventionCreated={() => {}} />} />
           <Route path="/create_user" element={<CreateUser />} />
           <Route path="/conversation/:id" element={<ConversationMessages />} />

           
          
         
          {/* Add more routes for other pages */}
        </Routes>
        
        <header className="App-header">
          {/* Add any header content */}
     
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
