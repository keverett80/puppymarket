import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import UserProfileEditForm from './UserProfileEditForm';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import useScrollToTop from '../helpers/useScrollToTop';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';



import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { listDogs } from './../graphql/queries';  // Ensure the path is correct

const fetchUserPosts = async (ownerEmail) => {
  try {
    const postData = await API.graphql({
      query: listDogs,
      variables: {  limit: 5000,filter: { verified: { eq: ownerEmail } } }, // <-- Corrected this line
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });
    console.log('Returned data:', postData);
    return postData.data.listDogs.items;
  } catch (error) {
    console.error("Error fetching user's dog posts", error);
  }
};


function UserProfile() {

  useScrollToTop();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        console.log(userData.attributes)
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
      fetchUserPosts(user.email)
        .then(posts => {
          console.log('fetching users post', posts);
          setUserPosts(posts);
        })
        .catch(error => {
          console.error('Error fetching user posts:', error);
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
            <div className="container mt-4  ml-2 mb-4 mr-2">
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
            <ListGroup>
  {userPosts.map(post => (
    <ListGroup.Item key={post.id}>
      <Link to={`/dogs/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

        {post.name} <span className="ml-2 mr-2"> - </span> {post.breed} <span className="ml-2 mr-2"> - </span> ${post.price} <FontAwesomeIcon icon={faPaw} className="mr-2" />
      </Link>
    </ListGroup.Item>
  ))}
</ListGroup>


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
