import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

function CreateListingPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const submit = async () => {
    const body = {
      title,
      address,
      price: Number(price),
      thumbnail,
      metadata: {
        propertyType: "house",
        numBathrooms: 1,
        bedrooms: [],
        amenities: [],
      }
    };

    await axios.post("http://localhost:5005/listings/new", body);
    navigate("/hosted");
  };


  return (
    <div>
      <h1>Create Listing</h1>

      <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <TextField label="Price per night" value={price} onChange={e => setPrice(e.target.value)} />
      <TextField label="Thumbnail" value={thumbnail} onChange={e => setThumbnail(e.target.value)} />

      <Button variant="contained" onClick={submit}>Create</Button>
    </div>
  );
}

export default CreateListingPage;
