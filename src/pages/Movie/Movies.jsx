import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Movies.css";

function MoviePage() {
  const [Movies, setMovies] = useState([]);
  const [MovieForm, setMovieForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    img_url: "",
    description: "",
    genre: "",
    duration: "",
    schedules: [{ date: "", time: "", theater_id: "" }],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);

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

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...newMovie.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setNewMovie({ ...newMovie, schedules: newSchedules });
  };

  const handleAddSchedule = () => {
    setNewMovie({
      ...newMovie,
      schedules: [...newMovie.schedules, { date: "", time: "", theater_id: "" }],
    });
  };

  const handleAddMovie = async () => {
    try {
      const response = await axios.post("/api/movies", newMovie);
      setMovies([...movies, response.data]);
      setNewMovie({
        title: "",
        img_url: "",
        description: "",
        genre: "",
        duration: "",
        date: "",
        time: "",
        theater_id: "",
      });
      setMovieForm(false);
    } catch (error) {
      console.error("Error adding Movie:", error);
    }
  };

  const handleEditMovie = (Movie) => {
    setNewMovie({
      title: Movie.title,
      img_url: Movie.img_url,
      description: Movie.description,
      genre: Movie.genre,
      duration: Movie.duration,
      schedules: Movie.schedules,
    });
    setEditMode(true);
    setEditingMovieId(Movie._id);
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
      <h1>Movies</h1>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Schedules</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Movies.map((Movie) => (
            <tr key={Movie._id}>
              <td>{Movie.title}</td>
              <td>{Movie.genre}</td>
              <td>{Movie.description}</td>
              <td>{Movie.duration} min</td>
              <td>
                {Movie.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>
                      {schedule.date} at {schedule.time} - Theater:{" "}
                      {schedule.theater_id}
                    </p>
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEditMovie(Movie)}>Edit</button>
                <button onClick={() => handleDeleteMovie(Movie._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-movie-form">
        <h2>{editMode ? "Edit Movie" : "Add New movie"}</h2>
        <input
          type="text"
          name="title"
          value={newMovie.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
        />
        <input
          type="text"
          name="img_url"
          value={newMovie.img_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <textarea
          name="description"
          value={newMovie.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="genre"
          value={newMovie.genre}
          onChange={handleInputChange}
          placeholder="Genre"
        />
        <input
          type="number"
          name="duration"
          value={newMovie.duration}
          onChange={handleInputChange}
          placeholder="Duration (minutes)"
        />

        {newMovie.schedules.map((schedule, index) => (
          <div key={index}>
            <input
              type="date"
              name="date"
              value={schedule.date}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="time"
              name="time"
              value={schedule.time}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            {/* <input
              type="text"
              name="theater_id"
              value={schedule.theater_id}
              onChange={(e) => handleScheduleChange(index, e)}
              placeholder="Theater ID"
            /> */}
          </div>
        ))}
        <button onClick={handleAddSchedule}>Add Another Schedule</button>
        <button onClick={handleAddMovie}>
          {editMode ? "Update Movie" : "Add Movie"}
        </button>
      </div>
    </div>
  );
}

export default MoviePage;
