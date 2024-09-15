import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Preview.css";

function Preview(props) {
  const [movie, setMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`/movies/${props.id}`).then((res) => setMovie(res.data));
  }, [props.id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className="view-btn" onClick={openModal}>
        View
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-icon" onClick={closeModal}>
              &times;
            </span>

            {/* Movie Details Inside Modal */}
            <div
              className="movie-cover"
              style={{ backgroundImage: `url(${movie.cover_path})` }}
            >
              <div className="overlay">
                <div className="movie-header">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-details">
                    <h1>{movie.title}</h1>
                    <div className="movie-meta">
                      <span className="movie-language">{movie.language}</span>
                      <span className="movie-genres">
                        {movie.main_genre} | {movie.sub_genres.join(" | ")}
                      </span>
                      <span className="movie-release-date">
                        {new Date(movie.released_date).toLocaleDateString()}
                      </span>
                      <span className="movie-runtime">{movie.runtime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="movie-synopsis">
              <h2>Summary</h2>
              <p>{movie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
