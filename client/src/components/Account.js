import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME, AVATARS_URL, PREVIEWS_URL } from '../Consts'
import { getCookie, deleteCookie } from '../Utils';

function Account(props) {
  const { session, setSession, user, setUser, fetchUser } = props;
  document.title = `${NAME} - My Account`;

  const [previewFile, setPreviewFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showForOBS, setShowForOBS] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [secretKeyType, setSecretKeyType] = useState("password");
  const [forOBSType, setForOBSType] = useState("password");
  const [oldType, setOldType] = useState("password");
  const [newType, setNewType] = useState("password");
  const [confirmType, setConfirmType] = useState("password");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [streamName, setStreamName] = useState('');
  const [streamDescription, setStreamDescription] = useState('');

  const navigate = useNavigate();

  const handlePreviewChange = (event) => {
    setPreviewFile(event.target.files[0]);
  };

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleUploadStreamSettings = () => {
    if ( previewFile ) {
      const formData = new FormData();
      formData.append('file', previewFile);
      formData.append('file_type', 'previews');

      axios.post(`${HOST}upload/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }

    axios.patch(`${HOST}api/streams/stream/settings/`,
      {
        name: streamName,
        description: streamDescription
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const handleRegenerateSecret = () => {
    axios.post(`${HOST}api/streams/stream/settings/regenerate-secret/`, {}, {
      withCredentials: true,
    })
    .then((response) => {
      setSecretKey(response.data.secret_key);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleUploadUserSettings = () => {
    if (oldPassword != '') {
        if (newPassword == '') {
          setUserError('Incorrect new password');
          return
        }
        else if (newPassword.length < 8) {
          setUserError('The new password is too short');
          return
        }
        else if (newPassword != confirmPassword) {
          setUserError('Passwords don\'t match');
          return
        }
        else {
          setUserError('');
        }
    }
    if ( avatarFile ) {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('file_type', 'avatars');

      axios.post(`${HOST}upload/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }

    axios.patch(`${HOST}api/users/settings/`,
      {
        username: username,
        email: email,
        old_password: oldPassword,
        new_password: newPassword
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        setUserError('');
        setUserSuccess('Changes applied!')
      })
      .catch((error) => {
        setUserError(error.response.data.message);
        setUserSuccess('')
        console.log(error);
      });
  };

  useEffect(() => {
    const sessionCookie = document.cookie.includes('session');
    if (!sessionCookie) navigate('/');
    if (!user) setUser(fetchUser(getCookie('session')));
    setUsername(user?.name);
    setEmail(user?.email);
    setStreamDescription(user?.stream?.description);
    setStreamName(user?.stream?.name);
    setSecretKey(user?.stream?.secret_key);
  }, [session]);

  const toggleVisibility = (type) => {
    if (type === "secret-key") {
      setShowSecretKey(!showSecretKey);
      setSecretKeyType(showSecretKey ? "password" : "text");
    } else if (type === "for-obs") {
      setShowForOBS(!showForOBS);
      setForOBSType(showForOBS ? "password" : "text");
    } else if (type === "old_pass") {
      setShowOldPassword(!showOldPassword);
      setOldType(showOldPassword ? "password" : "text");
    } else if (type === "new_pass") {
      setShowNewPassword(!showNewPassword);
      setNewType(showNewPassword ? "password" : "text");
    } else if (type === "confirm_pass") {
      setShowConfirmPassword(!showConfirmPassword);
      setConfirmType(showConfirmPassword ? "password" : "text");
    }
  };

  return (
    <div className="__content">
        <h1>Settings</h1>
      <div className="__wrap_content acc">
        <h3>Stream details</h3>

        <div className="image">
            <img src={`${PREVIEWS_URL}${user?.id}.png`} alt="" id="preview"/>
        </div>
        <span>Change Preview</span>
        <input type="file" accept=".jpg, .jpeg, .png" className="uploader" onChange={handlePreviewChange}/>

        <div>Name: <input placeholder="Enter Stream Name" value={streamName} maxlength="120" onChange={(e) => setStreamName(e.target.value)} /></div>
        <div>Description: <textarea placeholder="Enter Stream Description (optional)" maxlength="2000" value={streamDescription} onChange={(e) => setStreamDescription(e.target.value)} /></div>
        <div>Token: <input value={user?.stream?.token} type="text" /></div>
        <div>Secret-key: <input value={secretKey} type={secretKeyType} /></div>
        <div className="secret" id="secret-key" onClick={() => toggleVisibility("secret-key")}>
          <p className="eye">{showSecretKey ? "👁" : "👀️"}</p>
        </div>
        <div>For OBS: <input value={`${user?.stream?.token}?key=${secretKey}`} type={forOBSType} /></div>
        <div className="secret" id="for-obs" onClick={() => toggleVisibility("for-obs")}>
          <p className="eye">{showForOBS ? "👁" : "👀️"}</p>
        </div>
        <div className="buttons">
            <button className="button" onClick={handleRegenerateSecret}>Regenerate secret</button>
            <button className="button" onClick={handleUploadStreamSettings}>Save changes</button>
        </div>
      </div>
      <div className="__wrap_content acc">
        <h3>My details</h3>
        <div id="avatar-image">
            <img src={`${AVATARS_URL}${user?.id}.png`} alt="" id="avatar"/>
        </div>
        <span>Change Avatar</span>
        <input type="file" accept=".jpg, .jpeg, .png" className="uploader" onChange={handleAvatarChange}/>
        <div>Username: <input id="name" placeholder="Enter Your Username" maxlength="30" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
        <div>Email: <input id="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <p>Change password <span className="error">{userError}</span><span className="success">{userSuccess}</span></p>
        <div>Old password: <input id="old_password" type={oldType} placeholder="Enter Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
        <div className="secret" id="old_pass" onClick={() => toggleVisibility("old_pass")}>
          <p className="eye">{showOldPassword ? "👁" : "👀️"}</p>
        </div>
        <div>New password: <input id="new_password" type={newType} placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
        <div className="secret" id="new_pass" onClick={() => toggleVisibility("new_pass")}>
          <p className="eye">{showNewPassword ? "👁" : "👀️"}</p>
        </div>
        <div>Confirm password: <input id="confirm_password" type={confirmType} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
        <div className="secret" id="confirm_pass" onClick={() => toggleVisibility("confirm_pass")}>
          <p className="eye">{showConfirmPassword ? "👁" : "👀️"}</p>
        </div>
        <div className="buttons">
            <button className="button" onClick={handleUploadUserSettings}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default Account;
