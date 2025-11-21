import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
/*
2.2.2. Hosted Listing Create

On the hosted listing screen (2.2.1) a button should exist that allows you 
to [create] a new listing. When you click on it, you are taken to another screen 
that requires you to provide the following details:

1.Listing Title
2.Listing Address
3.Listing Price (per night)
4.Listing Thumbnail (use any default image, if not provided)
5.Property Type
6.Number of bathrooms on the property
7.Bedrooms in the property (e.g. each bedroom could include number of beds and their type)
8.Property amenities

Using a button, a new listing on the server is created 
and visibly added to the dashboard (the Hosted Listings Screen) 
once all of the required fields have been filled out correctly.

*/
function CreateListingPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [propertyType, setPropertyType] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [bedrooms, setBedrooms] = useState([]);
  const [newBedCount, setNewBedCount] = useState("");
  const [newBedType, setNewBedType] = useState("");

  const [amenities, setAmenities] = useState("");
  const [error, setError] = useState("");

  //2.2.3 YouTube Listing Thumbnail 🙉🙉🙉
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Add bedroom 
  const addBedroom = () => {
    if (!newBedCount || !newBedType) {
      setError("You must enter bed count and bed type.");
      return;
    }

    const newRoom = {
      numBeds: Number(newBedCount),
      bedType: newBedType,
    };

    setBedrooms([...bedrooms, newRoom]);
    setNewBedCount("");
    setNewBedType("");
    setError("");
  };

  // Submit
  const submit = async () => {
    if (!title || !address || !price || !propertyType || !bathrooms) {
      setError("Please fill in all required fields.");
      return;
    }

    const body = {
      title,
      address,
      price: Number(price),
      thumbnail: thumbnail || "https://placehold.co/400", // default image
      
      metadata: {
        propertyType,
        bathrooms: Number(bathrooms),
        bedrooms,
        amenities: amenities ? amenities.split(",").map(a => a.trim()) : [],
        //2.2.3 YouTube Listing Thumbnail
        youtubeUrl: youtubeUrl || "https://www.youtube.com/embed/mRD0-GxqHVo",
        // "Heat waves" by Glass Animal
      },
    };

    try {
      await axios.post("http://localhost:5005/listings/new", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/hosted");
    } catch (_err) {
      setError("Failed to create listing.");
    }
  };

  return (
    <div>
      <h1>Create New Listing</h1>

      {error && <Alert severity="error">{error}</Alert>}

      <br />

      {/* Title */}
      <TextField
        fullWidth
        label="Listing Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Address */}
      <TextField
        fullWidth
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Price */}
      <TextField
        fullWidth
        label="Price per Night"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Thumbnail */}
      <TextField
        fullWidth
        label="Thumbnail URL (optional)"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* YouTube Listing Thumbnail */}
      <TextField 
        fullWidth
        label="YouTube Embed URL (optional)" 
        value={youtubeUrl}
        onChange={e => setYoutubeUrl(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Property Type */}
      <TextField
        fullWidth
        select
        label="Property Type"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="house">House</MenuItem>
        <MenuItem value="apartment">Apartment</MenuItem>
        <MenuItem value="unit">Unit</MenuItem>
        <MenuItem value="villa">Villa</MenuItem>
      </TextField>

      {/* Bathrooms */}
      <TextField
        fullWidth
        type="number"
        label="Number of Bathrooms"
        value={bathrooms}
        onChange={(e) => setBathrooms(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <h3>Bedrooms</h3>

      {/* Beds input */}
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          label="Number of Beds"
          type="number"
          value={newBedCount}
          onChange={(e) => setNewBedCount(e.target.value)}
          inputProps={{ min: 0 }} 
        />

        <TextField
          label="Bed Type (queen, king, etc.)"
          value={newBedType}
          onChange={(e) => setNewBedType(e.target.value)}
        />

        <Button onClick={addBedroom} variant="outlined">
          Add
        </Button>
      </div>

      {/* Display added bedrooms */}
      {bedrooms.map((b, i) => (
        <p key={i}>
          Bedroom {i + 1}: {b.numBeds} × {b.bedType}
        </p>
      ))}

      <br />

      {/* Amenities */}
      <TextField
        fullWidth
        label="Amenities (comma separated)"
        placeholder="wifi, kitchen, TV..."
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Button variant="contained" onClick={submit}>
        Create Listing
      </Button>
    </div>
  );
}

export default CreateListingPage;
