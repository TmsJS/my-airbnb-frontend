import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
/*
2.2.4. Edit AirBrB Listing
A unique route must exist for this screen that is parameterised on the listing ID.
The user should be able to edit the following:

Title | Address | Thumbnail | Price (per night) | Type
Number of bathrooms | Bedrooms (incorporate editing of beds as part of bedrooms)
Amenities | List of property images

Updates can auto-save, 
or a save button can exist that saves the updates and returns you to the hosted listings screen.
*/

function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic listing fields
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // Metadata fields
  const [propertyType, setPropertyType] = useState("house");
  const [bathrooms, setBathrooms] = useState(1);
  const [bedrooms, setBedrooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get(`http://localhost:5005/listings/${id}`);
    const l = res.data.listing;
    //Provide safe fallback metadata 
    const m = l.metadata || {
      propertyType: "",
      bathrooms: 0,
      bedrooms: [],
      amenities: [],
      images: [],
      youtubeUrl: ""
    };

    setTitle(l.title);
    setAddress(l.address);
    setPrice(l.price);
    setThumbnail(l.thumbnail);

    setPropertyType(l.metadata.propertyType);
    setBathrooms(l.metadata.bathrooms);
    setBedrooms(l.metadata.bedrooms || []);
    setAmenities(l.metadata.amenities || []);
    setImages(l.metadata.images || []);
    setYoutubeUrl(l.metadata.youtubeUrl || "");


  };

  const addBedroom = () => {
    setBedrooms([...bedrooms, { numBeds: 1, bedType: "single" }]);
  };

  const updateBedroom = (index, key, value) => {
    const copy = [...bedrooms];
    copy[index][key] = value;
    setBedrooms(copy);
  };

  const addAmenity = () => {
    setAmenities([...amenities, ""]);
  };

  const updateAmenity = (i, val) => {
    const copy = [...amenities];
    copy[i] = val;
    setAmenities(copy);
  };

  const addImage = () => {
    setImages([...images, ""]);
  };

  const updateImage = (i, val) => {
    const copy = [...images];
    copy[i] = val;
    setImages(copy);
  };

  const save = async () => {
    const token = localStorage.getItem("token"); 
    const body = {
      title,
      address,
      price: Number(price),
      thumbnail,
      metadata: {
        propertyType,
        bathrooms: Number(bathrooms),
        bedrooms,
        amenities,
        images,
        youtubeUrl
      }
    };

    await axios.put(
      `http://localhost:5005/listings/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );

    navigate("/hosted");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Listing</h1>

      <h3>Basic Info</h3>

      <TextField margin="normal" label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
      <TextField margin="normal" label="Address" value={address} onChange={e => setAddress(e.target.value)} fullWidth />
      <TextField margin="normal" label="Thumbnail" value={thumbnail} onChange={e => setThumbnail(e.target.value)} fullWidth />
      <TextField margin="normal" label="Price per Night" value={price} onChange={e => setPrice(e.target.value)} fullWidth />

      <h3>Property Info / Details</h3>

      <TextField margin="normal" label="Property Type" value={propertyType} onChange={e => setPropertyType(e.target.value)} fullWidth />
      <TextField margin="normal" label="Number of Bathrooms" value={bathrooms} onChange={e => setBathrooms(e.target.value)} fullWidth />

      <h3>Bedrooms</h3>
      {bedrooms.map((b, i) => (
        <div key={i}>
          <TextField 
            margin="normal"
            label="Num Beds"
            type="number"
            inputProps={{ min: 0 }}
            value={b.numBeds}
            onChange={e => updateBedroom(i, "numBeds", Number(e.target.value))}
          />
          <TextField 
            margin="normal"
            label="Bed Type"
            value={b.bedType}
            onChange={e => updateBedroom(i, "bedType", e.target.value)}
          />
        </div>
      ))}
      <Button onClick={addBedroom}>Add Bedroom</Button>

      <h3>Amenities</h3>
      {amenities.map((a, i) => (
        <TextField 
          key={i}
          value={a}

          onChange={e => updateAmenity(i, e.target.value)}
        />
      ))}
      <Button onClick={addAmenity}>Add Amenity</Button>

      <h3>Images</h3>
      {images.map((img, i) => (
        <TextField
          key={i}
          value={img}
          onChange={e => updateImage(i, e.target.value)}
          fullWidth
        />
      ))}
      <Button onClick={addImage}>Add Image</Button>

      <h3>YouTube Embed URL</h3>
      <TextField 
        value={youtubeUrl}
        fullWidth
        onChange={e => setYoutubeUrl(e.target.value)}
      />

      <br /><br />
      <Button variant="contained" onClick={save}>Save</Button>
    </div>
  );
}
export default EditListingPage;