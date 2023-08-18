import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME } from '../Consts'

function Login() {
  document.title = `${NAME} - Login`;

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sessionCookie = document.cookie.includes('session');
    if (sessionCookie) {
      navigate('/');
    }
  }, []);

  const handleLogin = async () => {
    try {
      if (!login || !password) {
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

      const response = await axios.post(`${HOST}api/users/login/`, {
        login: login,
        password: password
      }, { withCredentials: true });

      navigate('/');
    } catch (error_) {
      setError(error_.response?.data.message);
    }
  };

  return (
    <div className="auth-content">
        <div className="auth">
            <h1>Login</h1>
            <input type="text" id="login" placeholder="Enter login" required value={login} onChange={(e) => setLogin(e.target.value)} />
            <input type="password" id="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Link className="recovery_login-link" to='/recovery-password/'>Forgot your password?</Link>
            <p>
                <Link className="register-link" to='/register/'>Create an account</Link>
                <button id="login-submit" type="submit" onClick={handleLogin}>Login</button>
            </p>
            {error && <div className="error">{error}</div>}
        </div>
    </div>
  );
}

export default Login;