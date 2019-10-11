# table-reservation
A simple NodeJS table reservation backend API, using Express, Knex and MySQL

---

# Requirements:
- NodeJS
- MySQL

---

#Get up and running:

`cd ~/Desktop`

`git clone git@github.com:olehmelnyk/table-reservation.git`

`cd table-reservation`

`npm run firstrun`

Server should start on localhost:3000

---

#REST
###GET  /api/reservations/:id
Return reservation by id

```javascript
{
    "id": 234,
    "table_id": 1,
    "reservation_start": "2019-10-10T21:10:00.000Z",
    "reservation_end": "2019-10-10T21:15:00.000Z",
    "guests": 8
}
```

###POST /api/reservations
Create a new reservation
```javascript
{
	"startDate": "2019-10-11 00:10:00",
	"endDate": "2019-10-11 00:15:00",
	"guests": 8
}
```
Returns reservation ID

###PUT /api/reservations/id
Update reservation by id
```javascript
{
	"startDate": "2019-10-11 00:10:00",
	"endDate": "2019-10-11 00:15:00",
	"guests": 8
}
```

###DELETE /api/reservations/id
Delete reservations by id

---
#TODO:
- fix SQL for selecting free tables
- add data validation
- refactor, restructure, modularise
- move all settings/variables to config file
- mode dev DB seeds/etc to dev folder