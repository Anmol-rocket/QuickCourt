# QuickCart / Facility Booking Backend — API Documentation ⚡️

> Full endpoint reference, request/response examples and implementation notes.
> **Authentication:** Most endpoints require `Authorization: Bearer <JWT>` unless noted otherwise.
> Dates/time use ISO-8601 (e.g. `2025-08-12T18:30:00`). 📅

---

# Auth & Users 🔐

### Register

`POST /register`
**Request JSON**

```json
{
  "email": "2023kucp1128@gmail.com",
  "password": "12345",
  "fullName": "anmol",
  "avatarUrl": "https://example.com/avatar.jpg",
  "role": "ROLE_FACILITY_OWNER",
  "verified": false
}
```

**Responses**

* `200 OK` — registration successful (empty body) ✅
* `400 Bad Request` — email already in use ❌
* `500 Internal Server Error` — registration failed ⚠️

> Note: Password should be encoded (bcrypt) in backend.

---

### Login

`GET /login?email={email}&password={password}`
No JSON body. Returns a JWT on success.

**Responses**

* `200 OK` — returns JWT token ✅
* `400 Bad Request` — wrong credentials / auth error ❌

---

### Get User Data

`GET /data/{emailId}`

**Response example**

```json
{
  "email": "sauvir@example.com",
  "password": "<hashed-password>",
  "fullName": "sauvir",
  "avatarUrl": "https://example.com/avatar.jpg",
  "role": "ROLE_USER",
  "verified": null
}
```

* `200 OK`
* `404` or `500` — user not found ⚠️

---

### Update Registration

`PUT /updateRegistration`
**Request JSON**

```json
{
  "email": "sauvir@example.com",
  "password": "<already-encoded-password>",
  "fullName": "sauvirwodehra",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "role": "ROLE_USER",
  "verified": false
}
```

**Notes**

* Password must already be encoded if updating. 🔒
* Email is primary key — changing it can break references. ⚠️

**Responses**

* `200 OK` — update successful ✅
* `500 Internal Server Error` — update failed ❌

---

# Venues 🏟️

### Create Venue

`POST /api/venues?ownerEmail={ownerEmail}`
**Request JSON**

```json
{
  "name": "Sunshine Sports Complex",
  "description": "A premium facility with state-of-the-art equipment and multiple sports options.",
  "address": "123 Main Street, New York, NY",
  "isVerified": false,
  "photoUrls": [
    "https://example.com/images/venue1.jpg",
    "https://example.com/images/venue2.jpg"
  ],
  "amenities": [
    "Parking",
    "Changing Rooms",
    "Cafeteria",
    "Wi-Fi"
  ],
  "rating": null,
  "ownerMail": "11@gmail.com",
  "sportIds": []
}
```

**Responses**

* `201 Created` (or `200 OK`) — created venue JSON ✅
* `400 Bad Request` — invalid data ❌

---

### Get Venue By ID

`GET /api/venues/{id}`

**Response example**

```json
{
  "id": 2,
  "name": "Sunshine Sports Complex",
  "description": "A premium facility ...",
  "address": "123 Main Street, New York, NY",
  "photoUrls": [
    "https://example.com/images/venue1.jpg",
    "https://example.com/images/venue2.jpg"
  ],
  "amenities": ["Parking","Changing Rooms","Cafeteria","Wi-Fi"],
  "rating": null,
  "ownerMail": "11@gmail.com",
  "verified": false,
  "sportIds": []
}
```

* `200 OK`
* `404 Not Found` — no venue with given ID ⚠️

---

### Get All Venues

`GET /api/venues`
**Response:** array of venue objects (see format above). 📦

---

### Get All Venues For an Owner

`GET /api/venues/allVenues/{ownerEmail}`
**Response:** array of venues owned by that owner. 👤

> If using email in path, either URL-encode the `@` or declare mapping `/{ownerEmail:.+}` to allow dots.

---

### Delete Venue

`DELETE /api/venues/owners/{email}/venues/{id}`

