const MyDataGrid = ({ rows }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', adresse: '' });
    const [currentId, setCurrentId] = useState(null);
  
    const handleClickOpen = (id) => {
      setCurrentId(id);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = () => {
      updateIntervention(currentId, formData);
      handleClose();
    };
  
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Intervention</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form to update the intervention.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="adresse"
              label="Address"
              type="text"
              fullWidth
              variant="standard"
              value={formData.adresse}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  
  export default MyDataGrid;
  