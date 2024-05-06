import React, { useState } from 'react';
import { TicketAPI } from '../services/api';

const HomePage: React.FC = () => {
  const [ticket, setTicket] = useState({
    name: '',
    email: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track if form is submitted

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await TicketAPI.create(ticket.name, ticket.email, ticket.description);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the ticket.');
    }
  };

  // If the form has been submitted, display the success message
  if (isSubmitted) {
    return (
      <div id="create-ticket" className="container zealthy-container">
        <h2 className="page-heading">Thanks for Reaching Out!</h2>
        <p className="success">
          We will get back to you shortly.
        </p>
      </div>
    );
  }

  // Otherwise, display the form
  return (
    <div id="create-ticket" className="container zealthy-container">
      <h2 className="page-heading">
        Open Support Ticket
        <p className="subtext">How can we help?</p>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            className="form-control"
            name="name"
            placeholder="Name*"
            value={ticket.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            className="form-control"
            name="email"
            placeholder="Email address*"
            value={ticket.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Description of the problem you are experiencing*"
            value={ticket.description}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-default btn-submit" type="submit">Submit Ticket</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default HomePage;