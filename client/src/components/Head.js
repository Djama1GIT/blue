import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAME, HOST } from '../Consts';
import { getCookie, deleteCookie } from '../Utils';
import axios from 'axios';

function Head() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const accountSelectRef = useRef(null);

  useEffect(() => {
    const sess = getCookie('session');
    const fetchData = async () => {
      if (sess !== session && sess !== '') {
        const response = await axios.post(`${HOST}api/users/auth/`, {}, { withCredentials: true });
        if (!response.data.user) {
          setSession('');
          deleteCookie('session');
        }
        setUser(response.data.user);
      }
    };
    fetchData();
    setSession(sess);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountSelectRef.current && !accountSelectRef.current.contains(event.target)) {
        // Clicked outside of div.account-select, hide it
        accountSelectRef.current.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    // Clicked on div.user, show div.account-select
    if (accountSelectRef.current) {
      accountSelectRef.current.style.display = 'block';
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${HOST}api/users/logout/`, {}, { withCredentials: true });
      setUser(null);
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
                <Link to="/account/">My account</Link>
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
        <div className="account">
          <Link to="/login/">
            <span>👤</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Head;
