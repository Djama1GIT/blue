import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const HOST = 'http://localhost:8080/';
const STATIC_URL = `${HOST}static/`;
const MEDIA_URL = `${STATIC_URL}media/`;
const PREVIEWS_URL = `${MEDIA_URL}previews/`;

function Head() {
  return (
    <div className="head">
      <Link className="logo" to="/">
        blue
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

function Sidebar({ recommended, top }) {
  return (
    <div className="sidebar">
      {recommended ? (
        <div className="recommended">
          <table>
            <caption>Recommended</caption>
            {recommended.map((recommendItem) => (
              <tr>
                <th>
                  <div className="avatar"></div>
                  <div className="name">
                    {recommendItem.author} - {recommendItem.name}
                  </div>
                </th>
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
              <tr>
                <th>
                  <div className="avatar"></div>
                  <div className="name">
                    {index + 1}. {streamerItem.author}
                  </div>
                </th>
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

function Content({ mostPopular, popularInCategories, categories }) {
  const prevButtonRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);
  const sliderContentRef = React.useRef(null);

  const streamUnparser = ({ id, author, name }) => (
    <div className="stream">
      <Link to={`/stream/${id}`}>
        <img src={`${PREVIEWS_URL}${id}.png`} className="streamImage" alt=""/>
        <p className="name">{name}</p>
        <p className="author">{author}</p>
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
      <button class="prev-button" onClick={handlePrevButtonClick} ref={prevButtonRef}>
        ❮
      </button>
      <div className="most-popular">
        {mostPopular ? (
          <div className="streams" ref={sliderContentRef}>
            {mostPopular.map((streamItem) => (
              streamUnparser(streamItem)
            ))}
          </div>
        ) : (
          <p>Most Popular list is unavailable</p>
        )}
      </div>
      <button class="next-button" onClick={handleNextButtonClick} ref={nextButtonRef}>
        ❱
      </button>
      {popularInCategories ? (
        <div className="streamsInCategories">
          {popularInCategories.map((category) => (
            <div className="category">
              <h2>{category.category}</h2>
              <div className="streams">
                {category.items.map((streamItem) => (
                  streamUnparser(streamItem)
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Popular streams in categories are unavailable</p>
      )}
      {categories ? (
        <div className="categories">
        <h3>Категории:</h3>
        {categories.map((category) => (
        <button href={`${HOST}${category}`}>{category}</button>
        ))}
        </div>
        ) : (<p>Categories list unavailable</p>)}
    </div>
  );
}

function Stream({ match }) {
  const [streamData, setStreamData] = useState(null);

  try {
      useEffect(() => {
        const fetchStreamData = async () => {
          const response = await fetch(`${HOST}stream/${match.params.id}`);
          const data = await response.json();
          setStreamData(data);
        };
        fetchStreamData();
      }, [match.params.id]);
  } catch (error) {
      console.error(error);
  };

  if (!streamData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stream-container">
      <div className="stream-header">
        <h1>{streamData.name}</h1>
        <p>{streamData.author}</p>
      </div>
      <div className="stream-body">
        <video src={`${MEDIA_URL}${match.params.id}.mp4`} controls autoPlay />
      </div>
    </div>
  );
}

function Main() {
  const [recommended, setRecommended] = useState(null);
  const [top, setTop] = useState(null);
  const [mostPopular, setMostPopular] = useState(null);
  const [popularInCategories, setPopularInCategories] = useState(null);
  const [categories, setCategories] = useState(null);

  const fetchRecommended = async () => {
    const response = await fetch(`${HOST}api/recommended/`);
    const data = await response.json();
    setRecommended(data);
  };

  const fetchTop = async () => {
    const response = await fetch(`${HOST}api/top/`);
    const data = await response.json();
    setTop(data);
  };

  const fetchMostPopular = async () => {
    const response = await fetch(`${HOST}api/streams/most_popular/`);
    const data = await response.json();
    setMostPopular(data);
  };

  const fetchPopularInCategories = async () => {
    const response = await fetch(`${HOST}api/streams/popular_in_categories/`);
    const data = await response.json();
    setPopularInCategories(data);
  };

  const fetchCategories = async () => {
    const response = await fetch(`${HOST}api/streams/categories/`);
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchRecommended();
    fetchTop();
    fetchMostPopular();
    fetchPopularInCategories();
    fetchCategories();
  }, []);

  return (
      <div>
        <Sidebar recommended={recommended} top={top} />
        <Content
          mostPopular={mostPopular}
          popularInCategories={popularInCategories}
          categories={categories}
        />
      </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Head />
        <Routes>
          <Route path="/stream/:id" element={<Stream />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;