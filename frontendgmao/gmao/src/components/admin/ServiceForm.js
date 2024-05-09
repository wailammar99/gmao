import React, { useState, useEffect } from 'react';

function ServiceForm({ service, onUpdate, onClose }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

  // Update formData when service prop changes
  useEffect(() => {
    if (service) {
      setFormData({
        nom: service.nom,
        description: service.description, // Corrected property name
      });
    } else {
      setFormData({
        nom: '',
        description: '',
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose(); // Close the modal after form submission
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{service ? 'Modifier' : 'Ajouter'} le service</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nom" className="form-label">Nom:</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className="form-control"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                <button type="submit" className="btn btn-primary">{service ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;
