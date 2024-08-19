useEffect(() => {
  const mockReservations = [
    {
      id: "R001",
      customerName: "John Doe",
      movieTitle: "Avengers: Endgame",
      showTime: "2024-08-20 7:00 PM",
      seats: ["A1", "A2"],
    },
    {
      id: "R002",
      customerName: "Jane Smith",
      movieTitle: "The Lion King",
      showTime: "2024-08-20 5:00 PM",
      seats: ["B3", "B4"],
    },
    // Add more mock data...
  ];

  setReservations(mockReservations);
}, []);
