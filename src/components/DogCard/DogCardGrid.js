import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Storage, API, graphqlOperation, Auth } from 'aws-amplify';
import { updateDog, deleteDog } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import DogCard from './DogCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // make sure this is at the top
import noListingsImage from '../../assets/images/noImages.png';


export default function DogCardGrid({ posts, showManage = false, user, onRefresh }) {

  const [selectedDog, setSelectedDog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [dogToDelete, setDogToDelete] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [postsState, setPostsState] = useState(posts || []);
const navigate = useNavigate();

const handleRemoveImage = (index) => {
  setImagePreviews((prev) => prev.filter((_, i) => i !== index));
};

  const handleEdit = async (dog) => {
  setSelectedDog(dog);
  setFormData({ ...dog });

  const previews = await Promise.all(
    (dog.imageUrls || []).map(async (key) => {
      try {
        const url = await Storage.get(key, { level: 'public' });
        return { type: 'stored', key, url };
      } catch (err) {
        console.warn('Failed to load image:', key, err);
        return null;
      }
    })
  );

  setImagePreviews(previews.filter(Boolean));
  setShowEditModal(true);
};



const handleDelete = async (targetDog) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const userName = user.username;

    if (targetDog.owner !== userName) {
      alert("Unauthorized.");
      return;
    }

    // 1. Delete images from S3
    if (targetDog.imageUrls && Array.isArray(targetDog.imageUrls)) {
      for (const key of targetDog.imageUrls) {
        try {
          await Storage.remove(key, { level: 'public' });
        } catch (err) {
          console.warn(`Failed to delete image: ${key}`, err);
        }
      }
    }

    // 2. Delete the listing from DynamoDB
    await API.graphql(graphqlOperation(deleteDog, { input: { id: targetDog.id } }));

    // 3. Update local state
    setPostsState(prev => prev.filter(p => p.id !== targetDog.id));

  } catch (err) {
    console.error('Delete failed', err);
    alert('Failed to delete listing.');
  }
};


const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  if (imagePreviews.length + files.length > 5) {
    alert("You can only upload up to 5 images.");
    return;
  }

  const newPreviews = files.map(file => ({
    type: 'new',
    file,
    url: URL.createObjectURL(file)
  }));

  setImagePreviews(prev => [...prev, ...newPreviews]);
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    const uploadedImages = await Promise.all(
      imagePreviews.map(async (img) => {
        if (img.type === 'stored') return img.key;

        const ext = img.file.name.split('.').pop();
        const key = `${uuidv4()}.${ext}`;
        await Storage.put(key, img.file, {
          contentType: img.file.type,
          level: 'public'
        });
        return key;
      })
    );

    // Only allow fields valid for UpdateDogInput
    const allowedFields = [
      'id', 'name', 'breed', 'birthDate', 'description',
      'price', 'gender', 'location', 'state'
    ];

    const updateInput = Object.fromEntries(
      Object.entries(formData).filter(([key]) => allowedFields.includes(key))
    );

    updateInput.imageUrls = uploadedImages;

    await API.graphql(graphqlOperation(updateDog, { input: updateInput }));

    setShowEditModal(false);
    window.location.reload();
  } catch (err) {
    console.error('Update failed', err);
    alert('Failed to update listing.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
  <Container fluid>
    {posts.length === 0 ? (
      <div className="text-center my-5">
        <img src={noListingsImage} alt="No listing" style={{ maxWidth: '250px', opacity: 0.5 }} />

        <h5 className="text-muted mt-3">No listings yet.</h5>
        <Button variant="primary" onClick={() => navigate('/add-dog')} className="mt-2">
          Add Your First Listing
        </Button>
      </div>
    ) : (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted"> {posts.length} Listing{posts.length !== 1 ? 's' : ''} </div>
        </div>

        <AnimatePresence mode="popLayout">
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {posts.map((post) => (
              <Col
                key={post.id}
                as={motion.div}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <DogCard
                  dog={post}
                  showManage={showManage}
                  onEdit={handleEdit}
                  onDelete={() => {
                    setDogToDelete(post);
                    setShowDeleteModal(true);
                  }}
                />
              </Col>
            ))}
          </Row>
        </AnimatePresence>
      </>
    )}

<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to permanently remove <strong>{dogToDelete?.name}</strong> from your listings?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </Button>
 <Button
  variant="danger"
  onClick={() => {
    handleDelete(dogToDelete);
    setShowDeleteModal(false);
  }}
>
  Yes, Delete
</Button>

  </Modal.Footer>
</Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" value={formData.name || ''} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Breed</Form.Label>
                  <Form.Control name="breed" value={formData.breed || ''} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control name="price" type="number" value={formData.price || ''} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control name="location" value={formData.location || ''} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Images</Form.Label>
             {imagePreviews.length < 5 && (
  <Form.Control type="file" accept="image/*" multiple onChange={handleImageChange} />
)}

           <div className="d-flex flex-wrap mt-2">
  {imagePreviews.map((img, idx) => (
    <div key={idx} style={{ position: 'relative', marginRight: '10px' }}>
      <img
        src={img.url}
        alt="preview"
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleRemoveImage(idx)}
        style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          padding: '2px 6px',
          borderRadius: '50%',
          fontSize: '0.75rem',
          lineHeight: '1',
        }}
        title="Remove Image"
      >
        ×
      </Button>
    </div>
  ))}
</div>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}