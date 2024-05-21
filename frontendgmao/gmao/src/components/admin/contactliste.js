import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import Navbar from './admindesign/home/navbar/navbar';
import Sidebar from './admindesign/home/sidebar/sidebar';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, IconButton } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';


function Contactadmin() {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(5); // Number of contacts per page
    const [totalDisplayedContacts, setTotalDisplayedContacts] = useState(5 * currentPage); // Total number of contacts currently displayed
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("");
    const [showPop, setShowPop] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null); // Selected contact to display more information
    const [dialogOpen, setDialogOpen] = useState(false); // State of the dialog open
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        if (token && role === "admin") {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [token]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/GetAllConatct/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/DeleteConatct/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setMessage("Le contact a été supprimé avec succès");
                setColor("success");
                setShowPop(true);
                setTimeout(() => {
                    setShowPop(false);
                }, 1500);
                // Supprime le contact supprimé de userData
                setUserData(prevUserData => prevUserData.filter(user => user.id !== id));
                console.log('Contact supprimé avec succès');
            } else {
                throw new Error('Échec de la suppression du contact');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du contact :', error);
        }
    };

    const handleOpenDialog = (contact) => {
        setSelectedContact(contact);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedContact(null);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Vérifie si userData est vide ou non défini avant de rendre le composant
    
    
    
    const columns = [
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'nom', headerName: 'Nom', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 400,
            renderCell: (params) => (
                <>
                  <Stack direction="row" spacing={2}>
      {/* Delete Button */}
      <Tooltip title="Supprimer" arrow>
        <IconButton
          onClick={() => handleDeleteContact(params.row.id)}
          color="error"
          sx={{ cursor: 'pointer' }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {/* View More Button */}
      <Tooltip title="Voir plus" arrow>
        <IconButton
          onClick={() => handleOpenDialog(params.row)}
          color="primary"
          sx={{ cursor: 'pointer' }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Stack>

                </>
            ),
        },
    ];
    

    // Calcul de la pagination
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = userData.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (event, value) => {
        setCurrentPage(value);
        setTotalDisplayedContacts(value * contactsPerPage);
    };

    const loadMoreContacts = () => {
        setTotalDisplayedContacts(prevTotal => prevTotal + contactsPerPage);
    };

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <h1>Liste des contacts</h1>
                {showPop && <PopupMessage message={message} color={color} />}
                <DataGrid
                    rows={currentContacts}
                    columns={columns}
                    checkboxSelection={false}
                    hideFooterPagination={true}
                    autoHeight={true}
                />
               
                <Pagination
                    count={Math.ceil(userData.length / contactsPerPage)}
                    page={currentPage}
                    onChange={paginate}
                />

                {/* Dialog pour afficher plus d'informations */}
                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Informations détaillées du contact</DialogTitle>
                    <DialogContent>
                        {selectedContact && (
                            <>
                                <div>Email: {selectedContact.email}</div>
                                <div>Nom: {selectedContact.nom}</div>
                                <div>Téléphone: {selectedContact.telephone}</div>
                                <div>Type de sujet: {selectedContact.sujet_type}</div>
                                <div>Message: {selectedContact.message}</div>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Fermer</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default Contactadmin;
