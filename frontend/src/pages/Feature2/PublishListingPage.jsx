import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
/*
2.2.5. Publishing a listing

For a listing to "go live" means that the listing becomes visible to other AirBrB users on the screen described in 2.4.
On the hosted listings screen described in 2.2.1, add the ability to make an individual listing "go live".

A listing must have at least one availability date range (e.g. a listing could be available 
between 1st and 3rd of November and then between the 5th and 6th of November).
The way you define the availability ranges is entirely up to you. 
For example, you could use the following schemas:
//Example 1:
availability: [{ start: date1, end: date2 }, { start: date3, end: date4 }, ...];
//Example 2:
availability: [date1, date2, date3, date4, ...];

If the listing has more than 1 availability range, 
aggregate them on the frontend and submit them all to the backend 
in one go when publishing the listing. 
(You must handle multiple availablility-ranges for full marks in this section)
*/
function PublishListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ranges, setRanges] = useState([{ start: "", end: "" }]);

  const addRange = () => {
    setRanges([...ranges, { start: "", end: "" }]);
  };

  const updateRange = (idx, key, value) => {
    const copy = [...ranges];
    copy[idx][key] = value;
    setRanges(copy);
  };

  const publish = async () => {
    const token = localStorage.getItem("token");

    for (const r of ranges) {
      if (!r.start || !r.end) {
        alert("Please fill in all date ranges");
        return;
      }
      if (r.end < r.start) {
        alert("End date must be after start date");
        return;
      }
    }

    await axios.put(
      `http://localhost:5005/listings/publish/${id}`,
      { availability: ranges },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/hosted");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Publish Listing</h1>

      {ranges.map((r, idx) => (
        <div key={idx} style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>Start Date:</label>
          <input
            type="date"
            value={r.start}
            onChange={(e) => updateRange(idx, "start", e.target.value)}
          />

          <label style={{ marginLeft: "20px", marginRight: "10px" }}>End Date:</label>
          <input
            type="date"
            value={r.end}
            onChange={(e) => updateRange(idx, "end", e.target.value)}
          />
        </div>
      ))}

      <Button onClick={addRange} sx={{ marginRight: 2 }}>Add Range</Button>
      <Button onClick={publish} variant="contained" color="success">
        Publish
      </Button>
    </div>
  );
}

export default PublishListingPage;
