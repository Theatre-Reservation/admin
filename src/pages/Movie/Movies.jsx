import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Movies.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ShowPage from "../Show/Show";
import MoviePreview from "../../components/Preview/MoviePreview";
import { useNavigate } from "react-router-dom";

function MoviePage() {
  const [uploading, setUploading] = useState(false);
  const [Movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    admin_id: "",
    title: "",
    language: "",
    description: "",
    main_genre: "",
    sub_genres: [],
    poster_path: "",
    cover_path: "",
    released_date: "",
    runtime: "",
    schedules: [{ date: "", time: "", price: "", seats: [[]] }],
  });
  const [movieId, setMovieId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const admin_id = "64e1f26b2a91d130d5a14e3f";

  const [imageFile, setImageFile] = useState({
    posterImage: null,
    coverImage: null,
  });

  const navigate = useNavigate();

  // Fetch Movies from the backend API
  useEffect(() => {
    axios
      .get("Movies")
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error fetching Movies:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleFileChange = (event, name) => {
    if (event.target.files[0]) {
      setImageFile({ ...imageFile, [name]: event.target.files[0] });
    }
  };

  const handleAddMovie_ = async (e) => {
    e.preventDefault();
    setUploading(true);
    let poster_path = newMovie.poster_path,
      cover_path = newMovie.cover_path;
    try {
      if (imageFile.posterImage) {
        const posterSnapshot = await uploadBytes(
          ref(storage, `images/${imageFile.posterImage.name}`),
          imageFile.posterImage
        );
        poster_path = await getDownloadURL(posterSnapshot.ref);
        console.log("Poster path:", poster_path);
      }

      if (imageFile.coverImage) {
        const coverSnapshot = await uploadBytes(
          ref(storage, `images/${imageFile.coverImage.name}`),
          imageFile.coverImage
        );
        cover_path = await getDownloadURL(coverSnapshot.ref);
        console.log("Cover path:", cover_path);
      }

      const movieData = {
        ...newMovie,
        poster_path,
        cover_path,
        admin_id,
      };

      const url_ = editMode ? `movies/${movieId}` : "movies";
      const method = editMode ? "put" : "post";

      const response = await axios({
        method,
        url: url_,
        data: movieData,
      });

      console.log(
        `${editMode ? "Updated" : "Added"} movie successfully!`,
        response.data
      );
      setIsModalOpen(false);
      setEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error saving movie:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditMovie = (_id) => {
    axios
      .get(`movies/${_id}`) // Use GET request to fetch movie data
      .then((response) => {
        console.log("Movie details:", response.data);
        const movie = response.data; // Assume movie data is in response.data
        setMovieId(_id);
        setNewMovie({
          admin_id: admin_id,
          title: movie.title,
          language: movie.language,
          description: movie.description,
          main_genre: movie.main_genre,
          sub_genres: movie.sub_genres,
          poster_path: movie.poster_path,
          cover_path: movie.cover_path,
          released_date: movie.released_date,
          runtime: movie.runtime,
          schedules: movie.schedules,
        });
        setEditMode(true);
        setIsModalOpen(true); // Open modal in edit mode
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  };

  const handleDeleteMovie = (id) => {
    axios
      .delete(`movies/${id}`)
      .then(() => {
        setMovies(Movies.filter((Movie) => Movie._id !== id));
      })
      .catch((error) => console.error("Error deleting Movie:", error));
  };

  const resetForm = () => {
    setNewMovie({
      admin_id: "",
      title: "",
      language: "",
      description: "",
      main_genre: "",
      sub_genres: [],
      poster_path: "",
      cover_path: "",
      released_date: "",
      runtime: "",
      schedules: [{ date: "", time: "", price: "" }],
    });
    setImageFile({
      posterImage: null,
      coverImage: null,
    });
  };

  return (
    <div className="movies-page">
      <div className="movie-title-bar">
        <h1>Movies</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Movie
        </button>
      </div>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Language</th>
            <th>Genre</th>
            <th>Run Time</th>
            <th>Released Date</th>
            {/* <th>Time</th>
            <th>Price</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Movies.map((Movie) => (
            <tr key={Movie._id}>
              <td
                onClick={() =>
                  navigate(
                    `/movies/shows`
                    // `/moviepage/showpage/seatpage/${Movie._id}`
                  )
                }
              >
                {Movie.title}
              </td>
              <td>{Movie.language}</td>
              <td>{Movie.main_genre}</td>
              <td>{Movie.runtime}</td>
              <td>{Movie.released_date.split("T")[0]}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditMovie(Movie._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteMovie(Movie._id)}
                >
                  Delete
                </button>
                <MoviePreview id={Movie._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMode ? "Edit Movie" : "Add New Movie"}</h2>
              {/* Close icon */}
              <span
                className="close-icon"
                onClick={() => {
                  setIsModalOpen(false), resetForm();
                }}
              >
                &times;
              </span>
            </div>
            <form>
              <div className="form-content">
                <div className="column">
                  <label>
                    <input
                      type="text"
                      name="title"
                      value={newMovie.title}
                      onChange={handleInputChange}
                      placeholder="Movie Title"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="language"
                      value={newMovie.language}
                      onChange={handleInputChange}
                      placeholder="Movie Language"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="main_genre"
                      value={newMovie.main_genre}
                      onChange={handleInputChange}
                      placeholder="Main genre"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="sub_genres"
                      value={newMovie.sub_genres}
                      onChange={handleInputChange}
                      placeholder="Sub Genre"
                    />
                  </label>
                  <label>
                    Poster Image
                    {/* Display the current poster image */}
                    {newMovie.poster_path && (
                      <div>
                        <img
                          src={newMovie.poster_path}
                          alt="Poster"
                          style={{ width: "30px", height: "50px" }}
                        />
                      </div>
                    )}
                    {/* Input field to upload a new poster */}
                    <input
                      type="file"
                      name="poster_path"
                      onChange={(e) => handleFileChange(e, "posterImage")}
                      accept="image/*"
                    />
                  </label>

                  <label>
                    Cover Image
                    {/* Display the current cover image */}
                    {newMovie.cover_path && (
                      <div>
                        <img
                          src={newMovie.cover_path}
                          alt="Cover"
                          style={{ width: "30px", height: "50px" }}
                        />
                      </div>
                    )}
                    {/* Input field to upload a new cover image */}
                    <input
                      type="file"
                      name="cover_path"
                      onChange={(e) => handleFileChange(e, "coverImage")}
                      accept="image/*" // Restrict to image files only
                    />
                  </label>
                </div>
                <div className="column">
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={newMovie.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="description"
                      rows={12}
                    />
                  </label>
                  <label>
                    Released Date
                    <input
                      type="date"
                      name="released_date"
                      value={newMovie.released_date.split("T")[0]}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Runtime
                    <input
                      type="text"
                      name="runtime"
                      value={newMovie.runtime}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hrs 10 mins"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="form-submit"
                onClick={handleAddMovie_}
              >
                {uploading
                  ? "Uploading..."
                  : editMode
                  ? "Update Movie"
                  : "Add Movie"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePage;
