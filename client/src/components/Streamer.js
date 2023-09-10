import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';

import { HOST, AVATARS_URL, PREVIEWS_URL } from '../Consts'

import Player from './Player';
import Chat from './Chat'

function Streamer({ session, setSession, user, setUser, fetchUser }) {
  // TODO
  const { id } = useParams();
  const [streamerData, setStreamerData] = useState(null);

  async function fetchStreamerData(id) {
    const response = await fetch(`${HOST}api/users/user/${id}/`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStreamerData(id);
      setStreamerData(data);
    };

    fetchData();
  }, [id]);

  if (!streamerData) {
    return <div className="streamer-container">Loading...</div>;
  }
  document.title = streamerData.name;

  return (
    <div className="streamer-container">
      <div className="streamer-content">
        <div className="stream-content">
          {streamerData && <div className="stream" key={streamerData.stream.id}>
            <Link to={!streamerData.fake ? `/stream/${streamerData.stream.id}/` : `stream/fake/`}>
              <img src={`${PREVIEWS_URL}${streamerData.id}.png`} className="streamImage" alt=""/>
              {streamerData.stream.fake ? <p className="fake">FAKE</p> : <p/>}
                  <br/>
                  <div className="about">
                    <p className="name">{streamerData.stream.name}</p>
                    <p className="author">{streamerData.name}</p>
                  </div>
            </Link>
          </div>}
        </div>
        <div className="avatar-content">
            <img className="avatar" src={`${AVATARS_URL}${streamerData.id}.png`}/>
        </div>
      </div>
    </div>
  );
}

export default Streamer;