Identity Reconciliation

Hi,

This is my solution for the Bitespeed Backend Task – Identity Reconciliation.
The goal of this task is to identify and link different contacts (email/phone) that belong to the same customer and return a consolidated response.

Live Deployment

The application is deployed on Render.

Base URL:

https://identity-reconciliation-4p10.onrender.com

Identify Endpoint:

POST https://identity-reconciliation-4p10.onrender.com/identify

Example Live Request

Method: POST
URL: https://identity-reconciliation-4p10.onrender.com/identify

Body: JSON

{
"email": "live@test.com
",
"phoneNumber": "11111"
}

Example Live Response

{
"contact": {
"primaryContatctId": 5,
"emails": [
"live@test.com
"
],
"phoneNumbers": [
"11111"
],
"secondaryContactIds": []
}
}

Tech Stack Used-

Node.js

Express

TypeScript

PostgreSQL (Neon Cloud)

Prisma ORM

Render (Deployment)

I used PostgreSQL because it handles relational data well and Prisma makes database operations easier and cleaner.

Problem Understanding

Customers can place orders using:

Same email

Same phone number

Different email but same phone

Different phone but same email

Because of this, multiple rows in the database can belong to the same person.

We need to:

Find related contacts using email or phone

Link them together

Keep the oldest contact as primary

Mark others as secondary

Return consolidated contact details

How It Works

If no existing contact is found:

A new contact is created

It is marked as "primary"

If matching contact exists:

All related contacts are fetched

The oldest one is selected as primary

If multiple primaries exist, the older one stays primary

Other primaries are converted to secondary

If a new email or phone is provided:

A new secondary contact is created

It is linked to the primary contact

API Endpoint

POST /identify

Request Body (JSON)

{
"email": "string (optional)",
"phoneNumber": "string (optional)"
}

At least one field is required.

Example Request

{
"email": "mcfly@hillvalley.edu
",
"phoneNumber": "123456"
}

Example Response

{
"contact": {
"primaryContatctId": 1,
"emails": [
"lorraine@hillvalley.edu
",
"mcfly@hillvalley.edu
"
],
"phoneNumbers": [
"123456"
],
"secondaryContactIds": [23]
}
}

Database Schema

The Contact table contains:


id

email

phoneNumber

linkedId

linkPrecedence (primary / secondary)


createdAt

updatedAt

deletedAt

The oldest contact (based on createdAt) is always treated as primary.

How To Run Locally

Clone the repository:

git clone https://github.com/Vaishnavi3839/Identity-Reconciliation.git

cd Identity-Reconciliation

Install dependencies:

npm install

Create a .env file and add:

DATABASE_URL=your_database_connection_string
PORT=3000

Run Prisma migration:

npx prisma migrate dev --name init

Start the server:

npm run dev

Server will run at:

http://localhost:3000


Assumptions Made

At least one of email or phoneNumber will always be provided.

Contacts are linked if either email or phone matches.

The oldest contact becomes primary.

Soft delete (deletedAt) is not handled in this version.

Possible Improvements

If I had more time, I would:

Add proper input validation

Add unit test cases

Use database transactions for safer updates

Add logging

Add Docker support

Repository Link

GitHub Repository:

https://github.com/Vaishnavi3839/Identity-Reconciliation

My Learning:
This project helped me understand how to handle relational data and merge records correctly. It also helped me think about edge cases while designing backend logic.

Thank you for reviewing my submission.
