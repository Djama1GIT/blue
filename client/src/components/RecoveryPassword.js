import { Link } from 'react-router-dom';

import { NAME } from '../Consts'

function RecoveryPassword() {
  document.title = `${NAME} - Recovery Password`;
  return (
    <div className="auth-content">
        <div className="auth">
            <h1>Recovery Account</h1>
            <input type="text" id="login" placeholder="Enter login" required/>
            <p>
                <Link className="register-link" to='/register/'>Create an account</Link>
                <button id="recovery-submit" type="submit">Recovery</button>
            </p>

        </div>
    </div>
  );
}

export default RecoveryPassword;