import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setSelectedShowtime, addSeat, removeSeat } from '../store/slices/bookingSlice';

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const movies = useSelector(state => state.movies.movies);
  const booking = useSelector(state => state.booking);
  const dispatch = useDispatch();

  const movie = movies.find(m => m.id === parseInt(movieId));
  
  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  const seats = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];
  const bookedSeatsForShow = booking.bookings
    .filter(existingBooking => {
      const sameMovie = existingBooking.movieId
        ? existingBooking.movieId === movie.id
        : existingBooking.movie === movie.title;

      return sameMovie && existingBooking.showtime === booking.selectedShowtime;
    })
    .flatMap(existingBooking => existingBooking.seats);
  const bookedSeatsSet = new Set(bookedSeatsForShow);
  const availableSeatsCount = seats.filter(seat => !bookedSeatsSet.has(seat)).length;

  const handleSelectShowtime = (showtime) => {
    dispatch(setSelectedShowtime(showtime));
  };

  const handleSelectSeat = (seat) => {
    if (bookedSeatsSet.has(seat)) {
      return;
    }

    if (booking.selectedSeats.includes(seat)) {
      dispatch(removeSeat(seat));
    } else {
      dispatch(addSeat(seat));
    }
  };

  const handleProceed = () => {
    if (booking.selectedShowtime && booking.selectedSeats.length > 0) {
      navigate('/checkout');
    } else {
      alert('Please select a showtime and at least one seat');
    }
  };

  return (
    <div className="movie-details">
      <div className="details-container">
        <div className="movie-info">
          <div className="movie-poster"><img 
    src={movie.image} 
    alt={movie.title} 
    className="movie-poster" 
  /></div>
          <div className="movie-description">
            <h1>{movie.title}</h1>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
            <p><strong>Price per seat:</strong> ₹{movie.price}</p>
          </div>
        </div>

        <div className="booking-section">
          <h2>Select Showtime</h2>
          <div className="showtimes">
            {movie.showtimes.map(showtime => (
              <button 
                key={showtime} 
                className={`showtime-btn ${booking.selectedShowtime === showtime ? 'active' : ''}`}
                onClick={() => handleSelectShowtime(showtime)}
              >
                {showtime}
              </button>
            ))}
          </div>

          {booking.selectedShowtime && (
            <>
              <h2>Select Seats</h2>
              <p className="seat-legend">
                <span className="legend-available">Available: {availableSeatsCount}</span>
                <span className="legend-booked">Booked: {bookedSeatsForShow.length}</span>
              </p>
              <div className="seating-area">
                <div className="screen">Screen</div>
                <div className="seats-grid">
                  {seats.map(seat => {
                    const isBooked = bookedSeatsSet.has(seat);
                    const isSelected = booking.selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        className={`seat ${isSelected ? 'selected' : ''} ${isBooked ? 'unavailable' : ''}`}
                        onClick={() => handleSelectSeat(seat)}
                        disabled={isBooked}
                        title={isBooked ? 'Seat already booked' : 'Seat available'}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <p><strong>Selected Seats:</strong> {booking.selectedSeats.length > 0 ? booking.selectedSeats.join(', ') : 'None'}</p>
                <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                <button className="btn-proceed" onClick={handleProceed}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
