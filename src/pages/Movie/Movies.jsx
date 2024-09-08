import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Movies.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    schedules: [{ date: "", time: "", price: "" }],
  });
  const [movieId, setMovieId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const admin_id = "64e1f26b2a91d130d5a14e3f";

  const [imageFile, setImageFile] = useState({
    posterImage: null,
    coverImage: null,
  });

  useEffect(() => {
    // Fetch Movies from the backend API
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
      // handleUpload();
    }
  };

  const handleAddMovie_ = () => {
    let poster_path = "";
    let cover_path = "";
    setUploading(true);

    if (imageFile.coverImage && imageFile.posterImage) {
      const storageRef = ref(storage, `images/${imageFile.posterImage.name}`);
      uploadBytes(storageRef, imageFile.posterImage)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            poster_path = url;
            // setNewMovie({ ...newMovie, poster_path: url });
            console.log("Poster Image File available at", url);

            // upload the cover image
            const storageRef = ref(
              storage,
              `images/${imageFile.coverImage.name}`
            );

            uploadBytes(storageRef, imageFile.coverImage) // Upload the file
              .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  cover_path = url;
                  setNewMovie({
                    ...newMovie,
                    poster_path: poster_path,
                    cover_path: cover_path,
                  });
                  console.log("Cover Image File available at", url);

                  const url_ = editMode ? `movies/${movieId}` : "movies";
                  const method = editMode ? "put" : "post";
                  console.log(newMovie);

                  axios({
                    method: method,
                    url: url_,
                    data: {
                      newMovie,
                      cover_path,
                      poster_path,
                      admin_id: admin_id,
                    },
                  })
                    .then((response) => {
                      console.log(
                        `${editMode ? "Updated" : "Added"} movie successfully!`
                      );
                      console.log(response.data);
                      setEditMode(false);
                      setIsModalOpen(false); // Close modal after successful operation
                      setUploading(false);
                    })
                    .catch((error) => {
                      console.error("Error saving movie:", error);
                      setUploading(false);
                    });
                });
              });
          });
        })
        .catch((error) => {
          console.error("Error uploading file: ", error);
        });
    }
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...newMovie.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setNewMovie({ ...newMovie, schedules: newSchedules });
  };

  const handleAddSchedule = () => {
    setNewMovie({
      ...newMovie,
      schedules: [...newMovie.schedules, { date: "", time: "", price: "" }],
    });
  };

  // const handleAddMovie = () => {
  //   const url = editMode ? `movies/${movieId}` : "movies";
  //   const method = editMode ? "put" : "post";

  //   axios({
  //     method: method,
  //     url: url,
  //     data: newMovie,
  //   })
  //     .then((response) => {
  //       console.log(`${editMode ? "Updated" : "Added"} movie successfully!`);
  //       console.log(response.data);
  //       setEditMode(false);
  //       setIsModalOpen(false); // Close modal after successful operation
  //     })
  //     .catch((error) => console.error("Error saving movie:", error));
  // };

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
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Movies.map((Movie) => (
            <tr key={Movie._id}>
              <td>{Movie.title}</td>
              <td>{Movie.language}</td>
              <td>{Movie.main_genre}</td>
              <td>{Movie.runtime}</td>
              <td>
                {Movie.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>{schedule.date}</p>
                  </div>
                ))}
              </td>
              <td>
                {Movie.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>{schedule.time}</p>
                  </div>
                ))}
              </td>
              <td>
                {Movie.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>{schedule.price}</p>
                  </div>
                ))}
              </td>
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
                onClick={() => setIsModalOpen(false)}
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
                    <textarea
                      name="description"
                      value={newMovie.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="description"
                      rows={6}
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
                    Image URL
                    <input
                      type="file"
                      name="poster_path"
                      // value={newMovie.poster_path}
                      onChange={(e) => handleFileChange(e, "posterImage")}
                      placeholder="Image URL"
                    />
                  </label>
                  {/* <label>
                    <input
                      type="text"
                      name="poster_path"
                      value={newMovie.poster_path}
                      onChange={handleInputChange}
                      placeholder="Image URL"
                    />
                  </label> */}
                  <label>
                    Cover URL
                    <input
                      type="file"
                      name="cover_path"
                      // value={newMovie.cover_path}
                      onChange={(e) => handleFileChange(e, "coverImage")}
                      placeholder="Cover URL"
                    />
                  </label>
                  {/* <label>
                    <input
                      type="text"
                      name="cover_path"
                      value={newMovie.cover_path}
                      onChange={handleInputChange}
                      placeholder="Cover URL"
                    />
                  </label> */}
                </div>
                <div className="column">
                  <label>
                    Released Date
                    <input
                      type="date"
                      name="released_date"
                      value={newMovie.released_date}
                      onChange={handleInputChange}
                      placeholder="Released Date"
                    />
                  </label>
                  <label>
                    Run Time (minutes)
                    <input
                      type="number"
                      name="runtime"
                      value={newMovie.runtime}
                      onChange={handleInputChange}
                      placeholder="Run Time"
                    />
                  </label>

                  <div className="scroll-schedules">
                    {newMovie.schedules.map((schedule, index) => (
                      <div key={index}>
                        <label>
                          Date
                          <input
                            type="date"
                            name="date"
                            value={schedule.date}
                            onChange={(e) => handleScheduleChange(index, e)}
                          />
                        </label>
                        <label>
                          Time
                          <input
                            type="time"
                            name="time"
                            value={schedule.time}
                            onChange={(e) => handleScheduleChange(index, e)}
                          />
                        </label>
                        <label>
                          Price
                          <input
                            type="number"
                            name="price"
                            value={schedule.price}
                            onChange={(e) => handleScheduleChange(index, e)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleAddSchedule}>
                    Add Another Schedule
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="form-submit"
                onClick={handleAddMovie_}
              >
                {}

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
