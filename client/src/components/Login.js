import { Link } from 'react-router-dom';

import { NAME } from '../Consts'

function Login() {
  document.title = `${NAME} - Login`;
  return (
    <div className="auth-content">
        <div className="auth">
            <h1>Login</h1>
            <input type="text" id="login" placeholder="Enter login" required/>
            <input type="text" id="password" placeholder="Enter password" required/>
            <Link className="recovery_login-link" to='/recovery-password'>Forgot your password?</Link>
            <p>
                <Link className="register-link" to='/register'>Create an account</Link>
                <button id="login-submit" type="submit">Login</button>
            </p>

        </div>
    </div>
  );
}

export default Login;