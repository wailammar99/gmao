import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';

import Citoyenpage from './components/citoyen/citoyenpage';
import CreateService from './components/admin/CreateService';
import CreateUser from './components/admin/create_user';
import UserProfile from './components/proifl';
import CreateInterventionForm from './components/citoyen/create_intervetion';
import ConversationMessages from './components/citoyen/conversationMessages';
import Chefservicepage from './components/chefservice/chefservicepage';
import Intervention from './components/directeur/Listcostumer';
import Technicienpage from './components/technicine/technicien';
import AdminPage from './components/admin/admindesign/adminpage';

import Link from './components/admin/admindesign/link';
import ListService from './components/admin/listeservice';
import Pagedirecteur from './components/directeur/directeurdesi/pagedirecteur';
import Listcostumer from './components/directeur/Listcostumer';








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
            path="/admin_dashboard/:id"
            element={isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/UserListPage"
            element={isLoggedIn ? <Link onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/listeservice"
            element={isLoggedIn ? <ListService onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
          path="/CreateUser"
          element={isLoggedIn ? <CreateUser /> : <Navigate to="/admin_dashboard" />}
          />
             <Route
            path="/directeur_dashboard"
            element={isLoggedIn ? <Pagedirecteur onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />

         <Route
          path="/listecostumer"
          element={isLoggedIn ? <Listcostumer /> : <Navigate to="/directeur_dashboard" />}
          /> 
        
         
          

          <Route
            path="/chef_service_dashboard/:id" // Corrected route path
            element={<Chefservicepage />} // Corrected component name
          />
          <Route
            path="/citoyen_dashboard/:id"
            element={isLoggedIn ? <Citoyenpage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
           <Route
            path="/technicien_dashboard/:id" // Corrected route path
            element={<Technicienpage />} // Corrected component name
          />
       
           <Route
            path="/create-service"
            element={isLoggedIn ? <CreateService onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
             <Route
            path="/profil"
            element={isLoggedIn ? <UserProfile /> : <Login onLogin={handleLogin} />}
  
          />
          <Route path="/create_intervention" element={<CreateInterventionForm onInterventionCreated={() => {}} />} />
           <Route path="/create_user" element={<CreateUser />} />
           <Route path="/conversation/:id/citoyen/:int" element={<ConversationMessages />} />
           <Route
            path="/int"
          element={<Intervention />}

          />

           
          
         
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
