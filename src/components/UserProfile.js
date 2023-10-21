import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import UserProfileEditForm from './UserProfileEditForm';
import { API, graphqlOperation } from 'aws-amplify';
import { listDogs } from './../graphql/queries';  // Ensure the path is correct

const fetchUserPosts = async (ownerEmail) => {
  try {
    const postData = await API.graphql(graphqlOperation(listDogs, {
      filter: { owner: { eq: ownerEmail } }
    }));
    return postData.data.listDogs.items;
  } catch (error) {
    console.error("Error fetching user's dog posts", error);
  }
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
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

  useEffect(() => {
    if (user) {
      fetchUserPosts(user.email).then(posts => {
        console.log('fetching users post' + posts)
        setUserPosts(posts);
      });
    }
  }, [user]);

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
                        <ul>
  {userPosts.map(post => (
    <li key={post.id}>
      {post.name} - {post.breed} - {post.price}
      {/* You can add a link to the detailed page here, if required */}
    </li>
  ))}
</ul>
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
