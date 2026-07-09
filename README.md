# 🏋️ GearUp API

## 📌 প্রজেক্ট পরিচিতি

**GearUp** একটি Sports & Outdoor Gear Rental Backend API। এই প্ল্যাটফর্মের মাধ্যমে গ্রাহকরা বিভিন্ন ধরনের স্পোর্টস ও আউটডোর গিয়ার ভাড়া নিতে পারবেন, প্রোভাইডাররা তাদের গিয়ার ম্যানেজ করতে পারবেন এবং অ্যাডমিন পুরো সিস্টেম নিয়ন্ত্রণ করতে পারবেন।

---

# 🚀 Live Link

**Live API:** https://your-api-url.vercel.app

**GitHub Repository:** https://github.com/your-username/gearup-backend

---

# 🎯 প্রজেক্টের মূল বৈশিষ্ট্য

## 🌐 সাধারণ (Public)

- সকল গিয়ার দেখা
- ক্যাটাগরি অনুযায়ী ফিল্টার
- ব্র্যান্ড অনুযায়ী সার্চ
- দামের ভিত্তিতে ফিল্টার
- গিয়ারের বিস্তারিত তথ্য দেখা
- সকল ক্যাটাগরি দেখা

---

## 👤 Customer

- রেজিস্ট্রেশন ও লগইন
- গিয়ার ভাড়া নেওয়া
- রেন্টাল অর্ডার করা
- Stripe এর মাধ্যমে পেমেন্ট করা
- পেমেন্ট হিস্টোরি দেখা
- রেন্টাল স্ট্যাটাস ট্র্যাক করা
- রিভিউ দেওয়া
- নিজের প্রোফাইল ম্যানেজ করা

---

## 🏪 Provider

- রেজিস্ট্রেশন ও লগইন
- নতুন গিয়ার যোগ করা
- গিয়ার আপডেট করা
- গিয়ার ডিলিট করা
- স্টক ম্যানেজ করা
- কাস্টমারের অর্ডার দেখা
- অর্ডারের স্ট্যাটাস আপডেট করা

---

## 👑 Admin

- সকল ইউজার দেখা
- ইউজার Suspend / Activate করা
- সকল গিয়ার দেখা
- সকল রেন্টাল অর্ডার দেখা
- ক্যাটাগরি ম্যানেজ করা

---

# 🛠️ ব্যবহৃত প্রযুক্তি

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt
- Stripe Payment Gateway
- Cookie Parser
- CORS
- Zod Validation
- ESLint
- Prettier

---

# 📂 প্রজেক্ট স্ট্রাকচার

```
src/
│
├── app/
│   ├── modules/
│   │   ├── auth
│   │   ├── user
│   │   ├── gearItem
│   │   ├── category
│   │   ├── rental
│   │   ├── payment
│   │   ├── review
│   │
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│
├── prisma/
├── server.ts
└── app.ts
```

---

# 🔐 Authentication

এই প্রজেক্টে JWT Authentication ব্যবহার করা হয়েছে।

Protected Route ব্যবহার করতে হলে Request Header-এ Token পাঠাতে হবে।

```
Authorization: Bearer <Access Token>
```

---

# 👥 Role

| Role | কাজ |
|------|------|
| Customer | গিয়ার ভাড়া নেওয়া, পেমেন্ট, রিভিউ |
| Provider | গিয়ার ও অর্ডার ম্যানেজ করা |
| Admin | পুরো প্ল্যাটফর্ম নিয়ন্ত্রণ করা |

---

# 📦 API Endpoints

## Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

---

## Gear

- GET /api/gear
- GET /api/gear/:id

---

## Categories

- GET /api/categories

---

## Rental

- POST /api/rentals
- GET /api/rentals
- GET /api/rentals/:id

---

## Payment

- POST /api/payments/create
- POST /api/payments/confirm
- GET /api/payments
- GET /api/payments/:id

---

## Provider

- POST /api/provider/gear
- PUT /api/provider/gear/:id
- DELETE /api/provider/gear/:id
- GET /api/provider/orders
- PATCH /api/provider/orders/:id

---

## Review

- POST /api/reviews

---

## Admin

- GET /api/admin/users
- PATCH /api/admin/users/:id
- GET /api/admin/gear
- GET /api/admin/rentals

---

# 🗄️ Database Tables

### Users

- id
- name
- email
- password
- role
- status

### GearItems

- id
- providerId
- categoryId
- name
- description
- image
- brand
- condition
- pricePerDay
- stock
- availability

### Categories

- id
- name
- description

### RentalOrders

- id
- customerId
- gearItemId
- quantity
- startDate
- endDate
- totalAmount
- status

### Payments

- id
- rentalOrderId
- transactionId
- amount
- paymentMethod
- provider
- paymentStatus
- paidAt

### Reviews

- id
- customerId
- gearItemId
- rating
- comment

---

# 💳 Payment Flow

Customer

↓

Rental Order তৈরি

↓

Stripe Payment

↓

Payment Success

↓

Provider Order Confirm

↓

Customer Gear গ্রহণ

↓

Gear Return

↓

Review প্রদান

---

# ⚙️ Installation

### Repository Clone করুন

```bash
git clone https://github.com/your-username/gearup-backend.git
```

### Dependencies Install করুন

```bash
npm install
```

### .env ফাইল তৈরি করুন

```
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=

CLIENT_URL=
```

### Prisma Generate

```bash
npx prisma generate
```

### Migration Run করুন

```bash
npx prisma migrate dev
```

### Server চালু করুন

```bash
npm run dev
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing (Bcrypt)
- Role Based Access Control (RBAC)
- Input Validation
- Protected Routes

---

# 🧪 API Testing

API টেস্ট করার জন্য ব্যবহার করতে পারেন—

- Postman
- Thunder Client

---

# 👨‍💻 Developer

**Mahinur**

GitHub: https://github.com/your-username

---

# 📄 License

এই প্রজেক্টটি শিক্ষামূলক (Educational) উদ্দেশ্যে তৈরি করা হয়েছে।