import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';

function ListingDetails() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const userEmail = localStorage.getItem("email");

    const [listing, setListing] = useState(null);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState(null);
    const [status, setStatus] = useState(null);
 
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAvailable, setIsAvailable] = useState(null); 
    const [msg, setMsg] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [showDateChecker, setShowDateChecker] = useState(false); 

    const listingId = location.state?.listingId;
    const token = localStorage.getItem("token");

    useEffect(() => {
        
        if (token) {
            setLoggedIn(true); 
        } else {
            setLoggedIn(false);
        }

        const fetchDetails = async () => {
            setError(null);
            try {
                const response = await axios.get(
                    `http://localhost:5005/listings/${listingId}`
                );
                setListing(response.data.listing);
            } catch (err) {
                setError("Failed to collect details");
            }
        };

        fetchDetails();
        getBookings();
    }, [listingId, token]); 

    const handleBookNowClick = () => {
        setShowDateChecker(true);
        setIsAvailable(null);
        setMsg('');
    };

    const handleConfirmBooking = () => {
        
        console.log(`Booking confirmed for listing ${listingId} from ${startDate} too ${endDate}`);

        axios.post(`http://localhost:5005/bookings/new/${listingId}`, { 
            dateRange: { 
                start: startDate, 
                end: endDate },
            totalPrice: (calculateBookingDays(startDate,endDate)*listing.price)},
        { 
            headers: { 
                Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setMsg("Booking made!");
            
        })
        .catch(error => {
            setMsg("Booking failed");
        });
    };

    const getBookings = () => {       
        axios.get(`http://localhost:5005/bookings`,
        { 
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(response => {
            setBooking(response.data.bookings);
        })
        .catch(error => {
            console.log(error);
        });
    };
    
    const calculateBookingDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const ms = 1000 * 60 * 60 * 24;
    const diffms = endDate.getTime() - startDate.getTime();
    const bookingDays = Math.round(diffms / ms);
    return parseInt(bookingDays, 10);
};

    const checkAvailabilityAndBook = () => {
        setIsAvailable(null);
        setMsg('');

        if (!startDate || !endDate) {
            setMsg("Please select both a start and end date.");
            return;
        }

        const userStart = new Date(startDate);
        const userEnd = new Date(endDate);

        if (userStart >= userEnd) {
            setMsg("End date must be after the start date.");
            return;
        }

        const isBookingPossible = listing.availability.some(period => {
            const periodStart = period.start; 
            const periodEnd = period.end;     
            return (periodStart <= startDate) && (periodEnd >= endDate);
        });

        setIsAvailable(isBookingPossible);

        if (isBookingPossible) {
            setMsg("to confirm click 'Confirm booking'");
        } else {
            setMsg("Not available");
        }
    };
    
    const goBack = () => {
        navigate("/");
    }

    if (error) {
        return <div style={{padding: 20}}><Alert severity="error">{error}</Alert> <Button onClick={goBack}>Back</Button></div>;
    }

    if (!listing) {
        return <div style={{padding: 20}}><h2>Loading...</h2><Button onClick={goBack}>Back</Button></div>;
    }

    const totalBeds = listing.metadata.bedrooms.reduce((sum, b) => sum + b.numBeds, 0);
  
    const getStatus = () =>{
        if (!booking || booking.length === 0) {
            return; 
        }

        const userBookings = booking.filter(booking => booking.owner === userEmail);
        console.log(userBookings);
        if (userBookings.length === 0) {
            return;
        }
        for (const item of userBookings) {
            if (item.status == "Accepted"){
                setStatus(item.status);
                return;
            }
            else{
                setStatus(item.Status);
            }
            console.log(status);
        }
    }
    


  return (
    <div>
        <h2 style={{ marginBottom: 15 }}>{listing.title}</h2>    
        <img 
            src={listing.thumbnail} 
            alt={listing.title} 

        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <p>Address: **{listing.address}**</p>
            <p>Price: **${listing.price}** per night</p>
            <p>Type: {listing.metadata.propertyType}</p>
        </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <p>Bathrooms: {listing.metadata.bathrooms}</p>
            <p>Beds: {totalBeds}</p>
            <p>Rooms: {listing.metadata.bedrooms.length}</p>
        </div>
        <hr />
        
         <h3>Amenities</h3>
        {listing.metadata.amenities && listing.metadata.amenities.length > 0 ? (
            <ul>
                {listing.metadata.amenities.map((amenity, index) => (
                    <li key={index}>
                        {amenity}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No amenities listed.</p>
        )}

        <hr />
        <h3>Booking</h3>

        {!showDateChecker ? (
            <Button 
                onClick={handleBookNowClick} 
                variant="contained" 
                color="success"
                size="large"
                disabled={!loggedIn} 
            >
                {loggedIn ? 'Book Now & Check Dates' : 'Login to Book'}
            </Button>
        ) : (
            
            <div>
                <p style={{ marginBottom: 15 }}>**Please select your desired dates:**</p>
                
               
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 10 }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    
                    <Button 
                        onClick={checkAvailabilityAndBook}
                        variant="contained" 
                        color="primary"
                    >
                        Check Availability
                    </Button>
                </div>

                {msg && (
                    <Alert severity={isAvailable === true ? "success" : "warning"} style={{ marginBottom: 15 }}>
                        {msg}
                    </Alert>
                )}
                
                {isAvailable === true && (
                    <Button
                        onClick={handleConfirmBooking}
                        variant="contained"
                        color="success"
                        size="large"
                        style={{ marginTop: 5, marginRight: 15 }}
                    >
                        Confirm Booking
                    </Button>
                )}
                
               
                <Button onClick={() => setShowDateChecker(false)} variant="outlined" size="small" style={{marginTop: 10}}>
                    Cancel Selection
                </Button>
            </div>
        )}

        <hr />
        
        {/* reviews unfinished had some issues with trying to implement*/}
        <h3 style={{ marginTop: 30 }}>Reviews and Ratings</h3>
            <ul>
            {listing.reviews.map((review, index) => (
                <li key={index} style={{ marginBottom: 5 }}>
                    Rating: {review.score}/5 - Comment: "{review.comment}"
                </li>
                ))}
            </ul>
        
        
        <div style={{ marginTop: 30 }}>
            <Button onClick={goBack} variant="contained">Go Back to Listings</Button>
            <Button onClick={getStatus} variant="contained">Leave A review</Button>
        </div>
    </div>
  )
}

export default ListingDetails;
        