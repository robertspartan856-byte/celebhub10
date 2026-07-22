# CelebHub Backend API and Data Model Specification

## Purpose

This document defines the MVP backend models, API surface, validation rules, and implementation notes needed to satisfy the current page acceptance criteria.

## Architecture Assumptions

- Application layer: Next.js App Router with server route handlers for MVP APIs.
- Database: relational store such as PostgreSQL.
- Auth: email and password for MVP, with extensibility for OAuth.
- Payments: Stripe or Adyen sandbox integration.
- Storage: object storage for fan-card media and digital downloads.

## Core Data Models

### User

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| email | string | Unique, indexed |
| passwordHash | string | Stored securely |
| firstName | string | Optional at registration |
| lastName | string | Optional at registration |
| role | enum | `fan`, `support`, `admin` |
| phone | string | Optional, for SMS |
| marketingOptIn | boolean | Newsletter flag |
| createdAt | datetime | Audit |
| updatedAt | datetime | Audit |

Relations:

- has many addresses
- has many payment methods
- has many orders
- has many tickets
- has many owned fan-cards

### Address

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| userId | UUID | Foreign key |
| label | string | Home, billing, shipping |
| line1 | string | Required |
| line2 | string | Optional |
| city | string | Required |
| stateRegion | string | Optional |
| postalCode | string | Required |
| countryCode | string | ISO code |
| isDefaultBilling | boolean | Default false |
| isDefaultShipping | boolean | Default false |

### Event

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| slug | string | Unique, indexed |
| title | string | Required |
| celebrityId | UUID | Foreign key |
| city | string | Indexed for filters |
| venueName | string | Required |
| venueAddress | json | Structured venue address |
| startAt | datetime | Indexed |
| endAt | datetime | Optional |
| description | text | Rich event detail |
| heroImageUrl | string | Media |
| status | enum | `draft`, `published`, `sold_out`, `cancelled` |
| eventType | enum | `reserved_seating`, `general_admission` |
| currency | string | ISO currency code |
| vatRate | decimal | Per-event VAT support |
| refundPolicy | text | Display before purchase |
| resalePolicy | text | Display before purchase |
| isFeatured | boolean | Home and promo placement |
| createdAt | datetime | Audit |
| updatedAt | datetime | Audit |

### TicketTier

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| eventId | UUID | Foreign key |
| name | string | VIP, Floor, Standard |
| description | string | Optional |
| price | integer | Minor units |
| feeAmount | integer | Minor units |
| vatAmount | integer | Minor units |
| quantityTotal | integer | Inventory |
| quantityAvailable | integer | Live availability |
| purchaseLimit | integer | Per order or user |
| sortOrder | integer | UI order |

### Seat

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| eventId | UUID | Foreign key |
| tierId | UUID | Optional foreign key |
| section | string | Seating map support |
| rowLabel | string | Optional |
| seatNumber | string | Optional |
| status | enum | `available`, `held`, `sold`, `blocked` |
| holdExpiresAt | datetime | For reservation windows |
| price | integer | Minor units |

### Product

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| slug | string | Unique, indexed |
| celebrityId | UUID | Foreign key |
| title | string | Required |
| description | text | Detail content |
| productType | enum | `digital_card`, `physical_card` |
| rarity | enum | `common`, `rare`, `epic`, `legendary` |
| editionNumber | string | Display value |
| authenticityCodePrefix | string | Code generation prefix |
| price | integer | Minor units |
| compareAtPrice | integer | Optional |
| currency | string | ISO code |
| stockTotal | integer | Physical or limited inventory |
| stockAvailable | integer | Live available stock |
| limitedReleaseEndsAt | datetime | Countdown support |
| heroImageUrl | string | Grid asset |
| status | enum | `draft`, `active`, `sold_out`, `archived` |
| isFeatured | boolean | Home/store merch slot |
| createdAt | datetime | Audit |
| updatedAt | datetime | Audit |

