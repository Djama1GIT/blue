import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME, AVATARS_URL, PREVIEWS_URL } from '../Consts'
import { getCookie, deleteCookie } from '../Utils';

function Account(props) {
  const { session, setSession, user, setUser, fetchUser } = props;
  document.title = `${NAME} - My Account`;

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showForOBS, setShowForOBS] = useState(false);
  const [secretKeyType, setSecretKeyType] = useState("password");
  const [forOBSType, setForOBSType] = useState("password");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [streamName, setStreamName] = useState('loool');
  const [streamDescription, setStreamDescription] = useState('not lol');

  const navigate = useNavigate();

  useEffect(() => {
    const sessionCookie = document.cookie.includes('session');
    if (!sessionCookie) navigate('/');
    if (!user) setUser(fetchUser(getCookie('session')));
    setUsername(user?.name);
    setEmail(user?.email);
    setStreamDescription(user?.stream?.description);
    setStreamName(user?.stream?.name)
  }, [session]);

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
        <h1>Settings</h1>
      <div className="__wrap_content acc">
        <h3>Stream details</h3>
        <div className="image">
            <img src={`${PREVIEWS_URL}6.png`} alt="" />
        </div>
        <div>Name: <input placeholder="Enter Stream Name" value={streamName} onChange={(e) => setStreamName(e.target.value)} /></div>
        <div>Description: <textarea placeholder="Enter Stream Description (optional)" value={streamDescription} onChange={(e) => setStreamDescription(e.target.value)} /></div>
        <div>Token: <input value={user?.stream?.token} type="text" /></div>
        <div>Secret-key: <input value={user?.stream?.secret_key} type={secretKeyType} /></div>
        <div className="secret" id="secret-key" onClick={() => toggleVisibility("secret-key")}>
          <p className="eye">{showSecretKey ? "👁" : "👀️"}</p>
        </div>
        <div>For OBS: <input value={`${user?.stream?.token}?key=${user?.stream?.secret_key}`} type={forOBSType} /></div>
        <div className="secret" id="for-obs" onClick={() => toggleVisibility("for-obs")}>
          <p className="eye">{showForOBS ? "👁" : "👀️"}</p>
        </div>
        <div className="buttons">
            <button className="button">Regenerate secret</button>
            <button className="button">Save changes</button>
        </div>
      </div>
      <div className="__wrap_content acc">
        <h3>My details</h3>
        <div>Username: <input id="name" placeholder="Enter Your Username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
        <div>Email: <input id="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <p>Change password</p>
        <div>Old password: <input id="old_password" placeholder="Enter Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
        <div>New password: <input id="new_password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
        <div>Confirm password: <input id="confirm_password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
        <div className="buttons">
            <button className="button">Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default Account;
