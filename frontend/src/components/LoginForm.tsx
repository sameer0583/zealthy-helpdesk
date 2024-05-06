import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserAPI } from '../services/api';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await UserAPI.login(credentials.email, credentials.password);
      login(data);
      onLoginSuccess();
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div className="container zealthy-container">
      <h2 className="page-heading">
        Admin Login
        <p className="subtext">You must be logged in to view this page.</p>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Email address*"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password*"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-default btn-submit" type="submit">Login</button>
      </form>
      {error && <p className="error has-error">{error}</p>}
    </div>
  );
};

export default LoginForm;