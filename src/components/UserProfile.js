import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { listDogs } from './../graphql/queries';

import useScrollToTop from '../helpers/useScrollToTop';
import DogCardGrid from './DogCard/DogCardGrid';
import UserProfileEditForm from './UserProfileEditForm';

const fetchUserPosts = async (ownerEmail) => {
  try {
    const postData = await API.graphql({
      query: listDogs,
      variables: {
        limit: 5000,
        filter: { verified: { eq: ownerEmail } }
      },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });

    const posts = postData.data.listDogs.items;

  const postsWithUrls = posts.map((post) => ({
  ...post,
  imageUrls: Array.isArray(post.imageUrls) ? post.imageUrls : [],
}));

    return postsWithUrls;
  } catch (error) {
    console.error("Error fetching user's dog posts", error);
    return [];
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
      console.log(userData);
console.log("Attributes:", userData.attributes);
      setUser(userData.attributes);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchUserPosts(user.email).then(setUserPosts);
    }
  }, [user]);

  return (
    <div>
      {!user ? (
        <div>Loading...</div>
      ) : isEditing ? (
        <UserProfileEditForm
          user={user}
          onDone={() => setIsEditing(false)}
          onProfileUpdated={fetchUser}
        />
      ) : (
        <DogCardGrid posts={userPosts} showManage={true} onRefresh={fetchUserPosts} />

      )}
    </div>
  );
}

export default UserProfile;
