import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [popularInCategories, setPopularInCategories] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [top, setTop] = useState([]);

  const HOST = 'http://localhost:8080/'
  const STATIC_URL = `${HOST}static/`
  const MEDIA_URL = `${STATIC_URL}media/`
  const PREVIEWS_URL = `${MEDIA_URL}previews/`

  const prevButtonRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);
  const sliderContentRef = React.useRef(null);


  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(`${HOST}api/recommended/`);
        const data = await response.json();
        setRecommended(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommended();
  }, []);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await fetch(`${HOST}api/top/`);
        const data = await response.json();
        setTop(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTop();
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${HOST}api/streams/categories/`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPopularInCategories = async () => {
      try {
        const response = await fetch(`${HOST}/api/streams/popular_in_categories/`);
        const data = await response.json();
        setPopularInCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPopularInCategories();
  }, []);

  useEffect(() => {
    const fetchMostPopular = async () => {
      try {
        const response = await fetch(`${HOST}/api/streams/most_popular/`);
        const data = await response.json();
        setMostPopular(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMostPopular();
  }, []);

  const streamUnparser = ({ id, author, name }) => (
    <div className="stream">
        <img src={`${PREVIEWS_URL}${id}.png`} className="streamImage"/>
        <p className="name">{name}</p>
        <p className="author">{author}</p>
    </div>
  );

  const handlePrevButtonClick = () => {
    sliderContentRef.current.scrollBy({
      left: -400,
      behavior: 'smooth'
    });
  };

  const handleNextButtonClick = () => {
    sliderContentRef.current.scrollBy({
      left: 400,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <div className="head">
        <a className="logo" href="/">
            blue
        </a>
        <div className="search">
            <input type="text" placeholder="Search"/>
            <button type="submit">🔍</button>
        </div>
        <div className="account">
            <span>
                👤
            </span>
        </div>
      </div>
      <div className="sidebar">
          {recommended ? (
          <div className="recommended">
            <table>
                <caption>Recommended</caption>
                {recommended.map((recommendItem) => (
                  <tr><th>
                    <div className="avatar"></div>
                    <div className="name">{recommendItem.author} - {recommendItem.name}</div>
                  </th></tr>
                ))}
            </table>
          </div>
          ) : ( <div className="recommended">Recommended list unavailable.</div>)}
          {top ? (
          <div className="top">
            <table>
                <caption>Top Streamers</caption>
                {top.map((streamerItem, index) => (
                    <tr><th>
                    <div className="avatar"></div><div className="name">{index + 1}. {streamerItem.author}</div>
                    </th></tr>
                ))}
            </table>
          </div>
          ) : (<div className="top">Top list unavailable.</div>)}
      </div>
      <div className="content">
          <button class="prev-button" onClick={handlePrevButtonClick} ref={prevButtonRef}>❮</button>
        <div className="most-popular">
            {mostPopular ? (
                <div className="streams" ref={sliderContentRef}>
                    {mostPopular.map((streamItem) => (
                        streamUnparser(streamItem)
                    ))}
                </div>
            ) : (<p>Most Popular list is unavailable</p>)}
        </div>
        <button class="next-button" onClick={handleNextButtonClick} ref={nextButtonRef}>❱</button>
        {popularInCategories ? (
            <div className="streamsInCategories">
                {popularInCategories.map((category) => (
                    <div className={category.category}>
                        <h3>Popular streams in the {category.category} category</h3>
                        <div className="streams">
                            {category.items.map((streamItem) => (
                                streamUnparser(streamItem)
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (<p>Popular list in unavailable</p>)}
        {categories ? (
          <div className="categories">
            <h3>Категории:</h3>
            {categories.map((category) => (
              <button href={`/api/streams/${category}`}>{category}</button>
            ))}
          </div>
          ) : (<p>Categories list unavailable</p>)}
      </div>
    </div>
  );
}

export default App;