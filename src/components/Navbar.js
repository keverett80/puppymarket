import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUserEdit, faUserSlash, faUserCircle, faPlusCircle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useScrollToTop from '../helpers/useScrollToTop';
import { listDogs } from '../graphql/queries';
import { deleteDog } from '../graphql/mutations';

function NavbarComponent({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  useScrollToTop();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserDetails({
          name: user.attributes.name || '',
          email: user.attributes.email || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (isAuthenticated) fetchUser();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm("This will permanently delete your account and all associated listings. Continue?");
    if (!confirmed) return;

    try {
      const user = await Auth.currentAuthenticatedUser();
      const email = user.attributes.email;

      const dogData = await API.graphql(graphqlOperation(listDogs, { filter: { verified: { eq: email } } }));
      const dogs = dogData.data.listDogs.items;

      for (const dog of dogs) {
        await API.graphql(graphqlOperation(deleteDog, { input: { id: dog.id } }));
        for (const key of dog.imageUrls || []) {
          await Storage.remove(key, { level: 'public' });
        }
      }

      await Auth.deleteUser();
      alert("Your account has been deleted.");
      navigate('/');
    } catch (err) {
      console.error("Failed to delete profile:", err);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'transparent', border: '1px solid #e8e8e8' }}>
      <Container fluid>
        <Navbar.Brand href='/' className="text-primary font-weight-bold">
          <FontAwesomeIcon icon={faPaw} /> Little Paws Place
        </Navbar.Brand>

        <div className="ms-auto d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <Button variant="light" onClick={() => navigate('/add-dog')} title="Add Dog" className="mx-1">
                <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
              <Button variant="light" onClick={() => navigate('/profile')} title="Profile" className="mx-1">
                <FontAwesomeIcon icon={faUserCircle} />
              </Button>
              <Button variant="light" onClick={() => setShowEditModal(true)} title="Edit Profile" className="mx-1">
                <FontAwesomeIcon icon={faUserEdit} />
              </Button>
              <Button variant="light" onClick={handleLogout} title="Logout" className="mx-1">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)} title="Delete Profile" className="mx-1">
                <FontAwesomeIcon icon={faUserSlash} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-primary" onClick={() => navigate('/paw-home')} className="mx-1">
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/paw-home')} className="mx-1">
                Register
              </Button>
            </>
          )}
        </div>

        {/* Edit Profile Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" defaultValue={userDetails.name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" defaultValue={userDetails.email} disabled />
              </Form.Group>
              <Button variant="primary" onClick={() => setShowEditModal(false)}>Save</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Profile Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>This action will permanently delete your account and all listings. Continue?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteProfile}>Delete</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
