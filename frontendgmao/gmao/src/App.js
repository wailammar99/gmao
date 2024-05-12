import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';
import PasswordResetForm from './components/passwordsetup';


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
import Rapportform from './components/directeur/Raportfomr';
import Listcostumer from './components/directeur/Listcostumer';
import Listtechnicien from './components/directeur/listetechnicien';
import Listchefservice from './components/directeur/listechefservice';
import CompteNoActive from './components/directeur/noucompte';
import ConversationMessagesdir from './components/directeur/convrmessgedir';

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
import Citoyenprofil from './components/citoyen/citoyenprofil';
import Notificationcitoyen from './components/citoyen/citoyennotification';

import Notificationdirecteur from './components/directeur/notificationdirecteur';
import MessagePopup from './components/directeur/messagepopdirecteur';
import Directeurprofil from './components/directeur/directeurprofil';
import Adminprofil from './components/admin/admindesign/adminprofil';
import ConversationFormchefservice from './components/chefservice/conversationformchefservice';
import ConversationMessageschefservice from './components/chefservice/conversationformchefservice';
import ConversationMessagesTechnicien from './components/technicien/cpnversationmessagetechnicien';
import ListEquipement from './components/chefservice/listeequiment';
import Contact from './components/contactform';
import WebSocketTest from './testwebsocketdjango';
import Notificationadmin from './components/admin/notificationadmin';
import Contactadmin from './components/admin/contactliste';
import Listerapport from './components/directeur/listeRapport';
















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
            path="/contact"
            element={<Contact></Contact>}
          />
            <Route
            path="/testsocket"
            element={<WebSocketTest/>}
          />
          
            <Route
            path="/login"
            element=<Login onLogin={handleLogin} />
          />
          <Route
            path="/adminprofil"
            element={ <Adminprofil onLogout={handleLogout} />}
          />
            
          <Route
            path="/admin_dashboard"
            element={ <AdminPage onLogout={handleLogout} /> }
          />
          <Route
            path="/UserListPage"
            element={ <Link onLogout={handleLogout} /> }
          />
          <Route
            path="/listeservice"
            element={ <ListService onLogout={handleLogout} /> }
          />
          <Route
          path="/CreateUser"
          element={isLoggedIn ? <CreateUser /> : <Navigate to="/admin_dashboard" />}
          />
            <Route
          path="/Notificationadmin"
          element={<Notificationadmin/>}
          />
              <Route
          path="/contactadmin"
          element={<Contactadmin/>}
          />


             <Route
            path="/directeur_dashboard"
            element= <Pagedirecteur onLogout={handleLogout} /> 
          />
            <Route
            path="/RaportForm"
            element= <Rapportform onLogout={handleLogout} /> 
          />
           <Route
            path="/listerapport"
            element= <Listerapport   onLogout={handleLogout} /> 
          />

          
             <Route path="/conversation/:id/directeur/:int" element={<ConversationMessagesdir />} />
          <Route
            path="/profildirecteur"
            element={isLoggedIn ? <Directeurprofil onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />

             <Route
            path="/notificationdiracteur"
            element={isLoggedIn ? <Notificationdirecteur onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
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
            path="/citoyen_dashboard"
            element={isLoggedIn ? <Pagecityoen onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
         <Route
        path='/citoyenprofil'
        element={isLoggedIn ? <Citoyenprofil onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}>

         </Route>
         <Route path='/Notificationcitoyen'
          element={isLoggedIn ? <Notificationcitoyen onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}>

         </Route>
        <Route
            path="/technicien_dashboard/:Id"
            element={isLoggedIn ? <Pagetechnicien onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
        
           <Route
          path="/technicienpage"
          element={isLoggedIn ? <Technicienpage /> : <Navigate to="/technicien_dashboard/:Id" />}
          />
           <Route path="/conversation/:id/technicien/:int" element={<ConversationMessagesTechnicien />} />
          <Route path="/calender/technien" element={isLoggedIn ? <Calendertechncien/> : <Navigate to="/technicien_dashboard/:Id" />}>

          </Route>
          <Route path="/technicinenotificationpage" element={isLoggedIn ? <NotificationPageTechnicine/> : <Navigate to="/technicien_dashboard/:Id" />}>

          </Route>
          <Route path="/technicienprofil" element={isLoggedIn ? <Technicineprofil/> : <Navigate to="/technicien_dashboard/:Id" />}>

             </Route>
          

       
           <Route
            path="/create-service"
            element={ <CreateService onLogout={handleLogout} /> }
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
          element={ <Listtechnicienparservice /> }
          />

          <Route
          path="/Listchefservice"
          element={isLoggedIn ? <Listchefservice /> : <Navigate to="/directeur_dashboard" />}
          />
           <Route
            path="/listeequipement"
            element={ <ListEquipement onLogout={handleLogout} />   }
          />

        <Route
          path="/intervention"
          element={isLoggedIn ? <Intervention /> : <Navigate to="/directeur_dashboard" />}
          />  
            <Route
            path="/chef_service_dashboard/:Id"
            element={ <Chefservice onLogout={handleLogout} /> }
          />
           <Route
          path="/Chefservicepage"
          element={ <Chefservicepage /> }
          />
             <Route
          path="/chefservice/profil"
          element={ <Chefserviceprofil /> }
          />
              <Route
          path="/chefservicenotificationpage"
          element={ <NotificationPagechefservice /> }
          />
           <Route path="/conversation/:id/chefservice/:int" element={<ConversationMessageschefservice />} />

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
           <Route
          path="/passwordsetup"
          element={ <PasswordResetForm /> }
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
