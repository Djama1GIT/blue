import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactHlsPlayer from 'react-hls-player';
import './App.css';

const HOST = 'http://localhost:5000/';
const STATIC_URL = `${HOST}static/`;
const MEDIA_URL = `${STATIC_URL}media/`;
const PREVIEWS_URL = `${MEDIA_URL}previews/`;
const AVATARS_URL = `${MEDIA_URL}avatars/`;

const NAME = 'blue';
const TITLE = `${NAME} — livestreaming service`

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
      {recommended ? (
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
      {top ? (
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

function Content() {
  const [mostPopular, setMostPopular] = useState(null);
  const [popularInCategories, setPopularInCategories] = useState(null);
  const [categories, setCategories] = useState(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const sliderContentRef = useRef(null);

  async function fetchMostPopular() {
    const response = await fetch(`${HOST}api/streams/most_popular/`);
    const data = await response.json();
    return data;
  }

  async function fetchPopularInCategories() {
    const response = await fetch(`${HOST}api/streams/popular_in_categories/`);
    const data = await response.json();
    return data;
  }

  async function fetchCategories() {
    const response = await fetch(`${HOST}api/streams/categories/`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const mostPopularData = await fetchMostPopular();
      const popularInCategoriesData = await fetchPopularInCategories();
      const categoriesData = await fetchCategories();
      setMostPopular(mostPopularData);
      setPopularInCategories(popularInCategoriesData);
      setCategories(categoriesData);
    };

    fetchData();
  }, []);

  const streamUnparser = ({ id, author, name, viewers, fake }) => (
    <div className="stream" key={id}>
      <Link to={!fake ? `/stream/${id}/` : `stream/fake/`}>
        <img src={`${PREVIEWS_URL}${id}.png`} className="streamImage" alt="" />
        {fake ? <p className="fake">FAKE</p> : null}
        <p className="viewers">Viewers:⠀{viewers}</p>
        <div className="about">
          <p className="name">{name}</p>
          <p className="author">{author}</p>
        </div>
      </Link>
    </div>
  );

  const handlePrevButtonClick = () => {
    sliderContentRef.current.scrollBy({
      left: -400,
      behavior: 'smooth',
    });
  };

  const handleNextButtonClick = () => {
    sliderContentRef.current.scrollBy({
      left: 400,
      behavior: 'smooth',
    });
  };

  return (
    <div className="content">
      <button className="prev-button" onClick={handlePrevButtonClick} ref={prevButtonRef}>
        ❮
      </button>
      <div className="most-popular">
        <p className="caption">Most popular streams</p>
        {mostPopular ? (
          <div className="streams" ref={sliderContentRef}>
            {mostPopular.map((streamItem) => streamUnparser(streamItem))}
          </div>
        ) : (
          <p>Most Popular list is unavailable</p>
        )}
      </div>
      <button className="next-button" onClick={handleNextButtonClick} ref={nextButtonRef}>
        ❱
      </button>
      {popularInCategories ? (
        <div className="streamsInCategories">
          {popularInCategories.map((category) => (
            <div className="category" key={category.category}>
              <p className="caption">
                Popular streams in the <span className="category">{category.category}</span> category
              </p>
              <div className="streams">
                {category.items.map((streamItem) => streamUnparser(streamItem))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Popular streams in categories are unavailable</p>
      )}
      {categories ? (
        <div className="categories">
          <p className="caption">
            <span>Categories</span> that may be of interest to you
          </p>
          {categories.map((category) => (
            <button key={category} href={`${HOST}${category}`}>
              {category}
            </button>
          ))}
        </div>
      ) : (
        <p>Categories list unavailable</p>
      )}
    </div>
  );
}

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

function Chat() {
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const connectToWebSocket = async () => {
      const socket = new WebSocket("ws://localhost:5555");

      socket.onopen = function (event) {
        console.log("Connected to WebSocket");
        setIsConnected(true);
      };

      socket.onmessage = function (event) {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      socket.onclose = function (event) {
        console.log("Disconnected from WebSocket");
        setIsConnected(false);
      };

      socketRef.current = socket;
    };

    connectToWebSocket();

    return () => {
      socketRef.current.close();
    };
  }, []);

  function sendMessage() {
    const message = document.getElementById("messageInput").value;
    socketRef.current.send(message);
  }

  return (
    <>
      <p className="caption">Stream Chat</p>
      <div className="chat" ref={chatRef}>
        <div className="messages">
          <p className="message">
            <small className="about rules">
              Chat rules:<br/>
              <span>1. Instead of making donations to the streamer, viewers should demand
              donations from the streamer for their entertainment.</span><br/>
              <span>2. Instead of subscribing to the channel, viewers should request
              that the streamer subscribe to their social media accounts.</span><br/>
              <span>3. Instead of sending positive and supportive messages in the chat,
              viewers should only send emoticons and meaningless phrases.</span><br/>
              <span>4. Instead of showing genuine excitement in exciting moments,
              viewers should remain completely unperturbed and uninterested.</span>
            </small>
          </p>
          {messages.map((message, index) => (
            <p className="message" key={index}>
              <span>
                <img src={`${AVATARS_URL}6.png`} alt="" />
              </span>
              <div className="about">
                <span className="author">Author</span>
                <span className="text">{message}</span>
              </div>
            </p>
          ))}
        </div>

        <div className="input">
          <input
            id="messageInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected}>Send</button>
        </div>
      </div>
    </>
  );
}



function Player() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlay, setIsPlay] = useState(true);
  const [volume, setVolume] = useState(1);
  const [video, setVideo] = useState(null);
  const playerRef = useRef();

  function playVideo() {
    playerRef.current.play();
  }

  function pauseVideo() {
    playerRef.current.pause();
  }

  function togglePlay(video) {
    if (video.readyState === 4 || playerRef.current.readyState === 4) {
      if ((isPlay && video.paused === undefined) || video.paused === true) {
        playVideo();
        setIsPlay(false);
      } else {
        pauseVideo();
        setIsPlay(true);
      }
    }
  }

  function toggleMute() {
    if (isMuted) {
      playerRef.current.volume = volume;
    } else {
      setVolume(playerRef.current.volume);
      playerRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  }

  function toggleFullScreen(video) {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  }

  function toggleControls() {
    playerRef.current.controls = !playerRef.current.controls;
  }

  function handleVolumeChange(event) {
    const value = parseFloat(event.target.value);
    setVolume(value);
    playerRef.current.volume = value;
    setIsMuted(value === 0);
  }

  useEffect(() => {
    setVideo(document.getElementById('video-player-container'));
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        togglePlay(document.getElementById('video'));
      } else if (event.keyCode === 70) {
        toggleFullScreen(document.getElementById('video-player-container'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div id="video-player-container">
      <ReactHlsPlayer
        src="http://127.0.0.1:8080/hls/token.m3u8"
        poster={`${PREVIEWS_URL}6.png`}
        id="video"
        playerRef={playerRef}
        onClick={togglePlay}
        width="1300"
        preload="auto"
        muted={isMuted}
        autoPlay="true"
      />
      <div id="video-controls">
        <button id="play" onClick={togglePlay}>
          {isPlay ? "▶" : "II"}
        </button>
        <button id="mute" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔈"}
        </button>

        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleFullScreen} id="fullscreen">
          <div className="full">🢖🢔</div>
          <div className="full2">🢖🢔</div>
          <div className="screen">⛶</div>
        </button>
      </div>
    </div>
  );
}

function Main() {
  document.title = TITLE;
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

function PageNotFound() {
  return (
    <div>
      404
      <h1 style={{ margin: 2 + 'em' }}>404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  document.title = TITLE;
  return (
    <Router>
      <div className="app">
        <Head />
        <Routes>
          <Route path="/stream/:id" element={<Stream />} />
          <Route path="/" element={<Main />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;