

  const handleUpdateShow = async (id) => {
    try {
      const response = await axios.put(`/api/shows/${id}`, newShow);
      setShows(shows.map((show) => (show.id === id ? response.data : show)));
      setShowForm(false);
    } catch (error) {
      console.error("Error updating show:", error);
    }
  };

  return (
    <div className="shows-page">
      <header>
        <h1>Shows Management</h1>
        <button onClick={() => setShowForm(true)}>Add New Show</button>
      </header>

      <div className="shows-list">
        {shows.map((show) => (
          <div key={show.id} className="show-item">
            <img src={show.img_url} alt={show.title} />
            <h3>{show.title}</h3>
            <p>{show.description}</p>
            <button onClick={() => handleUpdateShow(show.id)}>Edit</button>
            <button onClick={() => handleDeleteShow(show.id)}>Delete</button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="show-form">
          <input
            type="text"
            name="title"
            value={newShow.title}
            onChange={handleInputChange}
            placeholder="Show Title"
          />
          <input
            type="text"
            name="img_url"
            value={newShow.img_url}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
          <textarea
            name="description"
            value={newShow.description}
            onChange={handleInputChange}
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            name="genre"
            value={newShow.genre}
            onChange={handleInputChange}
            placeholder="Genre"
          />
          <input
            type="number"
            name="duration"
            value={newShow.duration}
            onChange={handleInputChange}
            placeholder="Duration (mins)"
          />
          <input
            type="date"
            name="date"
            value={newShow.date}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="time"
            value={newShow.time}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="theater_id"
            value={newShow.theater_id}
            onChange={handleInputChange}
            placeholder="Theater ID"
          />
          <button onClick={handleAddShow}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ShowsPage;
