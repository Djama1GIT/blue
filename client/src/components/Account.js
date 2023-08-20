import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME } from '../Consts'

function Account({ session, setSession, user, setUser}) {
  document.title = `${NAME} - My Account`;

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showForOBS, setShowForOBS] = useState(false);
  const [secretKeyType, setSecretKeyType] = useState("password");
  const [forOBSType, setForOBSType] = useState("password");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionCookie = document.cookie.includes('session');
    if (!sessionCookie) {
      navigate('/');
    }
  }, []);

  const toggleVisibility = (type) => {
    if (type === "secret-key") {
      setShowSecretKey(!showSecretKey);
      setSecretKeyType(showSecretKey ? "password" : "text");
    } else if (type === "for-obs") {
      setShowForOBS(!showForOBS);
      setForOBSType(showForOBS ? "password" : "text");
    }
  };

  return (
    <div className="__content">
      <div className="__wrap_content acc">
        <h1>My Account</h1>
        <h3>My details</h3>
        <div>Username: <input id="name" placeholder="Enter Your Username" /></div>
        <div>Email: <input id="email" placeholder="Enter Your Email" value={user.email}/></div>
        <p>Change password</p>
        <div>Old password: <input id="old_password" placeholder="Enter Old Password" /></div>
        <div>New password: <input id="new_password" placeholder="Enter New Password" /></div>
        <div>Confirm password: <input id="confirm_password" placeholder="Confirm Password" /></div>
      </div>
      <div className="__wrap_content acc">
        <h3>Stream details</h3>
        <div>Name: <input placeholder="Enter Stream Name" /></div>
        <div>Token: <input value="23dewerwuifhgf" type="text" /></div>
        <div>Secret-key: <input value="23dewerwfwefwefwuifhgf" type={secretKeyType} /></div>
        <div className="secret" id="secret-key" onClick={() => toggleVisibility("secret-key")}>
          <p className="eye">{showSecretKey ? "👁" : "👀️"}</p>
        </div>
        <div>For OBS: <input value="23dewerwuifwefqwfwfqwfwqfwqfqwfwqfeweqfhgf" type={forOBSType} /></div>
        <div className="secret" id="for-obs" onClick={() => toggleVisibility("for-obs")}>
          <p className="eye">{showForOBS ? "👁" : "👀️"}</p>
        </div>
        <div>Description: <textarea placeholder="Enter Stream Description (optional)" /></div>
      </div>
    </div>
  );
}


export default Account;