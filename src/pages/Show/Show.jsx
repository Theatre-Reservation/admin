import React, { useState, useEffect, useContext } from "react";
import "./Show.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner/spinner";
import "react-toastify/dist/ReactToastify.css";

function ShowsPage() {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [shows, setShows] = useState([]);
  const [editingShow, setEditingShow] = useState(null);
  const [editingMode, setEditingMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShow, setNewShow] = useState({
    movie: "",
    theater: "",
    date: "",
    time: "",
    price: "",
    reserved_seats: ["A5", "C7", "F2"],
    available_seats: "80",
    discountPercentage: "",
    discountAmount: "",
    discountExpiry: "",
  });
  const [discount, setDiscount] = useState({
    percentage: "",
    amount: "",
    expiry: "",
  });
  const navigate = useNavigate();

  // const movie = "Deadpool & Wolverine";

  // Fetch show data from an API
  useEffect(() => {
    const fetchShows = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token"); // Get token from localStorage
          const theater = parseTheaterFromToken(token); // Extract theater from token
          console.log("Theater: ", theater);
          setNewShow({ ...newShow, theater: theater });
          // http://localhost:8000/api/v1/shows/show?theater=Majestic City - Colombo&movie=Deadpool & Wolverine
          const response = await axios.get(
            `/shows/show?theater=${theater}&movie=`
          );
          // console.log("response", `/shows/show?theater=${user}&movie=${movie}`);
          setShows(response.data);
          // console.log("Shows fetched:", response.data);
          // console.log("Shows:", shows);
        } catch (error) {
          // console.error("Error fetching shows:", error);
          toast.error("Error fetching shows", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    };
    fetchShows();
  }, [user]);
  console.log("shows", newShow);

  // console.log(shows);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "discountAmount") {
      if (value < 0) {
        toast.error(`${name} cannot be negative`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    } else if (name === "discountPercentage") {
      if (value < 0 || value > 100) {
        toast.error("Discount percentage must be between 0 and 100", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    } else if (name === "discountExpiry") {
      if (value < new Date().toISOString().split("T")[0]) {
        toast.error("Discount expiry must be a future date", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    console.log("name", name);
    console.log("value", value);
    setDiscount((prev) => ({
      ...prev,
      [name === "discountPercentage"
        ? "percentage"
        : name === "discountAmount"
        ? "amount"
        : "expiry"]: value,
    }));
    setEditingShow((prev) => ({
      ...prev,
      [name]: value,
    }));
    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Assume you have a state variable 'shows' and a setter 'setShows'

  const deleteShow = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }
    // Store the deleted show for undo
    const deletedShow = shows.find((show) => show._id === _id);

    // Remove the show from the UI immediately
    setShows(shows.filter((show) => show._id !== _id));

    // Set a timeout to delay the database deletion for 5 seconds
    const undoTimeout = setTimeout(async () => {
      try {
        await axios.delete(`/shows/${_id}`);
        toast.success("Show permanently deleted from the database.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error deleting show from the database:", error);
        toast.error("Failed to delete show from the database.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }, 5000); // Delay actual deletion by 5 seconds

    // Show Undo option in a toast notification
    toast.info(
      <div>
        Show deleted.{" "}
        <button
          className="undo"
          onClick={() => handleUndo(_id, deletedShow, undoTimeout)}
        >
          Undo
        </button>
      </div>,
      {
        position: "top-right",
        autoClose: 5000, // Keep the toast open for 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleUndo = (_id, deletedShow, undoTimeout) => {
    // Cancel the scheduled deletion
    clearTimeout(undoTimeout);

    // Restore the show in the UI
    setShows((prevShows) => [...prevShows, deletedShow]);

    // Notify the user that the show was restored
    toast.success("Show restored.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Function to handle editing a show
  const handleEdit = (_id) => {
    const showToEdit = shows.find((show) => show._id === _id);
    setEditingShow(showToEdit);
    setEditingMode(true);
    setNewShow({
      movie: showToEdit.movie,
      theater: showToEdit.theater,
      date: showToEdit.date,
      time: showToEdit.time,
      price: showToEdit.price,
      available_seats: showToEdit.available_seats,
      discountPercentage: showToEdit.discountPercentage,
      discountAmount: showToEdit.discountAmount,
      discountExpiry: showToEdit.discountExpiry,
    });
    setIsModalOpen(true); // Open the modal
  };

  const resetForm = () => {
    setNewShow({
      // movieTitle: "",
      // theater: "",
      date: "",
      time: "",
      price: "",
      // availableSeats: "",
      discountPercentage: "",
      discountAmount: "",
      discountExpiry: "",
    });
  };

  // Function to save edited show
  const saveShow = async () => {
    try {
      await axios.patch(`/shows/${editingShow._id}`, editingShow);
      await axios.post(`/shows/${editingShow._id}/apply-discount`, discount);
      setShows((prevShows) =>
        prevShows.map((show) =>
          show._id === editingShow._id ? editingShow : show
        )
      );
      setIsModalOpen(false);
      setEditingShow(null);
      setEditingMode(false);
      toast.success("Show updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      resetForm();
    } catch (error) {
      console.error("Error updating show:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (newShow) => {
    setUploading(true);
    try {
      console.log("new show111", newShow);
      const response = await axios.post("/shows", newShow);
      setShows((prevShows) => [...prevShows, response.data]);
      setIsModalOpen(false);
      resetForm();
      setUploading(false);
      toast.success("Show added successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error adding show:", error);
      toast.error("Error adding show", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUploading(false);
    } finally {
      setUploading(false);
      resetForm();
    }
  };

  const showSeats = (_id) => {
    navigate(`/shows/seats/${_id}`);
    console.log("show seats", _id);
  };

  return (
    <div className="shows-page">
      <div className="show-title-bar">
        <h1>Shows</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Show
        </button>
      </div>
      <table className="shows-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>discountAmount</th>
            <th>Available Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show._id}>
              <td>{show.movie}</td>
              <td>{show.date}</td>
              <td>{show.time}</td>
              <td>{"LKR " + show.price}</td>
              <td>
                {"LKR " +
                  (show.discountAmount ||
                    (show.price * show.discountPercentage) / 100)}
              </td>
              <td>
                <button
                  className="show-seats-btn"
                  onClick={() => showSeats(show._id)}
                >
                  Show Seats
                </button>
              </td>
              <td className="edit-delete-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(show._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteShow(show._id)}
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
          <div className="show-modal-content">
            <div className="modal-header">
              <h2>{editingShow ? "Edit Show" : "Add New Show"}</h2>
              <span
                className="close-icon"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMode(false);
                  resetForm();
                  setEditingShow(null);
                }}
              >
                &times;
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setUploading(true);
                if (editingMode) {
                  saveShow();
                } else {
                  handleAdd(newShow);
                }
              }}
            >
              <div className="form-content">
                <div className="column">
                  <label>
                    Movie
                    <select
                      name="movie"
                      value={newShow.movie}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select a movie
                      </option>
                      <option value="Deadpool & Wolverine">
                        Deadpool & Wolverine
                      </option>
                      <option value="Inside Out 2">Inside Out 2</option>
                      <option value="Furiosa: A Mad Max Saga">
                        Furiosa: A Mad Max Saga
                      </option>
                      <option value="Twisters">Twisters</option>
                      <option value="Inside Out 2">Inside Out 2</option>
                    </select>
                  </label>
                  <label>
                    Date
                    <input
                      type="date"
                      name="date"
                      value={newShow.date.split("T")[0]}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      name="time"
                      value={newShow.time}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Price
                    <input
                      type="number"
                      name="price"
                      value={newShow.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      required
                    />
                  </label>
                </div>
                <div className="column">
                  <label>
                    Discount Percentage
                    <input
                      type="number"
                      name="discountPercentage"
                      value={newShow.discountPercentage || ""}
                      onChange={handleInputChange}
                      placeholder="Enter discount percentage"
                      disabled={newShow.discountAmount}
                    />
                  </label>
                  <label>
                    Discount Amount
                    <input
                      type="number"
                      name="discountAmount"
                      value={newShow.discountAmount || ""}
                      onChange={handleInputChange}
                      placeholder="Enter discount amount"
                      disabled={newShow.discountPercentage}
                    />
                  </label>
                  <label>
                    Discount Expiry
                    <input
                      type="date"
                      name="discountExpiry"
                      value={
                        newShow.discountExpiry
                          ? newShow.discountExpiry.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <button type="submit">
                {uploading ? (
                  <Spinner size="20px" />
                ) : editingShow ? (
                  "Save Changes"
                ) : (
                  "Add Show"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to parse theater from token
const parseTheaterFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
  return decodedToken.Name; // Assuming "theater" is a field in the token
};

export default ShowsPage;
