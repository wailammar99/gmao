import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';


import CreateService from './components/admin/createservice/CreateService';
import CreateUser from './components/admin/admindesign/createusser/create_user';
import UserProfile from './components/proifl';

import ConversationForm from './components/citoyen/ConversationForm';
import technicineprofil from './components/technicien/technicineprofil';

import Intervention from './components/directeur/intervention';

import Pagetechnicien from './components/technicien/techniciendesign/hometechnicien';
import Technicienpage from './components/technicien/technicienpage';

import AdminPage from './components/admin/admindesign/adminpage';

import Link from './components/admin/admindesign/link';
import ListService from './components/admin/listeservice';

import Pagedirecteur from './components/directeur/directeurdesi/pagedirecteur';
import Listcostumer from './components/directeur/Listcostumer';
import Listtechnicien from './components/directeur/listetechnicien';
import Listchefservice from './components/directeur/listechefservice';
import CompteNoActive from './components/directeur/noucompte';


import Chefservice from './components/chefservice/chefservicedesign/pagechefservice/pagechefservice';
import Chefservicepage from './components/chefservice/chefservicedesign/Chefservicepage';
import Chefserviceprofil from './components/chefservice/chefserviceprofil';
import Listtechnicienparservice from './components/chefservice/chefservicedesign/Listtechnicienparservice';
import Citoyenpage from './components/citoyen/cityoenpage';
import Pagecityoen from './components/citoyen/cityoendesign/homecitoyen';
import ConversationMessages from './components/citoyen/conversationmessage';
import CreateInterventionForm from './components/citoyen/createintervention';
import Calendertechncien from './components/technicien/Calendertechncien';
import NotificationPageTechnicine from './components/technicien/notificationtechnicine';
import Technicineprofil from './components/technicien/technicineprofil';
import NotificationPagechefservice from './components/chefservice/notifationchefservice';














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
            element=<Login onLogin={handleLogin} />
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
          path="/comptenouveux"
          element={isLoggedIn ? <CompteNoActive /> : <Navigate to="/directeur_dashboard" />}
          /> 
        
         
          

         
          <Route
            path="/citoyen_dashboard/:id"
            element={isLoggedIn ? <Citoyenpage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
        
        <Route
            path="/technicien_dashboard/:Id"
            element={isLoggedIn ? <Pagetechnicien onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
        
           <Route
          path="/technicienpage"
          element={isLoggedIn ? <Technicienpage /> : <Navigate to="/technicien_dashboard/:Id" />}
          />
          <Route path="/calender/technien" element={isLoggedIn ? <Calendertechncien/> : <Navigate to="/technicien_dashboard/:Id" />}>

          </Route>
          <Route path="/technicinenotificationpage" element={isLoggedIn ? <NotificationPageTechnicine/> : <Navigate to="/technicien_dashboard/:Id" />}>

          </Route>
          <Route path="/technicienprofil" element={isLoggedIn ? <Technicineprofil/> : <Navigate to="/technicien_dashboard/:Id" />}>

             </Route>
          

       
           <Route
            path="/create-service"
            element={isLoggedIn ? <CreateService onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
             <Route
            path="/profil"
            element={isLoggedIn ? <UserProfile /> : <Login onLogin={handleLogin} />}
  
          />
         
           <Route path="/create_user" element={<CreateUser />} />
           <Route path="/conversation/:id/citoyen/:int" element={<ConversationMessages />} />
           <Route
            path="/int"
          element={<Intervention />}

          />
           <Route
          path="/Listtechnicien"
          element={isLoggedIn ? <Listtechnicien /> : <Navigate to="/directeur_dashboard" />}
          />
          <Route
          path="/Listtechnicienparservice"
          element={isLoggedIn ? <Listtechnicienparservice /> : <Navigate to="/technicien_dashboard" />}
          />

          <Route
          path="/Listchefservice"
          element={isLoggedIn ? <Listchefservice /> : <Navigate to="/directeur_dashboard" />}
          />

        <Route
          path="/intervention"
          element={isLoggedIn ? <Intervention /> : <Navigate to="/directeur_dashboard" />}
          />  
            <Route
            path="/chef_service_dashboard/:Id"
            element={isLoggedIn ? <Chefservice onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
           <Route
          path="/Chefservicepage"
          element={isLoggedIn ? <Chefservicepage /> : <Navigate to="/chef_service_dashboard/:Id" />}
          />
             <Route
          path="/chefservice/profil"
          element={isLoggedIn ? <Chefserviceprofil /> : <Navigate to="/chef_service_dashboard/:Id" />}
          />
              <Route
          path="/chefservicenotificationpage"
          element={isLoggedIn ? <NotificationPagechefservice /> : <Navigate to="/chef_service_dashboard/:Id" />}
          />
          

           <Route
            path="/citoyen_dashboard/:Id"
            element={isLoggedIn ? <Pagecityoen onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          /> 
           <Route
          path="/Citoyenpage"
          element={isLoggedIn ? <Citoyenpage /> : <Navigate to="/citoyen_dashboard/:Id" />}
          />
          <Route
          path="/create_intervention"
          element={isLoggedIn ? <CreateInterventionForm /> : <Navigate to="/citoyen_dashboard/:Id" />}
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