* No body.
* Responses:

  * `204 No Content` — success ✅
  * `404 Not Found` — venue not found for owner ❌
  * `400 Bad Request` — invalid parameters ⚠️

---

### Partial Update Venue

`PUT /api/venues/{venueId}`
**Request JSON** (partial fields allowed)

```json
{
  "name": "Updated Sports Complex",
  "description": "Now with extra indoor courts.",
  "address": "456 Elm Street, Boston, MA",
  "photoUrls": [
    "https://example.com/images/updated1.jpg"
  ],
  "amenities": [
    "Parking",
    "Cafeteria",
    "Wi-Fi",
    "First Aid"
  ],
  "rating": 4
}
```

* `200 OK` — updated venue object ✅
* `404` / `400` as applicable ❌

---

### Verify Venue

`PUT /api/venues/verify/{venueId}`

* No JSON required. Marks venue verified. ✅
* `200 OK` or updated venue returned.

---

# Sports 🏅

### Add Sport to Venue

`POST /api/sports/venue/{venueId}`
**Request JSON**

```json
{
  "name": "Tennis",
  "type": "Outdoor",
  "pricePerHour": 50.0,
  "operatingHours": "08:00 - 20:00",
  "averageRating": 0.0,
  "venueId": 1,
  "commentIds": []
}
```

* `200 OK` or `201 Created` on success ✅
* `404 Not Found` — venue not found ❌

---

### List Sports By Venue

`GET /api/sports/venue/{venueId}`
**Response example**

```json
[
  {
    "id": 1,
    "name": "Tennis",
    "type": "Outdoor",
    "pricePerHour": 50.00,
    "operatingHours": "08:00 - 20:00",
    "averageRating": 0.0,
    "venueId": 2,
    "commentIds": []
  }
]
```

---

### Delete Sport

`DELETE /api/sports/{sportId}/venue/{venueId}?ownerEmail={ownerEmail}`

* No body.
* `204 No Content` on success ✅ or appropriate error codes ❌.

---

### Update Sport

`PATCH /api/sports/{sportId}/venue`
**Request JSON**

```json
{
  "name": "Updated Tennis Court",
  "type": "Indoor",
  "pricePerHour": 60.0,
  "operatingHours": "09:00 - 22:00"
}
```

* `200 OK` — updated sport object ✅

---

### Get Sport

`GET /api/sports/{id}`

* Returns sport data (format depends on implementation). 🔍

---

# Games ⚽

### Create New Game

`POST /api/games`
**Request JSON**

```json
{
  "gameName": "Evening Football Match",
  "location": "Central Park",
  "venue": "Field #2",
  "timeDate": "2025-08-12T18:30:00",
  "playersRequired": 10
}
```

**Response**

```json
{
  "id": 1,
  "gameName": "Evening Football Match",
  "location": "Central Park",
  "timeDate": "2025-08-12T18:30:00",
  "venue": "Field #2",
  "playersRequired": 10,
  "listOfUserEmailJoined": []
}
```

---

### Get All Games

`GET /api/games`

* Returns array of games. 📋

---

### Get Game By ID

`GET /api/games/{gameId}`

* Returns single game object.

---

### Update Game

`PUT /api/games/{gameId}`
**Request JSON**

```json
{
  "gameName": "Evening Football Match - Updated",
  "location": "Central Park Field #3",
  "timeDate": "2025-08-12T19:00:00",
  "playersRequired": 12,
  "venue": "Field01"
}
```

* `200 OK` — updated game JSON ✅

---

### Delete Game

`DELETE /api/games/{gameId}`

* `204 No Content` on success ✅

---

### Join Game

`POST /api/games/{id}/join?userEmail={userEmail}`

* Adds `userEmail` to `listOfUserEmailJoined`.
* `200 OK` — returns updated game ✅

---

### Leave Game

`POST /api/games/{id}/leave?userEmail={userEmail}`

* Removes user from joined list.
* `200 OK` — returns updated game ✅

---

# User Game Profiles 👥

### Create User Game Profile

`POST /api/user-profiles/{email}`
**Response**

