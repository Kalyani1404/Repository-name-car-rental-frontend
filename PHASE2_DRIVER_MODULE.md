# Phase 2 - Driver Module

Implemented on top of Phase 1 without changing the existing API base URL.

## Included
- Driver registration at `/driver-register`
- Shared login automatically redirects DRIVER accounts to `/driver`
- Protected Driver Dashboard
- Driver profile and verification status
- Online / offline availability
- Browser geolocation update to backend
- Current latitude/longitude visible on Driver Dashboard

## Sample approved driver accounts
- rahul.driver@rentride.com / Driver@123
- amit.driver@rentride.com / Driver@123

The backend seeds these accounts on startup. They are created only if missing.
