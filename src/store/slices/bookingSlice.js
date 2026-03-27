import { createSlice } from '@reduxjs/toolkit';

// Load bookings from localStorage
const loadBookingsFromStorage = () => {
  try {
    const storedBookings = localStorage.getItem('popwatch_bookings');
    return storedBookings ? JSON.parse(storedBookings) : [];
  } catch (error) {
    console.error('Failed to load bookings from localStorage:', error);
    return [];
  }
};

const initialState = {
  selectedMovie: null,
  selectedShowtime: null,
  selectedSeats: [],
  totalPrice: 0,
  bookings: loadBookingsFromStorage(),
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
      state.selectedShowtime = null;
      state.selectedSeats = [];
    },
    setSelectedShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
    },
    addSeat: (state, action) => {
      state.selectedSeats.push(action.payload);
      if (state.selectedMovie) {
        state.totalPrice += state.selectedMovie.price;
      }
    },
    removeSeat: (state, action) => {
      state.selectedSeats = state.selectedSeats.filter(seat => seat !== action.payload);
      if (state.selectedMovie) {
        state.totalPrice -= state.selectedMovie.price;
      }
    },
    confirmBooking: (state) => {
      if (state.selectedMovie && state.selectedShowtime && state.selectedSeats.length > 0) {
        const booking = {
          id: Date.now(),
          movie: state.selectedMovie.title,
          showtime: state.selectedShowtime,
          seats: state.selectedSeats,
          totalPrice: state.totalPrice,
          bookingDate: new Date().toLocaleDateString(),
        };
        state.bookings.push(booking);
        // Save to localStorage
        localStorage.setItem('popwatch_bookings', JSON.stringify(state.bookings));
      }
    },
    deleteBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
      localStorage.setItem('popwatch_bookings', JSON.stringify(state.bookings));
    },
    resetBooking: (state) => {
      state.selectedMovie = null;
      state.selectedShowtime = null;
      state.selectedSeats = [];
      state.totalPrice = 0;
    },
  },
});

export const { 
  setSelectedMovie, 
  setSelectedShowtime, 
  addSeat, 
  removeSeat, 
  confirmBooking, 
  resetBooking,
  deleteBooking
} = bookingSlice.actions;
export default bookingSlice.reducer;
