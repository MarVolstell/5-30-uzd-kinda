import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/user/user.scss';
import { login } from '../services/authServices';

function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Prisijungimas';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Minimali klientinė validacija
    if (!name.trim() && !email.trim() || !password.trim()) {
      setError('Prašome užpildyti visus laukus.');
      return;
    }


    try {
      await login(name, email, password);
      navigate('/dashboard'); // Peradresavimas į pagrindinį puslapį po sėkmingo prisijungimo
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Prisijungimas</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Vardas</label>
        <input
          type="text"
          id="username"
          name="username"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Slaptažodis</label>
        <input
          type="password"
          id="password"
          name="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className='btn-submit'>
          Prisijungimas
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;