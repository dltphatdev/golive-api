# 🚀 Express.js REST API Boilerplate Golive

A production-ready, modular, and scalable REST API using [Express.js], JWT Authentication, and MySQL. Perfect for powering web & mobile applications.

---

## 📦 Features

- ✅ Express.js
- 🔐 JWT Authentication (Login/Register)
- 🔄 Modular Route Handling
- 🧱 MySQL with Prisma
- 🌐 CORS & Helmet for Security
- 🛠️ Environment Config via `.env`
- 🪝 Centralized Error Handling
- 📁 Clean & Scalable Project Structure

---

## 🧬 Tech Stack

- [Node.js]
- [Express.js]
- [TypeScript]
- [MySQL]
- [JWT]
- [dotenv]
- [NodeMailler]
- [Formidable]
- [Prisma]

---

## 📁 Folder Structure

Golive-root/
├── src/
│ ├── backup/
│ ├── templates/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── index.ts
│ ├── type.d.ts
│ └── services/
├── .env # Environment variables
├── .gitignore
├── package.json
└── README.md

## 🧬 Task Project

- User API: Register, Login, Logout, Forgot Password, Verify Account, Refresh Token Expires In, Change Password, Get Profile, Update Profile, Change Password, Upload Avatar Profile, Login with remember me

## 📁 DATABASE - MySQL - Prisma

1. Enum main

```prisma
enum UserVerifyStatus {
  Unverified
  Verified
  Banned
}

enum UserGender {
  Male
  FeMale
}

```

2. Các bảng của dự án:

- Table User: ghi lại các thông tin của người dùng

```prisma
model User {
  id                   Int              @id @default(autoincrement())
  email                String           @unique
  forgot_password_code String?
  verify_code          String?
  password             String
  fullname             String?
  verify               UserVerifyStatus @default(Unverified)
  avatar               String?          @db.VarChar(255)
  address              String?
  phone                String?
  gender               UserGender       @default(Male)
  date_of_birth        DateTime?
  created_at           DateTime         @default(now())
  updated_at           DateTime?
  spoint    Int       @default(0) // điểm tích lũy
  stepLogs  StepLog[] // Mối quan hệ 1 - N (1 user có thể có nhiều log bước chân)
  @@index([password])
}
```

- Table RefreshToken: ghi lại các thông tin của token

```prisma
model RefreshToken {
  id      Int      @id @default(autoincrement())
  token   String   @unique @db.VarChar(512)
  user_id Int
  iat     DateTime
  exp     DateTime
  @@index([exp])
}
```

- Table StepLog: ghi lại số bước chân mỗi ngày

```prisma
model StepLog {
  id           Int      @id @default(autoincrement())
  user_id       Int
  date         DateTime // ngày ghi nhận (reset theo ngày)
  steps        Int // số bước chân
  spoint_earned Int      @default(0) // số spoint đã cộng trong 1 ngày
  start_time DateTime // thời gian bắt đầu tham gia tính bước chân
  last_time DateTime // thời gian gần nhất tham gia tính bước chân
  created_at    DateTime @default(now()) // thời điểm tạo ra log
  updated_at    DateTime? // thời điểm cập nhật lại log
  user         User     @relation(fields: [user_id], references: [id])

  @@unique([user_id, date]) // mỗi user chỉ có 1 bản ghi mỗi ngày
}
```

- Table StreakLog: thông tin theo dõi chuỗi ngày được cộng điểm liên tiếp

```prisma
model StreakLog {
  id         Int      @id @default(autoincrement())
  user_id     Int
  start_date  DateTime // ngày bắt đầu chuỗi
  last_date   DateTime // ngày gần nhất ghi nhận thành công
  count      Int      // số ngày liên tiếp
  created_at  DateTime @default(now())
  updated_at  DateTime?
  user       User     @relation(fields: [user_id], references: [id])
}
```

3. Ghi chú:

- Luồng xử lý về bước chân user:

* B1/ Kiểm tra xem hôm nay user đã có step log chưa: Nếu có thì cập nhật steps vào database. Ngược lại thì tạo mới ngày ghi nhận step và cho steps bắt đầu từ 0
* B2/ Kiểm tra nếu steps >= 5000 thì cộng spoint vào spoint_earned=5000
* B3/ Kiểm tra chuỗi liên tiếp: kiểm tra xem hôm ngày trước đó có log ko và kiểm tra log đó có steps >= 5000 ko?. Nếu có thì count + 1. Ngược lại thì sẽ tạo mới StreakLog
* B4/ Dựa theo mốc thưởng: Chuỗi ngày = 2day: 200spoint, 7day: 700spoint, 10day: 1000spoint, 15day: 1500spoint, 30day: 30000spoint, 60day:60000spoint, 100day: 100000spoint → cộng thêm Spoint tương ứng
