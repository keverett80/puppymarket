import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import './UserProfile.css';

const UserProfileEditForm = ({ onProfileUpdated, onDone, user }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, formData);
      onDone(); // Call the onDone prop after successfully updating
      if (onProfileUpdated) {
        onProfileUpdated();  // Inform the parent about the update
      }
    } catch (error) {
      console.error("Error updating user attributes", error);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="container mt-4">
    <div className="form-group">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        className="form-control"
        value={formData.email}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        name="name"
        id="name"
        className="form-control"
        value={formData.name}
        onChange={handleChange}
      />
    </div>
    <button type="submit" className="btn btn-primary">
      Save Changes
    </button>
    <button type="button" onClick={onDone} className="btn btn-secondary mx-2">
      Cancel
    </button>
  </form>
  );
}

export default UserProfileEditForm;