### ProductVariant

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| productId | UUID | Foreign key |
| name | string | Digital, physical, foil, signed |
| sku | string | Unique |
| fulfillmentType | enum | `digital`, `physical` |
| shippingProfile | string | For physical only |
| downloadAssetUrl | string | For digital only |
| price | integer | Minor units |
| stockAvailable | integer | Variant-level inventory |

### Order

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| orderNumber | string | Human-readable, unique |
| userId | UUID | Nullable for guest checkout |
| email | string | Receipt destination |
| phone | string | Optional SMS |
| status | enum | `pending`, `paid`, `failed`, `cancelled`, `refunded` |
| currency | string | ISO code |
| subtotalAmount | integer | Minor units |
| feeAmount | integer | Minor units |
| vatAmount | integer | Minor units |
| totalAmount | integer | Minor units |
| paymentProvider | enum | `stripe`, `adyen` |
| paymentIntentId | string | Provider reference |
| gdprConsentAccepted | boolean | Required at checkout |
| gdprConsentAt | datetime | Audit trail |
| createdAt | datetime | Audit |
| updatedAt | datetime | Audit |

### OrderItem

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| orderId | UUID | Foreign key |
| itemType | enum | `ticket`, `fan_card` |
| eventId | UUID | Nullable |
| ticketTierId | UUID | Nullable |
| seatId | UUID | Nullable |
| productId | UUID | Nullable |
| productVariantId | UUID | Nullable |
| titleSnapshot | string | Immutable display name |
| unitPrice | integer | Minor units |
| quantity | integer | Required |
| totalPrice | integer | Minor units |

### Ticket

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| orderItemId | UUID | Foreign key |
| userId | UUID | Ticket owner |
| eventId | UUID | Foreign key |
| ticketTierId | UUID | Foreign key |
| seatId | UUID | Nullable |
| qrCodeToken | string | Unique, secure |
| status | enum | `active`, `transferred`, `used`, `expired`, `cancelled` |
| transferable | boolean | Driven by event policy |
| transferredAt | datetime | Optional audit |
| createdAt | datetime | Audit |

### OwnedFanCard

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| userId | UUID | Owner |
| orderItemId | UUID | Foreign key |
| productId | UUID | Foreign key |
| productVariantId | UUID | Foreign key |
| authenticityCode | string | Unique, indexed |
| issueDate | datetime | Ownership issue time |
| ownershipType | enum | `digital`, `physical` |
| fulfillmentStatus | enum | `pending`, `delivered`, `shipped`, `downloaded` |

### NewsletterSubscription

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| email | string | Unique, indexed |
| source | string | Home page, footer, drop page |
| status | enum | `pending`, `subscribed`, `unsubscribed` |
| createdAt | datetime | Audit |

### PrivacyRequest

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| userId | UUID | Nullable if email-driven |
| email | string | Request subject |
| requestType | enum | `export`, `delete` |
| status | enum | `received`, `processing`, `completed`, `rejected` |
| createdAt | datetime | Audit |
| completedAt | datetime | Optional |

## API Surface

## Authentication APIs

### POST /api/auth/register

Creates a user account.

Request body:

```json
{
  "email": "fan@example.com",
  "password": "securePassword123",
  "firstName": "Ava",
  "lastName": "Stone"
}
```

Response:

- `201 Created` with user profile payload.

### POST /api/auth/login

Authenticates a user and establishes a session.

### POST /api/auth/logout

Clears the current session.

### GET /api/me

Returns the authenticated user profile, payment method summary, and saved addresses.

### PATCH /api/me

Updates editable profile fields.

## Home and Newsletter APIs

### GET /api/home

Returns the home page payload.

Response shape:

```json
{
  "featuredEvent": {},
  "upcomingEvents": [],
  "featuredProducts": [],
  "newsletterEnabled": true
}
```

### POST /api/newsletter/subscribe

Validates and stores newsletter signup requests.

Validation rules:

