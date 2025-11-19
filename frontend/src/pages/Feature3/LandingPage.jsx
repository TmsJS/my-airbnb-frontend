import { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // search fields
  const [query, setQuery] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [ratingSort, setRatingSort] = useState(""); // "asc" | "desc"

  const token = localStorage.getItem("token");
  const myEmail = localStorage.getItem("email");

  // LOAD LISTINGS
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("http://localhost:5005/listings");
    const meta = res.data.listings;

    // fetch full details
    const details = await Promise.all(
      meta.map(async (m) => {
        const d = await axios.get(`http://localhost:5005/listings/${m.id}`);
        return { id: m.id, ...d.data.listing };
      })
    );

    // only published listings
    const pubs = details.filter((l) => l.published === true);

    // special ordering: user bookings come first
    let ordered = pubs;

    if (token) {
      const bookingsRes = await axios.get(
        "http://localhost:5005/bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const myBookings = bookingsRes.data.bookings.filter(
        (b) => b.owner === myEmail &&
              (b.status === "accepted" || b.status === "pending")
      );

      const bookedIds = new Set(myBookings.map((b) => b.listingId));

      const bookedFirst = pubs.filter((l) => bookedIds.has(l.id));
      const rest = pubs.filter((l) => !bookedIds.has(l.id));

      rest.sort((a, b) => a.title.localeCompare(b.title));

      ordered = [...bookedFirst, ...rest];
    } else {
      ordered = pubs.sort((a, b) => a.title.localeCompare(b.title));
    }

    setListings(ordered);
    setFiltered(ordered);
  };

  // APPLY FILTERS (button click)
  const doSearch = () => {
    let result = [...listings];

    // text search
    if (query.trim() !== "") {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      );
    }

    // bedrooms
    result = result.filter((l) => {
      const beds = l.metadata.bedrooms.reduce(
        (sum, b) => sum + b.numBeds,
        0
      );

      if (minBeds !== "" && beds < Number(minBeds)) return false;
      if (maxBeds !== "" && beds > Number(maxBeds)) return false;
      return true;
    });

    // price
    result = result.filter((l) => {
      if (minPrice !== "" && l.price < Number(minPrice)) return false;
      if (maxPrice !== "" && l.price > Number(maxPrice)) return false;
      return true;
    });

    // date range
    if (dateStart && dateEnd) {
      result = result.filter((l) => {
        return l.availability.some(
          (r) => r.start <= dateStart && r.end >= dateEnd
        );
      });
    }

    // rating sort
    // count active filters
    const activeFilters = [
      query.trim() !== "",
      minBeds !== "",
      maxBeds !== "",
      minPrice !== "",
      maxPrice !== "",
      dateStart !== "" && dateEnd !== ""
    ].filter(Boolean).length;

    // if multiple filters applied → alphabetical sort only
    if (activeFilters >= 2) {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // otherwise apply rating sort normally
      if (ratingSort === "asc") {
        result.sort((a, b) => avg(a) - avg(b));
      } else if (ratingSort === "desc") {
        result.sort((a, b) => avg(b) - avg(a));
      }
    }

    setFiltered(result);
  };

  const avg = (l) => {
    if (l.reviews.length === 0) return 0;
    return (
      l.reviews.reduce((s, r) => s + r.score, 0) / l.reviews.length
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Available Listings</h1>

      {/* SEARCH BOX */}
      <div
        style={{
          marginBottom: 30,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 10,
          maxWidth: 800,
          background: "#fafafa"
        }}
      >
        <h2 style={{ marginBottom: 15 }}>Search Filters</h2>

        {/* 1. Title Search */}
        <input
          placeholder="Search by title or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "95%",
            padding: "10px 12px",
            marginBottom: 15,
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        {/* 2. Beds */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <input
            placeholder="Min Beds"
            value={minBeds}
            onChange={(e) => setMinBeds(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <input
            placeholder="Max Beds"
            value={maxBeds}
            onChange={(e) => setMaxBeds(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </div>

        {/* 3. Price */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <input
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <input
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </div>

        {/* 4. Date Range */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 15
          }}
        >
          <label style={{ width: 90 }}>Date Start:</label>
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />

          <label style={{ width: 80 }}>Date End:</label>
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </div>

        {/* 5. Rating Sort */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 10 }}>Rating Sort:</label>
          <select
            value={ratingSort}
            onChange={(e) => setRatingSort(e.target.value)}
            style={{
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          >
            <option value="">None</option>
            <option value="asc">Low -> High</option>
            <option value="desc">High -> Low</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={doSearch}
          style={{
            padding: "12px 20px",
            fontSize: 16,
            borderRadius: 8,
            border: "none",
            background: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Search
        </button>
      </div>


      {/* RESULTS */}
      {filtered.length === 0 ? (
        <p>No listings match the filters.</p>
      ) : (
        filtered.map((l) => (
          <div key={l.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h3>{l.title}</h3>
            <img src={l.thumbnail} width="200" />
            <p>Reviews: {l.reviews.length}</p>
            <p>Rating: {avg(l).toFixed(1)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default LandingPage;
