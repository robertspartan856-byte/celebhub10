# CelebHub Route Map and Access Model

## Public Routes

| Route | Page | Access | Notes |
| --- | --- | --- | --- |
| / | Home | Public | Primary conversion landing page |
| /events | Events Catalog | Public | Search, filter, pagination |
| /events/:slug | Event Detail | Public | Seat map or ticket tier selection |
| /store | Fan-Card Store | Public | Grid, filters, featured drops |
| /store/:slug | Product Detail | Public | Digital or physical product variants |
| /celebrities/:slug | Celebrity Profile | Public | Bio, events, merch, social links |
| /drops | Drops and Limited Releases | Public | Queue, countdown, purchase rules |
| /help | Help Center | Public | FAQ, contact, live chat entry |
| /press | Press and Partners | Public | Media kit, partner requests |
| /legal/privacy | Privacy Policy | Public | GDPR and privacy disclosures |
| /legal/terms | Terms of Sale | Public | Purchase terms |
| /legal/cookies | Cookie Policy | Public | Consent and cookie detail |
| /legal/resale | Resale Policy | Public | Secondary sale restrictions |
| /legal/refunds | Refund Policy | Public | Refund and cancellation rules |

## Checkout Routes

| Route | Page | Access | Notes |
| --- | --- | --- | --- |
| /cart | Cart | Public or Logged-in | Cart review before checkout |
| /checkout | Checkout | Public or Logged-in | Guest and account checkout supported |
| /checkout/confirmation/:orderId | Order Confirmation | Public or Logged-in | Access should be tokenized or account-bound |

## Auth Routes

| Route | Page | Access | Notes |
| --- | --- | --- | --- |
| /login | Login | Public | Email/password and OAuth |
| /register | Register | Public | Account creation |
| /forgot-password | Forgot Password | Public | Password recovery |
| /oauth/callback | OAuth Callback | Public | Third-party auth return route |

## Logged-in User Routes

| Route | Page | Access | Notes |
| --- | --- | --- | --- |
| /account | My Account | Authenticated user | Profile overview |
| /account/orders | Order History | Authenticated user | Tickets and merch orders |
| /account/payments | Payment Methods | Authenticated user | Stored cards and billing data |
| /account/addresses | Address Book | Authenticated user | Shipping and billing addresses |
| /account/preferences | Preferences | Authenticated user | Notifications and profile settings |
| /wallet | Ticket Wallet | Authenticated user | QR codes, transfer, reminders |
| /wallet/:ticketId | Ticket Detail | Authenticated user | Individual ticket state |
| /collection | Fan Collection | Authenticated user | Owned digital and physical cards |
| /collection/:itemId | Collection Item Detail | Authenticated user | Metadata and share options |
| /community | Community Hub | Public read, authenticated write | Posting may require auth |

## Internal Routes

| Route | Page | Access | Notes |
| --- | --- | --- | --- |
| /admin | Admin Dashboard | Staff only | Overview and analytics |
| /admin/events | Event Management | Staff only | Event creation and updates |
| /admin/orders | Order Management | Staff only | Order operations and refunds |
| /admin/inventory | Inventory Management | Staff only | Product and ticket inventory |
| /admin/users | User Management | Staff only | Support and moderation actions |
| /admin/celebs | Celeb Portal | Staff only | Talent-specific content and schedules |

## Route-Level Requirements

### SEO-sensitive routes

- Home
- Events Catalog
- Event Detail
- Fan-Card Store
- Product Detail
- Celebrity Profile
- Help Center
- Legal pages

### Auth-required actions

- Save payment method
- View wallet QR details
- Transfer tickets
- Manage collection
- Post in community
- Join drop waitlist if account gating is enabled

### High-risk routes needing additional protection

- /checkout
- /drops
- /wallet/:ticketId
- /admin/*

Required controls:

- Rate limiting
- CAPTCHA or bot detection on checkout and drop participation
- Server-side validation of inventory, prices, and eligibility
- Audit logging for admin actions

## Suggested API Surface

| Area | Example endpoints |
| --- | --- |
| Events | GET /api/events, GET /api/events/:id, GET /api/events/:id/seats |
| Tickets | POST /api/tickets/reserve, POST /api/orders, POST /api/tickets/:id/transfer |
| Products | GET /api/products, GET /api/products/:id |
| Collection | GET /api/collection, GET /api/collection/:id |
| Users | GET /api/me, PATCH /api/me, GET /api/me/orders |
| Compliance | POST /api/privacy/export, POST /api/privacy/delete |
| Webhooks | POST /api/webhooks/payments, POST /api/webhooks/fulfillment, POST /api/webhooks/ticketing |

## Acceptance Criteria Starters

1. A user can filter events by city, date, price, and availability.
2. A user can view clear ticket pricing including fees and VAT before payment.
3. A guest can complete checkout, while a logged-in user can save payment details.
4. A purchaser receives order confirmation by email and SMS when configured.
5. A logged-in user can access ticket QR codes and transfer eligible tickets.
6. A logged-in user can view owned digital and physical fan-cards with metadata.
7. A drop enforces per-user purchase limits and rejects suspicious automated behavior.
8. A user can submit a GDPR export or deletion request.