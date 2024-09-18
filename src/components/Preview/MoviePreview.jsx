import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Preview.css";

function MoviePreview(props) {
  const [movie, setMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`/movies/${props.id}`).then((res) => setMovie(res.data));
  }, [props.id, isModalOpen]);

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
            <div className="modal-header">
              <h1>{movie.title}</h1>
              <span className="close-icon" onClick={closeModal}>
                &times;
              </span>
            </div>
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
                </div>
                <div className="movie-rating">{movie.rating}</div>
              </div>
            </div>
            <div className="movie-details">
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
              {/* Stars */}
              <div className="movie-stars">
                {Array.from({ length: 4 }, (_, index) => (
                  <span key={index} className="star-icon">
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <div className="movie-synopsis">
              <h3>Summary</h3>
              <p>{movie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePreview;
