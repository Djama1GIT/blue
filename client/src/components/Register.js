import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME } from '../Consts';

function Register({ session, setSession, user, setUser }) {
  document.title = `${NAME} - Register`;

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session]);

  const handleRegister = async () => {
    try {
      if (!login || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (login.length < 8) {
        setError('Login should be at least 8 characters long');
        return;
      }

      if (password.length < 8) {
        setError('Password should be at least 8 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post(`${HOST}api/users/register/`, {
        login: login,
        password: password
      });

      if (!response.data.message) {
        navigate("/login/");
      }
    } catch (error_) {
      console.log(error_);
      setError(error_.response?.data.message);
    }
  };

  return (
    <div className="__content">
      <div className="__wrap_content">
        <h1>Register</h1>
        <input
          type="text"
          id="login"
          placeholder="Enter login"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          id="confirm_password"
          placeholder="Confirm password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Link className="recovery_login-link" to="/login/">
          Already have an account?
        </Link>
        <p>
          <button id="register-submit" type="submit" onClick={handleRegister}>
            Register
          </button>
        </p>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default Register;
