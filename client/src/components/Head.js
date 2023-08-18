import { Link } from 'react-router-dom';
import { NAME } from '../Consts';

function Head() {
  const hasCookieSession = document.cookie.includes('session');

  return (
    <div className="head">
      <Link className="logo" to="/">
        {NAME}
      </Link>
      <div className="search">
        <input type="text" placeholder="Search" />
        <button type="submit">🔍</button>
      </div>
      {!hasCookieSession && (
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
