# RentRide - Phase 1 Frontend Update

This package preserves the existing React project structure and API base URL configuration.

## Included Phase 1 frontend changes

- JWT/Google-authenticated protected routes remain connected through the existing AuthContext and Axios interceptor.
- Cars, Car Details, Booking and My Bookings remain connected to the existing backend APIs.
- Car Details now handles backend errors without crashing the React application and preserves trip query parameters when opening the booking page.
- Added Payment page and routes:
  - `/payments` - payment history
  - `/pay/:bookingId` - create a payment for an existing booking
- My Bookings now provides a `Pay Now` action for non-cancelled/non-rejected bookings.
- Notification page remains connected to database notifications.
- Navbar now displays the unread notification count using `/notifications/unread-count` and refreshes it every 30 seconds / after route changes.
- Added a Payments navigation link for non-driver users.
- Added/updated responsive CSS for Car Details, Payment UI, payment rows and notification count badge.
- Existing Admin routes and dashboard connections are preserved.

## API connection

The existing API configuration is unchanged:

`REACT_APP_API_URL=http://localhost:8081/api`

For deployed environments, set `REACT_APP_API_URL` in the hosting environment.

## Verification

Production build completed successfully with `npm run build` after the changes.
