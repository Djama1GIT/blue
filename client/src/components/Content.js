import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { HOST, PREVIEWS_URL } from '../Consts'

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
        {fake && <p className="fake">FAKE</p>}
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
  console.log(mostPopular);
  return (
    <div className="content">
      {mostPopular && mostPopular[0] && <button className="prev-button" onClick={handlePrevButtonClick} ref={prevButtonRef}>
        ❮
      </button>}
      <div className="most-popular">

        {mostPopular && mostPopular[0] ? (
          <>
          <p className="caption">Most popular streams</p>
          <div className="streams" ref={sliderContentRef}>
            {mostPopular.map((streamItem) => streamUnparser(streamItem))}
          </div>
          </>
        ) : (
          <p>Most Popular list is unavailable</p>
        )}
      </div>
      {mostPopular && mostPopular[0] && <button className="next-button" onClick={handleNextButtonClick} ref={nextButtonRef}>
        ❱
      </button>}
      {popularInCategories && popularInCategories[0] ? (
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
      {categories && categories[0] ? (
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

export default Content;