import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Search() {
  const [movies, setmovies] = useState([]);
  const searchHandler = async (e) => {
    const q = e.target.value;

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const { data } = await axios.get(
      "/api/search",
      { params: { q: q } },
      config
    );
    setmovies(data);
  };
  return (
    <>
      <input
        className="form-control mr-sm-2"
        type="text"
        name="q"
        autoComplete="off"
        onKeyUp={searchHandler}
        id="searchinp"
        placeholder="Search"
        aria-label="Search"
      />
      <div style={{ position: "relative" }}>
        <ul
          id="searchresults"
          className="list-group"
          style={{ position: "absolute", zIndex: 1000 }}
        >
          {movies.map((movie) => (
            <Link to={`/movies/${movie.slug}`}>
              <li class="list-group-item">
                <img
                  src={movie.image}
                  alt={movie.name}
                  width="50"
                  height="60"
                  className="img-fluid img-thumbnail"
                />
                {movie.name} ({movie.year})
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Search;
