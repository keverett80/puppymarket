import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import UserProfileEditForm from './UserProfileEditForm';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData.attributes);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>

          {isEditing ? (
            <UserProfileEditForm
               user={user}
               onDone={() => setIsEditing(false)}
               onProfileUpdated={fetchUser} // Refetch user data after updating
            />
          ) : (
            <div className="container mt-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">User Profile</h4>
                <div className="form-group">
                  <label>Email:</label>
                  <div className="form-control-static">{user.email}</div>
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <div className="form-control-static">{user.name}</div>
                </div>
                {/* Display other user attributes as needed */}
                {isEditing ? (
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default UserProfile;
