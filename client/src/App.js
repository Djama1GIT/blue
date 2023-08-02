import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

const HOST = 'http://localhost:8080/';
const STATIC_URL = `${HOST}static/`;
const MEDIA_URL = `${STATIC_URL}media/`;
const PREVIEWS_URL = `${MEDIA_URL}previews/`;
const AVATARS_URL = `${MEDIA_URL}avatars/`;

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

function Sidebar() {
  const [recommended, setRecommended] = useState(null);
  const [top, setTop] = useState(null);

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


  useEffect(() => {
    fetchRecommended();
    fetchTop();
  }, []);

  return (
    <div className="sidebar">
      {recommended ? (
        <div className="recommended">
          <table>
            <caption>Recommended</caption>
            {recommended.map((recommendItem) => (
              <tr>
                <th>
                  <img className="avatar" src={`${AVATARS_URL}${recommendItem.id}.png`} alt="" />
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
                  <img className="avatar" src={`${AVATARS_URL}${streamerItem.id}.png`} alt="" />
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

function Content() {
  const [mostPopular, setMostPopular] = useState(null);
  const [popularInCategories, setPopularInCategories] = useState(null);
  const [categories, setCategories] = useState(null);
  const prevButtonRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);
  const sliderContentRef = React.useRef(null);


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

  const streamUnparser = ({ id, author, name, viewers, fake }) => (
    <div className="stream">
      <Link to={!fake ? `/stream/${id}/` : `stream/fake/`}>
        <img src={`${PREVIEWS_URL}${id}.png`} className="streamImage" alt="" />
        {fake ? (<p className="fake">FAKE</p>) : null}
        <p className="viewers">Viewers:⠀{viewers}</p>
        <div class="about">
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

  useEffect(() => {
    fetchMostPopular();
    fetchPopularInCategories();
    fetchCategories();
  }, []);

  return (
    <div className="content">
      <button class="prev-button" onClick={handlePrevButtonClick} ref={prevButtonRef}>
        ❮
      </button>
      <div className="most-popular">
        <p className="caption">Most popular streams</p>
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
              <p className="caption">Popular streams in the <span className="category">{category.category}</span> category</p>
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
        <p className="caption"><span>Categories</span> that may be of interest to you</p>
        {categories.map((category) => (
        <button href={`${HOST}${category}`}>{category}</button>
        ))}
        </div>
        ) : (<p>Categories list unavailable</p>)}
    </div>
  );
}

function Stream(props) {
  const { id } = useParams();
  const [streamData, setStreamData] = useState(null);
  const chatRef = React.useRef(null);

  try {
      useEffect(() => {
        const fetchStreamData = async () => {
          const response = await fetch(`${HOST}api/streams/stream/${id}/`);
          const data = await response.json();
          setStreamData(data);

          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        };
        fetchStreamData();
      }, [props.id]);
  } catch (error) {
      console.error(error);
  };

  if (!streamData) {
    return <div className="stream-container">Loading...</div>;
  }
  document.title = streamData.name;
  return (
    <div className="stream-container">
        <div className="stream-content">
          <div className="stream-body">
            <video src={`${MEDIA_URL}fake/${id}.mp4`} controls />
          </div>
          <div className="stream-data">
            <p className="about">
                <span className="name">{streamData.name}</span>
                <span className="viewers">Viewers: {streamData.viewers}</span>
            </p>
            <p className="author">
                <img src={`${AVATARS_URL}${streamData.id}.png`} alt="" />
                <span>{streamData.author}</span>
                <button className="follow">Follow</button>
            </p>
          </div>
        </div>
        <p className="caption">Stream Chat</p>
        <div className="chat" ref={chatRef}>
            <div className="messages">
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div className="about">
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                    </div>
                </p>
                <p className="message">
                    <span><img src={`${AVATARS_URL}${streamData.id}.png`} alt="" /></span>
                    <div>
                    <span className="author">GADJIIAVOV</span>
                    <span className="text">Lorem ipsum dolor sit amet</span>
                    </div>
                </p>
            </div>
        </div>
    </div>
  );
}

function Main() {
  document.title = "blue — livestreaming service";
  return (
      <div>
        <Sidebar />
        <Content />
      </div>
  )
}

function PageNotFound() {
    return (
        <div>404
            <h1 style={{margin: 2 + 'em'}}>
                404 - Page Not Found
            </h1>
        </div>
    )
}


function App() {
  document.title = '404 - Page not found';
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