import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    units: '',
    expiryDate: ''
  });

  useEffect(() => {
    // TODO: Fetch inventory from API
    // Sample data
    setInventory([
      { id: 1, bloodGroup: 'A+', units: 25, expiryDate: '2024-01-15' },
      { id: 2, bloodGroup: 'O-', units: 10, expiryDate: '2023-12-25' },
      { id: 3, bloodGroup: 'B+', units: 18, expiryDate: '2024-02-10' },
      { id: 4, bloodGroup: 'AB-', units: 5, expiryDate: '2024-01-05' }
    ]);
  }, []);

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { status: 'Expired', class: 'status-expired' };
    if (daysDiff <= 7) return { status: 'Near Expiry', class: 'status-warning' };
    return { status: 'Valid', class: 'status-valid' };
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ bloodGroup: '', units: '', expiryDate: '' });
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      bloodGroup: item.bloodGroup,
      units: item.units.toString(),
      expiryDate: item.expiryDate
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to add/update
    if (editingItem) {
      setInventory(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...formData, units: parseInt(formData.units) } : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        units: parseInt(formData.units)
      };
      setInventory(prev => [...prev, newItem]);
    }
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="inventory-management">
      <div className="header-section">
        <h1>Blood Inventory Management</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add New Inventory
        </button>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Units Available</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const { status, class: statusClass } = getStatus(item.expiryDate);
              return (
                <tr key={item.id} className={status === 'Near Expiry' ? 'near-expiry' : ''}>
                  <td>{item.bloodGroup}</td>
                  <td>{item.units}</td>
                  <td>{item.expiryDate}</td>
                  <td>
                    <span className={`status-indicator ${statusClass}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Update Inventory' : 'Add New Inventory'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <FormInput
                label="Units"
                name="units"
                type="number"
                value={formData.units}
                onChange={handleInputChange}
                min="1"
                required
              />

              <FormInput
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Add'} Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;