import { Link } from 'react-router-dom';

import { NAME } from '../Consts'

function Register() {
  document.title = `${NAME} - Register`;
  return (
    <div className="auth-content">
        <div className="auth">
            <h1>Register</h1>
            <input type="text" id="login" placeholder="Enter login" required/>
            <input type="text" id="password" placeholder="Enter password" required/>
            <input type="text" id="confirm_password" placeholder="Confirm password" required/>
            <Link className="recovery_login-link" to='/login'>Already have an account?</Link>
            <p>
                <button id="register-submit" type="submit">Register</button>
            </p>

        </div>
    </div>
  );
}

export default Register;