```json
{
  "userEmail": "sauvir@gmail.com",
  "idsOfGamesJoined": []
}
```

---

### Get User Game Profile

`GET /api/user-profiles/{email}`

* Returns profile JSON.

---

### Get Joined Game IDs For User

`GET /api/user-profiles/{email}/game-ids`
**Response example**

```json
[1, 2, 5, 8]
```

---

# Bookings 🧾

### Create Booking

`POST /api/bookings`
**Request JSON**

```json
{
  "sportId": 1,
  "venueId": 2,
  "facilityOwnerEmail": "owner@gmail.com",
  "userEmail": "user@gmail.com",
  "slots": [
    {
      "startDateTime": "2025-08-12T10:00:00",
      "endDateTime": "2025-08-12T12:00:00",
      "price": 50.00
    }
  ]
}
```

**Response**

```json
{
  "id": 1,
  "sportId": 1,
  "venueId": 2,
  "facilityOwnerEmail": "owner@gmail.com",
  "userEmail": "user@gmail.com",
  "slots": [ ... ],
  "status": "CONFIRMED",
  "totalPrice": 50.00,
  "createdAt": "2025-08-11T14:58:07.1935169"
}
```

---

### Get Booked Slots for Sport and Venue

`GET /api/bookings/slots?venueId={venueId}&sportId={sportId}`
**Response:** array of slot objects:

```json
[
  {
    "startDateTime": "2025-08-12T10:00:00",
    "endDateTime": "2025-08-12T12:00:00",
    "price": 50.00
  }
]
```

---

### Get Bookings By User

`GET /api/bookings/user/{email}`
**Response:** array of bookings for that user.

---

### Get Bookings By Facility Owner

`GET /api/bookings/getByOwner?ownerEmail=owner@venue.com`
**Response:** array of bookings for owner. 👤

---

### Delete Booking (Cancel)

`DELETE /api/bookings/cancelBooking/{id}`

* `204 No Content` on success ✅

---

### Get Facility Owner Earnings

`GET /api/bookings/earnings/{ownerEmail}`
**Response example**

```json
{
  "facilityOwnerEmail": "owner@gmail.com",
  "totalEarnings": 50.00,
  "lastUpdated": "2025-08-11T14:58:07.24623",
  "version": 0
}
```

---

### Monthly Trends

`GET /api/bookings/monthlyTrends?ownerEmail=owner@venue.com`
**Response:** array of 12 integers (Jan → Dec):

```json
[0,0,0,0,0,0,0,4,0,0,0,0]
```

---

### Daily Booking Trends for Months

`GET /api/bookings/monthlyTrendsofAMonth?ownerEmail=owner@venue.com`
**Response:** 12-element array (months); each month is a list of day numbers with bookings:

```json
[ [], [], [], [], [], [], [], [11,11,11,11], [], [], [], [] ]
```

> Consider adding `year` param to filter by year. 🗓️

---

# Comments 💬

### Add Comment

`POST /api/comments`
**Request JSON**

```json
{
  "text": "Great facilities and friendly staff!",
  "rating": 5,
  "authorEmail": "2023kucp1127@gmail.com",
  "sportId": 2,
  "venueId": 1,
  "parentCommentId": null
}
```

**Responses**

* `200 OK` or `201 Created` ✅
* `400 Bad Request` — invalid rating or fields ❌
* `404 Not Found` — referenced sport/venue/comment missing ⚠️

---

### Get Comments for Sport

`GET /api/comments/sport/{sportId}`
**Response:** array of comments (may include nested replies and author info). 🧾

---

# Refunds 💸

### Get All Refunds

`GET /api/refunds`
**Response:** array of refund objects:

```json
[
  {
    "id": 1,
    "userEmail": "sauvir@example.com",
    "ownerMail": "ayush@venue.com",
    "amount": "150.00",
    "bookingId": 1001,
    "status": "pending"
  },
  ...
]
```

---

### Create Refund

`POST /api/refunds`
**Request JSON**

```json
{
  "userEmail": "sauvir@example.com",
  "ownerMail": "ayush@venue.com",
  "amount": "150.00",
  "bookingId": 1001,
  "status": "pending"
}
```

