import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAME, HOST } from '../Consts';
import { getCookie } from '../Utils';
import axios from 'axios';

function Head() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const sess = getCookie('session');
    const fetchData = async () => {
      if (sess !== session && sess !== '') {
        const response = await axios.post(`${HOST}api/users/auth/`, {}, { withCredentials: true });
        setUser(response.data.user);
      }
    };
    fetchData();
    setSession(sess);
    sess ? setUser('JohnDoe') : setUser('');
  }, [location.pathname]);

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
        <div className="account authorized">
          <span>{user.name}</span>
        </div>
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
