# Parlour Booking

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Homepage with hero section introducing the parlour and a call-to-action to book
- Services page listing available services (e.g. haircut, facial, manicure, pedicure, waxing) with name, description, duration, and price
- Booking form: customer name, phone number, email, selected service, preferred date, preferred time slot
- Admin panel (login-protected) to view, manage, and update booking statuses (pending, confirmed, cancelled)
- Bookings stored in backend with all customer and service details
- Sample services pre-seeded in the backend

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend (Motoko):
   - Data types: Service (id, name, description, duration, price), Booking (id, customerName, phone, email, serviceId, date, timeSlot, status, createdAt)
   - Stable storage for services and bookings
   - CRUD for services (admin)
   - Create booking (public), read all bookings (admin), update booking status (admin)
   - Seed initial services on first deploy
   - Authorization: admin role for managing bookings and services

2. Frontend:
   - Landing page with hero banner, services section, and book now CTA
   - Services listing page/section with cards
   - Booking page with a multi-field form
   - Admin dashboard showing bookings table with status update controls
   - Navigation between pages
   - Confirmation message after successful booking
