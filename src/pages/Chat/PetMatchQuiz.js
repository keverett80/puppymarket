import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import OpenAI from 'openai';
import { motion } from 'framer-motion';
import bullyAvatar from '../../assets/images/bully-avatar.png';
import './PetMatchQuiz.css';
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const PetMatchQuiz = () => {
  const [messages, setMessages] = useState([
    { sender: "system", text: "You are Paw, a friendly assistant at Little Paws Place..." },
    { sender: "assistant", text: "Hi! I'm Paw 🐾 Let's find your perfect pet. What size of pet are you most comfortable with?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
        messages: updatedMessages
          .filter(msg => msg.sender !== "system")
          .map(msg => ({
            role: msg.sender === "assistant" ? "assistant" : "user",
            content: msg.text
          })),
        temperature: 0.7,
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
      <motion.img
        src={bullyAvatar}
        alt="Paw Avatar"
        className="avatar mb-3 d-block mx-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />

      <Card className="p-3">
        <div
          className="chat-window"
          style={{ maxHeight: 400, overflowY: 'auto' }}
          ref={chatRef}
        >
          {messages.filter(msg => msg.sender !== "system").map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender === "assistant" ? "Paw:" : "You:"}</strong> {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Control
            type="text"
            placeholder="Your answer..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
            Send
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PetMatchQuiz;
