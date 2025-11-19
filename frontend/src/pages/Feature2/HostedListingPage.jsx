import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
/*
2.2.1. Hosted Listings Screen
A unique route must exist for this screen
A screen of all of YOUR listings (that you created) is displayed, 
where each listing shows the:
1.Title
2.Property Type
3.Number of beds (not bedrooms)
4.Number of bathrooms
5.Thumbnail of the listing
6.SVG rating of the listing (based on user ratings)
7.Number of total reviews
8.Price (per night)

Each listing should have a clickable element relating to it that takes you to the screen to edit that particular listing (2.2.3).
A button exists on this screen that allows you to delete a particular listing (this can be present for each listing)
*/

function HostedListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const res = await axios.get("http://localhost:5005/listings");
    const myEmail = localStorage.getItem("email");

    const mine = res.data.listings.filter(l => l.owner === myEmail);

    const detailed = await Promise.all(
      mine.map(async (l) => {
        const detail = await axios.get(`http://localhost:5005/listings/${l.id}`);
        return { id: l.id, ...detail.data.listing };
      })
    );

    setListings(detailed);
  };

  const deleteListing = async (id) => {
    await axios.delete(`http://localhost:5005/listings/${id}`);
    loadListings();
  };

  return (
    <div>
      <h1>Your Hosted Listings</h1>

      {/* Create Button */}
      <Button component={Link} to="/hosted/create" variant="contained">
        Create New Listing
      </Button>

      <br /><br />

      {listings.map((list) => (
        <div 
          key={list.id} 
          style={{
            border: "1px solid #ccc",
            padding: 10,
            margin: 10,
            borderRadius: 8
          }}
        >
          {/* Thumbnail */}
          {list.metadata.youtubeUrl ? (
            <iframe 
              width="200" 
              height="120" 
              src={list.metadata.youtubeUrl}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={list.thumbnail} width="200" />
          )}

          {/* Title */}
          <h2>{list.title}</h2>

          {/* REQUIRED FIELDS */}
          <p><b>Property Type:</b> {list.metadata.propertyType}</p>
          <p><b>Beds:</b> {list.metadata.bedrooms.length}</p>
          <p><b>Bathrooms:</b> {list.metadata.bathrooms}</p>
          <p><b>Price per night:</b> ${list.price}</p>
          <p><b>Total reviews:</b> {list.reviews.length}</p>

          {/* SVG rating (simple stars) */}
          <p>
            <b>Rating:</b> {
              list.reviews.length > 0
                ? "⭐".repeat(Math.round(list.reviews.reduce((a,r)=>a+r.score,0) / list.reviews.length))
                : "No ratings"
            }
          </p>

          {/* Buttons */}
          <Button 
            component={Link} 
            to={`/hosted/edit/${list.id}`} 
            variant="outlined"
          >
            Edit
          </Button>

          <Button 
            onClick={() => deleteListing(list.id)}
            variant="outlined"
            color="error"
            sx={{ marginLeft: 1 }}
          >
            Delete
          </Button>

          <Button 
            component={Link}
            to={`/hosted/publish/${list.id}`}
            variant="outlined"
            color="success"
            sx={{ marginLeft: 1 }}
          >
            Publish
          </Button>

        </div>
      ))}
    </div>
  );
}

export default HostedListingsPage;
