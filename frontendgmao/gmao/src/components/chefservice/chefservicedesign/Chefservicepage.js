import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InterventionForm from './InterventionForm';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import InterventionFormTechnician from './InterventionFormTechnician';
import PopupMessage from '../../message';
import ConversationForm from '../../citoyen/ConversationForm';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ModeIcon from '@mui/icons-material/Mode'

import { Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Pagination from '@mui/material/Pagination';
 
const Chefservicepage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ message: '', color: 'success' });
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showModall, setShowModall] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [showModalConversation, setShowModalConversation] = useState(false);
  const [conversationInterventionId, setConversationInterventionId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const[techncien,settechncien]=useState([])
  const [interventionsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const token =localStorage.getItem("token");
  const role =localStorage.getItem("role");
  const userid=localStorage.getItem("userId");
  const navigate=useNavigate();
 
  useEffect(() => {
    if (token && role ==="chefservice")
      {
        fetchData();
        fetchEquipmentData();
        fetchtechdata();
        console.log("autorise ");
      }
      else
      {
        navigate('/login');
        console.log("pas autorise ");
      } 
      
  
  }, [token]);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem('userId')}/interventions?page=${page}&per_page=${interventionsPerPage}`, {
        headers: {
          Authorization: `TOKEN ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInterventions(data.data || []);
        setFilteredInterventions(data.data || []);
        setTotalPages(data.pages);
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };


 
  
  const fetchEquipmentData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${localStorage.getItem('enterprise_id')}/chefservice/${localStorage.getItem('userId')}/equipements`);
      if (response.ok) {
        const e = await response.json();
        const equipmentData=e.data ;
        setEquipments(equipmentData);
      } else {
        console.error('Failed to fetch equipment data');
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };
  const fetchtechdata = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/is_technicine');
      if (response.ok) {
        const techData = await response.json();
        settechncien(techData);
      } else {
        console.error('Failed to fetch equipment data');
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };
 
  const handleRefuseIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_refuse_intervention/${interventionId}/`, {
        method: 'GET',
        headers:{
          Authorization: `Token ${token}`
        }
      });
      if (response.ok) {
        
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention est bien  refuse ', color: 'success' });
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchData();
      } else {
        console.error('Failed to refuse intervention');
      }
    } catch (error) {
      console.error('Error refusing intervention:', error);
    }
  };
 
  const hadllecloture = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_cloture_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Update the state immediately
     
       
     // Update filtered interventions
     setShowPopup(true);
     
        setPopupMessage({ message: 'Intervention est bien cloture ', color: 'success' });
        setTimeout(() => {
          setShowPopup(false);
          
        }, 1500);
        fetchData();
      } else {
        console.error('Failed to refuse intervention');
      }
    } catch (error) {
      console.error('Error refusing intervention:', error);
    }
  };
 
  const toggleModal = (intervention) => {
    setSelectedIntervention(intervention);
    setIsNoService(intervention.service && intervention.service.nom === 'noservice');
    setShowModal(!showModal);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };
 
  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    fetchData();
  };
 
  const handleStartConversation = (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
    // Update the state immediately
    const updatedInterventions = interventions.map(intervention => {
      if (intervention.id === interventionId) {
        return { ...intervention, etat: 'Conversation Started' };
      } else {
        return intervention; // Return the intervention as is
      }
    });
    setInterventions(updatedInterventions);
    // Close the assignment modal if it's open
    setShowModal(false);
  };
 
  const handleOpenModal = (intervention) => {
    setSelectedIntervention(intervention);
    setShowModal(true);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  const handleOpenModall = (intervention) => {
    setSelectedIntervention(intervention);
    setShowModall(true);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };
  

 
  const handleCloseModall = () => {
    setShowModall(false);
  };
 
  const filterInterventionsByStatus = (status) => {
    setSelectedStatus(status);
  };
 
  const handleSearch = (query) => {
    // Implement your search functionality here
    console.log('Searching for:', query);
    // You can perform any search-related actions here
  };

  const columns = [
    { field: 'date_debut', headerName: 'Date de début', width: 150, renderCell: (params) => {
      const dateDebut = params.value;
      return dateDebut ? dateDebut : 'Date non disponible';
    }},
    { field: 'date_fin', headerName: 'Date de fin', width: 150, renderCell: (params) => {
      const dateDebut = params.value;
      return dateDebut ? dateDebut : 'Date non disponible';
    }},
    { field: 'etat', headerName: 'État', width: 150 },
    {
      field: 'conversation',
      headerName: 'Conversation',
      width: 150,
      renderCell: (params) => (
        params.row.conversation ? (
          <Link to={`/conversation/${params.row.conversation.id}/chefservice/${localStorage.getItem('userId')}`}>
            {params.row.conversation.title}
          </Link>
        ) : (
          <Button onClick={() => handleStartConversation(params.row.id)} variant="contained" color="primary">
            démarrer
          </Button>
        )
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      renderCell: (params) => (
        params.row.service.nom === "noservice" ? (
          <>
            <Tooltip title="Assigner">
              <IconButton color="warning" onClick={() => toggleModal(params.row)}>
                <AssignmentTurnedInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Plus">
              <IconButton color="info" onClick={() => handleOpenModall(params.row)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Annuler">
              <IconButton color="error" onClick={() => handleRefuseIntervention(params.row.id)}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            {params.row.etat === 'Nouveau' && (
              <>
                <Tooltip title="Assigner">
                  <IconButton color="warning" onClick={() => toggleModal(params.row)}>
                    <AssignmentTurnedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Annuler">
                  <IconButton color="error" onClick={() => handleRefuseIntervention(params.row.id)}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {params.row.etat === 'Assigné' && (
              <>
                <Tooltip title="Annuler">
                  <IconButton color="error" onClick={() => handleRefuseIntervention(params.row.id)}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {params.row.etat === 'Terminé' && (
              <Tooltip title="Cloturer">
                <IconButton color="success" onClick={() => hadllecloture(params.row.id)}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            )}
            {params.row.etat === 'En attente' && (
              <>
                <Tooltip title="Assigner">
                  <IconButton color="warning" onClick={() => toggleModal(params.row)}>
                    <AssignmentTurnedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Annuler">
                  <IconButton color="error" onClick={() => handleRefuseIntervention(params.row.id)}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Plus">
              <IconButton color="info" onClick={() => handleOpenModall(params.row)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </>
        )
      )
    }
  ];
 
  const filterInterventionsByType = (etat) => {
    if (etat === 'all') {
      setFilteredInterventions(interventions); // Show all interventions
    } else {
      const filtered = interventions.filter(intervention => intervention.etat === etat); // Filter interventions by type
      setFilteredInterventions(filtered);
    }
  };
  const paginate = (event, value) => {
    setCurrentPage(value);
  };
 
  // Get current interventions
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Interventions</h1>
        <div>
          {/* Boutons pour filtrer les interventions */}
          <Button onClick={() => filterInterventionsByType('all')}>Tous</Button>
          <Button onClick={() => filterInterventionsByType('Nouveau')}>Nouveau</Button>
          <Button onClick={() => filterInterventionsByType('En attente')}>En attente</Button>
          <Button onClick={() => filterInterventionsByType('En cours')}>En cours</Button>
          <Button onClick={() => filterInterventionsByType('Assigné')}>Assigné</Button>
          <Button onClick={() => filterInterventionsByType('Terminé')}>Terminé</Button>
          <Button onClick={() => filterInterventionsByType('Annulé')}>Annulé</Button>
          <Button onClick={() => filterInterventionsByType('Clôture')}>Clôture</Button>
        </div>
        {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}
        {showModal && selectedIntervention && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"> Intervention</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {isNoService ? (
                    <InterventionForm interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} onClose={() => setShowModal(false)} fetchData={()=>fetchData()} />
                  ) : (
                    <InterventionFormTechnician interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} onClose={() => setShowModal(false)}  />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
 
        {showModalConversation && (
          <ConversationForm
            show={showModalConversation}
            onClose={() => setShowModalConversation(false) }
            interventionId={conversationInterventionId}
            onfetch={()=>fetchData()}
          />
        )}
        <DataGrid
          rows={filteredInterventions}
          columns={columns}
          checkboxSelection={false}
          hideFooterPagination={true}
          autoHeight={true} // Supprimer la barre de défilement
          paginationMode="server"
          onPageChange={handlePageChange}
          page={currentPage - 1}
        />
           <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
        <Dialog open={showModall} onClose={handleCloseModall}>
          <DialogTitle>Details de l'intervention</DialogTitle>
          <DialogContent>
            {selectedIntervention && (
              <div>
              <p>titre : {selectedIntervention.titre ? selectedIntervention.titre :"sans titre"}</p>
                <p>Description : {selectedIntervention.description}</p>
                <p>Date de création : {selectedIntervention.date_creation}</p>
                <p>Date de début : {selectedIntervention.date_debut ? selectedIntervention.date_debut :"la date pas assigné"}</p>
                <p>Date de fin : {selectedIntervention.date_fin ? selectedIntervention.date_fin :"la date pas assigné"}</p>
                <p>État : {selectedIntervention.etat}</p>
                <p>Adresse : {selectedIntervention.adresse ? selectedIntervention.adresse :"sans adresse"}</p>
                <p>Citoyen : {selectedIntervention.citoyen?.email ? selectedIntervention.citoyen.email : "il a pas email "}</p>
                <p>Service : {selectedIntervention.service?.nom ? selectedIntervention.service.nom : "no service "}</p>
                <p>Technician: {selectedIntervention.technicien ? (
  techncien.map(tech => {
    if (tech.id === selectedIntervention.technicien) {
      return <a href={`http://localhost:3000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem("userId")}/techniciens`}>{`${tech.first_name} ${tech.last_name}` }</a>;
    }
    return "Intervention is not assigned to a technician";
  })
) : "Intervention is not assigned to a technician"}</p>
                <p>Équipements :
                  <ul>
                    {selectedIntervention.equipements && selectedIntervention.equipements.map((equipementId) => {
                      const equipment = equipments.find(equip => equip.id === equipementId);
                      return (
                        <li key={equipment.id }>
                          {equipment ? equipment.nom : 'Unknown equipment'}
                        </li>
                      );
                    })}
                  </ul>
                </p>
                <p>Raison : {selectedIntervention.raison ? selectedIntervention.raison.description : "intervetion est pas en attend "}</p>
                {/* Ajoutez d'autres détails de l'intervention ici */}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModall} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
 
export default Chefservicepage ;