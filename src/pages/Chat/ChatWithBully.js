import React, { useState, useRef, useEffect } from 'react';

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import bullyAvatar from '../../assets/images/bully-avatar.png';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';
import './ChatWithBully.css';
import useScrollToTop from '../../helpers/useScrollToTop';

// OpenAI Configuration


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // This is also the default, can be omitted
});


const ChatWithBully = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };
  const initialGreeting = { text: "Hi there! I'm your virtual assistant at Little Paws Place. How can I help you with dogs and puppies today?", sender: "ai" };
  const [messages, setMessages] = useState([]); // Start with an empty array
  const [userInput, setUserInput] = useState('');
  const [isModelTyping, setIsModelTyping] = useState(true); // Start with typing indicator

  const chatWindowRef = useRef(null);

  // Introduce a delay and then display the initial greeting
  useEffect(() => {
    const displayGreetingAfterDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

  setIsModelTyping(false); // Stop showing typing indicator
  setMessages([initialGreeting]); // Show the initial greeting
};

displayGreetingAfterDelay();
}, []);



  const sendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const prompt = `Focus on dogs, puppies, and related products only and reference yourself as a virtual assistant name Paw. User: ${userInput}\nAssistant: `;
    setMessages(messages => [...messages, { text: userInput, sender: "user" }]);
    setUserInput('');

    // Start typing indicator
    setIsModelTyping(true);

    try {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(5000); // Wait for 2 seconds to simulate typing

      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 150,
      });

      setIsModelTyping(false); // Stop typing indicator

      const aiResponse = response.choices[0].text.trim();

      if (isResponseAppropriate(aiResponse)) {
        setMessages(messages => [
          ...messages,
          { text: aiResponse, sender: "ai" }
        ]);
      } else {
        setMessages(messages => [
          ...messages,
          { text: "Let's keep our conversation focused on our furry friends!", sender: "ai" }
        ]);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setIsModelTyping(false); // Stop typing indicator in case of error
    }
  };


  // Utility function to check response appropriateness
  const isResponseAppropriate = (response) => {
    const forbiddenKeywords = ['unrelated_keyword1', 'unrelated_keyword2']; // Add more as needed
    return !forbiddenKeywords.some(keyword => response.includes(keyword));
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]); // Dependency on messages, so it runs whenever messages update

  const avatarVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.5 } },
    hover: { scale: 1.1 }
  };

  return (
    <Container className="p-3">
      <Row>
        <Col md={4} className="text-center" style={{ display: 'flex', alignItems: 'start', justifyContent: 'center' }}>

        <motion.img
            src={bullyAvatar}
            alt="Bully Avatar"
            className="avatar"
            variants={avatarVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          />

        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
            <div className="chat-window" ref={chatWindowRef}>
  {messages.map((message, index) => (
    <div
      key={index}
      className={`chat-message ${message.sender === "user" ? "user-message" : "ai-message"}`}
    >
      {message.text}
    </div>
  ))}
  {isModelTyping && (
    <div className="typing-indicator">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  )}
</div>


                <Form onSubmit={sendMessage}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button variant="primary" type="submit" className="mt-2">
            Send
          </Button>
        </Form.Group>
      </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatWithBully;
