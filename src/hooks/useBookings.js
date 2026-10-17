import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export const useBookings = () => {
  const { bookings, addBooking, cancelBooking } = useAppContext();

  const activeBookings = useMemo(() => {
    return bookings.filter((b) => b.status !== 'cancelled');
  }, [bookings]);

  const cancelledBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'cancelled');
  }, [bookings]);

  return {
    bookings,
    activeBookings,
    cancelledBookings,
    addBooking,
    cancelBooking,
    count: bookings.length,
    activeCount: activeBookings.length,
  };
};
