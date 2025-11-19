import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function HostedListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const res = await axios.get("http://localhost:5005/listings");
    const allListings = res.data.listings;

    const myEmail = localStorage.getItem("email");

    const mine = allListings.filter(list => list.owner === myEmail);

    setListings(mine);
  };

  const deleteListing = async (id) => {
    await axios.delete(`http://localhost:5005/listings/${id}`);
    loadListings();
  };

  return (
    <div>
      <h1>Your Hosted Listings</h1>

      <Button component={Link} to="/hosted/create" variant="contained">
        Create New Listing
      </Button>

      {listings.map(list => (
        <div key={list.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <img src={list.thumbnail} width="100" />

          <h3>{list.title}</h3>

          <Button component={Link} to={`/hosted/edit/${list.id}`} variant="outlined">Edit</Button>
          <Button onClick={() => deleteListing(list.id)} variant="outlined" color="error">Delete</Button>
          <Button component={Link} to={`/hosted/publish/${list.id}`} variant="outlined" color="success">Publish</Button>
        </div>
      ))}
    </div>
  );
}

export default HostedListingsPage;
