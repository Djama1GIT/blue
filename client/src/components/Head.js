import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAME, HOST } from '../Consts';
import { getCookie, deleteCookie } from '../Utils';
import axios from 'axios';

function Head({ session, setSession, user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const accountSelectRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountSelectRef.current && !accountSelectRef.current.contains(event.target)) {
        accountSelectRef.current.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    if (accountSelectRef.current) {
      accountSelectRef.current.style.display = 'block';
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${HOST}api/users/logout/`, {}, { withCredentials: true });
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="head">
      <Link className="logo" to="/">
        {NAME}
      </Link>
      <div className="search">
        <input type="text" placeholder="Search" />
        <button type="submit">🔍</button>
      </div>
      {user ? (
        <>
          <div className="account authorized">
            <span>{user.name}</span>
          </div>
          <div className="user" onClick={handleUserClick}>
            <div className="account-select" ref={accountSelectRef}>
              <p>
                <Link to="/account/">Settings</Link>
              </p>
              <p>
                <Link to="/subscriptions/">My subscriptions</Link>
              </p>
              <p>
                <Link onClick={handleLogout}>Logout</Link>
              </p>
            </div>
          </div>
        </>
      ) : (
        <Link to="/login/">
          <div className="account">
            <span>👤</span>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Head;