* `201 Created` — created refund object ✅

---

### Get Pending Refunds

`GET /api/refunds/pending`

* Returns refunds where `status == "pending"` ⏳

---

### Get Refunds By Owner

`GET /api/refunds/owner?ownerMail={ownerMail}`

* Returns array of refund objects for owner. 👤

---

### Get Refunds By User

`GET /api/refunds/user?userEmail={userEmail}`

* Returns refunds for user.

---

### Get Refund By ID

`GET /api/refunds/byId?id={refundId}`

* Returns single refund object.

---

### Process Refund

`POST /api/refunds/process?id={id}`

* Sets `status = "done"` (after any business logic) ✅
* Returns updated refund object.

---

### Get Booking Details by Refund ID

`GET /api/refunds/bookingDetails?refundId={REFUNDID}`

* **Placeholder**: implement to return booking details associated with refund id. 🔧

---

### Delete Refund

`DELETE /api/refunds?id={refundId}`

* `204 No Content` on success ✅

---

# Misc / Utility 🛠️

### Get username (fullName) by email

`POST /getName?username={email}`
**Returns:** plain string full name (e.g. `Ayush Singh`) 🧾

---

### Ban User

`POST /ban?username={emailId}`
**Returns:** boolean `true` when ban succeeds ✅

---

### Facility Earnings (monthly)

`GET /api/earnings/{facilityowneremail}/monthly`
**Response:** array of 12 values (monthly earnings, Jan→Dec)

```json
[0,0,0,0,0,0,0,5600.00,0,0,0,0]
```

---

# Implementation Notes & Recommendations 💡

* **Authentication:** Protect endpoints with `Authorization: Bearer <JWT>`. Use `Principal` where appropriate to avoid passing email in requests. 🔐
* **Path vs Query Params for email:** Prefer `@RequestParam` for emails or use `@PathVariable` with regex `/{ownerEmail:.+}` and have client URL-encode `@` (`%40`) to avoid truncation. ✉️
* **HTTP verbs:**

  * Use `POST` for create, `GET` for reads, `PATCH` for partial updates (or `PUT` if documented), `DELETE` for deletes. 🔁
* **Validation:** Use `@Valid`, `@NotBlank`, `@Email` for incoming data. ✅
* **DTOs:** Do **not** return entities with password fields — map to DTOs omitting sensitive fields. 🚫🔒
* **Pagination:** Add `page`, `size`, `sort` to list endpoints (venues, bookings, comments) to avoid large responses. 📈
* **Consistent responses:** Keep return types consistent (arrays vs single objects). Return `201 Created` for successful creates and include `Location` header when possible. 📦
* **Error format:** Standardize error responses:

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Reason",
  "path": "/api/..."
}
```

* **Date handling:** Use ISO-8601 and define timezone expectations (UTC recommended). 🕒
* **Security:** Avoid exposing hashed passwords in any GET responses (remove `password` fields before returning user objects). 🔒
* **OpenAPI:** Consider auto-generating OpenAPI/Swagger spec (springdoc-openapi) — useful for Postman/Swagger UI. 📄

---

# cURL Examples 🧪

Create Venue:

```bash
curl -X POST "http://localhost:8080/api/venues?ownerEmail=owner%40example.com" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunshine Sports Complex",
    "description": "A premium facility ...",
    "address": "123 Main St",
    "photoUrls":["https://.../venue1.jpg"],
    "amenities":["Parking"],
    "rating": null,
    "ownerMail": "owner@example.com",
    "sportIds": []
  }'
```

Get Bookings By Owner:

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/bookings/getByOwner?ownerEmail=owner%40example.com"
```

Process Refund:

```bash
curl -X POST -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/refunds/process?id=12"
```

Get Monthly Trends:

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/bookings/monthlyTrends?ownerEmail=owner%40venue.com"
```

Get Daily Booking Trends (2D):

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/bookings/monthlyTrendsofAMonth?ownerEmail=owner%40venue.com"
```
