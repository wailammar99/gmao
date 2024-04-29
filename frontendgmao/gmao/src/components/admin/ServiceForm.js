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
        description: service.descrtions,
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
            <h5 className="modal-title">Modifier le service</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom">Nom:</label>
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
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.descrtions}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Modifier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;
