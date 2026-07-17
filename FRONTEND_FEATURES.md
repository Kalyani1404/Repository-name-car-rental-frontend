# RentRide Frontend – Professional Upgrade

## Included in this build

- Existing login, JWT storage, protected routes, car search, car details, booking, booking history, profile, fleet dashboard and add-car flow preserved.
- Professional registration validation with delayed feedback, red invalid states, green valid states and a single strong-password confirmation.
- Role-aware navigation for USER, DRIVER and ADMIN.
- USER workspace additions: notifications and safety center with saved addresses and emergency contacts.
- DRIVER workspace: verification profile, online/offline control, live-location update, wallet, earnings, completed trips and rating summary.
- ADMIN operations: platform statistics and driver verification approval/rejection.
- Responsive layouts for desktop, tablet and mobile.
- Existing API base URL strategy and authentication interceptor preserved.

## Integration-ready next modules

The backend currently provides the foundations consumed by these pages. Real-time ride dispatch, Google Maps turn-by-turn navigation, SMS OTP, payment-gateway settlement, push notifications and cloud document upload require external provider credentials and should be integrated separately.

## Run

```bash
npm install
npm start
```

## Production API

Set `REACT_APP_API_URL` in Vercel to your backend URL ending in `/api`.
