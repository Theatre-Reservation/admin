import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Movies.css";

function MoviePage() {
  const [Movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    language: "",
    description: "",
    main_genre: "",
    runtime: "",
    schedules: [{ date: "", time: "" }],
  });
  const [editMode, setEditMode] = useState(false);

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
      schedules: [
        ...newMovie.schedules,
        { date: "", time: "", theater_id: "" },
      ],
    });
  };

  const handleAddMovie = async () => {
    try {
      const response = await axios.post("/movies", newMovie);
      setMovies([...Movies, response.data]);
      setNewMovie({
        title: "",
        language: "",
        description: "",
        main_genre: "",
        runtime: "",
        schedules: [{ date: "", time: "" }],
      });
      setIsModalOpen(false); // Close modal after adding movie
    } catch (error) {
      console.error("Error adding Movie:", error);
    }
  };

  const handleEditMovie = (_id) => {
    axios
      .put(`movies/${_id}`)
      .then((Movie) => {
        setNewMovie({
          admin_id: Movie.admin_id,
          title: Movie.title,
          img_url: Movie.img_url,
          description: Movie.description,
          genre: Movie.genre,
          duration: Movie.duration,
          schedules: Movie.schedules,
        });
        setEditMode(true);
        setIsModalOpen(true); // Open modal in edit mode
      })
      .catch((error) => console.error("Error updating Movie:", error));
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
            <th>Language</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
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
              <td className="edit-delete-btns">
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

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        Add Movie
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? "Edit Movie" : "Add New Movie"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMovie();
              }}
            >
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={newMovie.title}
                  onChange={handleInputChange}
                  placeholder="Movie Title"
                />
              </label>
              <label>
                Image URL
                <input
                  type="text"
                  name="img_url"
                  value={newMovie.img_url}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={newMovie.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </label>
              <label>
                Genre
                <input
                  type="text"
                  name="genre"
                  value={newMovie.genre}
                  onChange={handleInputChange}
                  placeholder="Genre"
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  type="number"
                  name="duration"
                  value={newMovie.duration}
                  onChange={handleInputChange}
                  placeholder="Duration"
                />
              </label>

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
                </div>
              ))}
              <button type="button" onClick={handleAddSchedule}>
                Add Another Schedule
              </button>
              <button type="submit">
                {editMode ? "Update Movie" : "Add Movie"}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePage;
