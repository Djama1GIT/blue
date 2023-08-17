import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { HOST, AVATARS_URL } from '../Consts'

import Player from './Player';
import Chat from './Chat'

function Stream(props) {
  const { id } = useParams();
  const [streamData, setStreamData] = useState(null);

  async function fetchStreamData(id) {
    const response = await fetch(`${HOST}api/streams/stream/${id}/`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStreamData(id);
      setStreamData(data);
    };

    fetchData();
  }, [id]);

  if (!streamData) {
    return <div className="stream-container">Loading...</div>;
  }
  document.title = streamData.name;

  return (
    <div className="stream-container">
      <div className="stream-content">
        <div className="stream-body">
          <Player />
        </div>
        <div className="stream-data">
          <p className="about">
            <span className="name">{streamData.name}</span>
            <span className="viewers">Viewers: {streamData.viewers}</span>
          </p>
          <p className="author">
            <img src={`${AVATARS_URL}${streamData.id}.png`} alt="" />
            <span>{streamData.author}</span>
            <button className="subscribe">Subscribe</button>
          </p>
        </div>
      </div>
      <Chat />
    </div>
  );
}

export default Stream;