- valid email required
- deduplicate existing active subscribers

## Event APIs

### GET /api/events

Returns paginated events with filtering.

Query params:

- `city`
- `dateFrom`
- `dateTo`
- `celebrity`
- `priceMin`
- `priceMax`
- `status`
- `page`
- `pageSize`

Response shape:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 12,
  "totalItems": 124,
  "totalPages": 11
}
```

### GET /api/events/:slug

Returns detail payload including policies, venue information, and ticket purchase options.

### GET /api/events/:id/tiers

Returns ticket tiers and current availability.

### GET /api/events/:id/seats

Returns seat map data for reserved seating events.

### POST /api/admin/events

Creates an event. Admin-only.

### PATCH /api/admin/events/:id

Updates an event. Admin-only.

## Product APIs

### GET /api/products

Returns store products with filtering and sorting.

Query params:

- `rarity`
- `celebrity`
- `type`
- `sort`
- `page`
- `pageSize`

### GET /api/products/:slug

Returns full product detail with variants and fulfillment info.

## Cart and Checkout APIs

### GET /api/cart

Returns the current cart.

### POST /api/cart/items

Adds a ticket tier, seat, or product variant to the cart.

Validation rules:

- item exists
- inventory available
- purchase limit not exceeded

### PATCH /api/cart/items/:id

Updates item quantity where allowed.

### DELETE /api/cart/items/:id

Removes an item from the cart.

### POST /api/checkout/session

Creates a checkout session and payment intent.

Validation rules:

- valid cart
- recalculated totals
- gdpr consent required
- address validation for physical fulfillment

### POST /api/orders

Finalizes the order after payment confirmation.

### GET /api/orders/:orderNumber

Returns order confirmation details for the owner or tokenized guest session.

## Ticket Wallet APIs

### GET /api/me/tickets

Returns active and past tickets for the authenticated user.

### GET /api/me/tickets/:ticketId

Returns detailed ticket payload, transfer eligibility, and QR metadata.

### POST /api/me/tickets/:ticketId/transfer

Transfers a ticket to another email if policy allows.

Validation rules:

- ticket belongs to current user
- ticket is transferable
- event is not expired

## Fan Collection APIs

### GET /api/me/collection

Returns owned fan-cards and metadata.

### GET /api/me/orders

Returns combined ticket and merchandise order history.

## Privacy APIs

### POST /api/privacy/export

Creates a GDPR data export request.

### POST /api/privacy/delete

Creates a GDPR deletion request.

## Webhook APIs

### POST /api/webhooks/payments

Handles payment provider webhook events.

### POST /api/webhooks/fulfillment

Handles shipping and fulfillment status updates.

## Validation and Indexing Notes

### Validation rules

1. Email must be unique for user and newsletter records where appropriate.
2. Slugs must be unique for events and products.
3. Authenticity codes must be globally unique.
4. Checkout totals must always be recalculated on the server.
5. GDPR consent must be stored with timestamp before paid order creation.

### Recommended indexes

1. `users.email`
2. `events.slug`
3. `events.city, events.startAt`
4. `products.slug`
5. `products.rarity, products.status`
6. `owned_fan_cards.authenticityCode`
7. `tickets.userId, tickets.status`
8. `orders.orderNumber`

## Security and Operational Notes

1. Apply rate limiting to auth, newsletter, checkout, and ticket transfer endpoints.
2. Add CAPTCHA or bot detection on checkout and limited-release purchase endpoints.
3. Minimize PCI scope by using hosted payment fields or provider components.
4. Sign webhook requests and verify signatures before processing.
5. Emit audit events for consent capture, ticket transfer, and admin mutations.

## MVP Build Order

1. User and auth endpoints
2. Event list and detail endpoints
3. Newsletter endpoint
4. Product list and detail endpoints
5. Cart and checkout endpoints
6. Order confirmation and account history endpoints
7. Ticket wallet and transfer endpoints
8. GDPR export and delete endpoints