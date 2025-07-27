import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import OpenAI from 'openai';
import { motion } from 'framer-motion';
import bullyAvatar from '../../assets/images/bully-avatar.png';
import './PetMatchQuiz.css';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const topics = ["Dogs", "Cats", "Pet Care", "Exotic Pets", "Funny Facts"];

const PetMatchQuiz = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const startTopic = (topic) => {
    setSelectedTopic(topic);
    setMessages([
      { sender: "assistant", text: `Great! Let's test your knowledge on ${topic} 🐾 Ready for your first question?` }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are Paw, a playful and kind pet-themed assistant. Ask pet trivia in topic: ${selectedTopic}` },
          ...updatedMessages.map(msg => ({
            role: msg.sender === "assistant" ? "assistant" : "user",
            content: msg.text
          }))
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      const assistantReply = response.choices[0].message.content.trim();
      setMessages([...updatedMessages, { sender: "assistant", text: assistantReply }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { sender: "assistant", text: "Oops! Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {!selectedTopic ? (
        <>   <Button
      variant="outline-secondary"
      className="mb-3"
      onClick={() => window.history.back()}
    >
      ← Back
    </Button>
          <h3 className="text-center mb-4">🐶 Choose a topic to begin your fun quiz:</h3>
          <Row className="justify-content-center">
            {topics.map(topic => (
              <Col key={topic} xs={6} md={4} lg={3} className="mb-3">
                <Button variant="outline-primary" className="w-100" onClick={() => startTopic(topic)}>
                  {topic}
                </Button>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>
  <Button
    variant="outline-secondary"
    className="mb-3"
    onClick={() => {
      setSelectedTopic('');
      setMessages([]);
    }}
  >
    ← Back to Topics
  </Button>

  <Card className="p-3">

          <div className="d-flex align-items-start mb-3">
            <img
              src={bullyAvatar}
              alt="Avatar"
              className="avatar me-3"
              style={{ width: 60, height: 60, borderRadius: '50%' }}
            />
            <h5 className="mb-0">Chat with Paw 🐾</h5>
          </div>

          <div
            className="chat-window"
            style={{ maxHeight: 400, overflowY: 'auto' }}
            ref={chatRef}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender === 'assistant' ? 'ai-message' : 'user-message'}`}>
                <strong>{msg.sender === 'assistant' ? 'Paw:' : 'You:'}</strong> {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            )}
          </div>

          <Form onSubmit={handleSubmit} className="d-flex align-items-center mt-3">
            <img
              src={bullyAvatar}
              alt="Avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
            />
            <Form.Control
              type="text"
              placeholder="Type your answer..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button type="submit" variant="primary" className="ms-2" disabled={isLoading}>Send</Button>
          </Form>
        </Card></>

      )}
    </Container>
  );
};

export default PetMatchQuiz;
