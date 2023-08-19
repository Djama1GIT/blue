import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { HOST, AVATARS_URL } from '../Consts'

function Sidebar() {
  const [recommended, setRecommended] = useState(null);
  const [top, setTop] = useState(null);

  async function fetchRecommended() {
    const response = await fetch(`${HOST}api/recommended/`);
    const data = await response.json();
    return data;
  }

  async function fetchTop() {
    const response = await fetch(`${HOST}api/top/`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const recommendedData = await fetchRecommended();
      const topData = await fetchTop();
      setRecommended(recommendedData);
      setTop(topData);
    };

    fetchData();
  }, []);

  return (
    <div className="sidebar">
      {recommended && recommended[0] ? (
        <div className="recommended">
          <table>
            <caption>Recommended</caption>
            {recommended.map((recommendItem) => (
              <tr key={recommendItem.id}>
                <Link to={!recommendItem.fake ? `/stream/${recommendItem.id}/` : `stream/fake/`}>
                  <th>
                    <img className="avatar" src={`${AVATARS_URL}${recommendItem.id}.png`} alt="" />
                    <div className="name">
                      {recommendItem.author} - {recommendItem.name}
                    </div>
                  </th>
                </Link>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div className="recommended">Recommended list unavailable.</div>
      )}
      {top && top[0] ? (
        <div className="top">
          <table>
            <caption>Top Streamers</caption>
            {top.map((streamerItem, index) => (
              <tr key={streamerItem.id}>
                <Link to={!streamerItem.fake ? `/streamer/${streamerItem.id}/` : `stream/fake/`}>
                  <th>
                    <img className="avatar" src={`${AVATARS_URL}${streamerItem.id}.png`} alt="" />
                    <div className="name">
                      {index + 1}. {streamerItem.author}
                    </div>
                  </th>
                </Link>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div className="top">Top list unavailable.</div>
      )}
    </div>
  );
}

export default Sidebar;