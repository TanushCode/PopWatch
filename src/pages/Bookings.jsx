import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Bookings() {
  const bookings = useSelector(state => state.booking.bookings);
  const navigate = useNavigate();

  return (
    <div className="bookings">
      <div className="bookings-container">
        <h1>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings yet. Start booking your tickets!</p>
            <button className="btn-book" onClick={() => navigate('/')}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.movie}</h3>
                  <span className="booking-id">#{booking.id}</span>
                </div>
                <div className="booking-details-grid">
                  <div className="detail">
                    <span className="detail-label">Date:</span>
                    <span>{booking.bookingDate}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Showtime:</span>
                    <span>{booking.showtime}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Seats:</span>
                    <span>{booking.seats.join(', ')}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Amount Paid:</span>
                    <span className="amount">₹{booking.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
