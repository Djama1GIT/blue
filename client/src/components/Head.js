import { Link } from 'react-router-dom';

import { NAME } from '../Consts'

function Head() {
  return (
    <div className="head">
      <Link className="logo" to="/">
        {NAME}
      </Link>
      <div className="search">
        <input type="text" placeholder="Search" />
        <button type="submit">🔍</button>
      </div>
      <div className="account">
        <span>👤</span>
      </div>
    </div>
  );
}

export default Head;