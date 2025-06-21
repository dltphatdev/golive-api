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

## DATABASE - MySQL - Prisma

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

* B1/ Kiểm tra xem hôm nay user đã có step log chưa: Nếu có thì cập nhật steps + updated_at vào DB. Ngược lại thì tạo mới ngày ghi nhận step và cho steps bắt đầu từ 0
* B2/ Kiểm tra nếu steps >= 5000 thì cộng spoint vào spoint_earned=5000
* B3/ Kiểm tra chuỗi liên tiếp: kiểm tra xem hôm ngày trước đó có log ko và kiểm tra log đó có steps >= 5000 ko?. Nếu có thì count + 1. Ngược lại thì sẽ tạo mới StreakLog
* B4/ Dựa theo mốc thưởng: Chuỗi ngày = 2day: 200spoint, 7day: 700spoint, 10day: 1000spoint, 15day: 1500spoint, 30day: 30000spoint, 60day:60000spoint, 100day: 100000spoint → cộng thêm Spoint tương ứng

- Ý tưởng sẽ code backend:

```js
const router = express.Router();

// Mốc thưởng chuỗi ngày
const STREAK_BONUS: Record<number, number> = {
  2: 200,
  7: 700,
  10: 1000,
  15: 1500,
  30: 3000,
  60: 6000,
  100: 10000,
};

// POST /steps/update
router.post("/steps/update", async (req, res) => {
  try {
    const { userId, steps, startTime, endTime } = req.body;

    if (!userId || !steps || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000); // seconds
    const today = dayjs().startOf("day").toDate();
    const yesterday = dayjs().subtract(1, "day").startOf("day").toDate();

    // Tìm log hiện tại
    let stepLog = await prisma.stepLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    // Nếu chưa có log → tạo mới
    if (!stepLog) {
      stepLog = await prisma.stepLog.create({
        data: {
          userId,
          date: today,
          steps,
          spointEarned: 0,
          startTime: start,
          endTime: end,
          duration,
        },
      });
    } else {
      // Nếu đã có log → cập nhật
      stepLog = await prisma.stepLog.update({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        data: {
          steps,
          // chỉ ghi startTime nếu chưa có
          startTime: stepLog.startTime ?? start,
          endTime: end,
          duration: (stepLog.duration ?? 0) + duration,
        },
      });
    }

    let totalSpoint = 0;

    // Nếu đủ 5000 bước và chưa cộng Spoint
    if (steps >= 5000 && stepLog.spointEarned === 0) {
      await prisma.$transaction([
        prisma.stepLog.update({
          where: {
            userId_date: {
              userId,
              date: today,
            },
          },
          data: {
            spointEarned: 5000,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { spoint: { increment: 5000 } },
        }),
      ]);

      totalSpoint += 5000;

      // Xử lý chuỗi ngày liên tiếp
      const streak = await prisma.streakLog.findUnique({
        where: { userId },
      });

      const yesterdayStep = await prisma.stepLog.findUnique({
        where: {
          userId_date: {
            userId,
            date: yesterday,
          },
        },
      });

      if (streak && yesterdayStep && yesterdayStep.steps >= 5000) {
        const newCount = streak.count + 1;

        await prisma.streakLog.update({
          where: { userId },
          data: {
            count: newCount,
            lastDate: today,
          },
        });

        // Thưởng nếu đạt mốc
        if (STREAK_BONUS[newCount]) {
          const bonus = STREAK_BONUS[newCount];
          await prisma.user.update({
            where: { id: userId },
            data: { spoint: { increment: bonus } },
          });
          totalSpoint += bonus;
        }
      } else {
        // Bắt đầu chuỗi mới
        await prisma.streakLog.upsert({
          where: { userId },
          create: {
            userId,
            startDate: today,
            lastDate: today,
            count: 1,
          },
          update: {
            startDate: today,
            lastDate: today,
            count: 1,
          },
        });
      }
    }

    return res.json({
      message: "Cập nhật bước chân thành công",
      totalSpoint,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;

```

- API:

✅ Route GET /steps/summary?userId=1
API BE

```js
// Route lấy thông tin tổng hợp bước chân của hôm nay + streak + biểu đồ 7 ngày gần nhất
router.get("/steps/summary", async (req, res) => {
	try {
		const userId = parseInt(req.query.userId as string);
		if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

		const today = dayjs().startOf("day").toDate(); // Ngày hiện tại (bắt đầu từ 00:00)
		const startChartDate = dayjs().subtract(6, "day").startOf("day").toDate(); // Bắt đầu biểu đồ: 6 ngày trước

		// Truy vấn song song:
		// - Log bước chân hôm nay
		// - Chuỗi ngày streak
		// - Log 7 ngày gần nhất
		const [todayLog, streak, chartLogs] = await Promise.all([
			prisma.stepLog.findUnique({
				where: {
					userId_date: {
						userId,
						date: today,
					},
				},
			}),
			prisma.streakLog.findUnique({
				where: { userId },
			}),
			prisma.stepLog.findMany({
				where: {
					userId,
					date: {
						gte: startChartDate,
					},
				},
				orderBy: {
					date: "asc",
				},
			}),
		]);

		// Chuẩn hóa dữ liệu biểu đồ: luôn đủ 7 ngày, dù không có log
		const chartData = [];
		for (let i = 0; i < 7; i++) {
			const date = dayjs().subtract(6 - i, "day").startOf("day");
			const log = chartLogs.find((l) => dayjs(l.date).isSame(date, "day"));
			chartData.push({
				date: date.format("YYYY-MM-DD"),
				steps: log?.steps ?? 0,
			});
		}

		// Trả về JSON dữ liệu UI cần
		return res.json({
			today: {
				date: dayjs(today).format("YYYY-MM-DD"),
				steps: todayLog?.steps ?? 0,
				spointEarned: todayLog?.spointEarned ?? 0,
				completed: (todayLog?.steps ?? 0) >= 5000,
			},
			streakCount: streak?.count ?? 0,
			chartData,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

```

- RESPONE CLIENT:

```json
{
  "today": {
    "date": "2025-06-22",
    "steps": 5500,
    "spointEarned": 5000,
    "completed": true
  },
  "streakCount": 4,
  "chartData": [
    { "date": "2025-06-16", "steps": 5000 },
    { "date": "2025-06-17", "steps": 5200 },
    { "date": "2025-06-18", "steps": 3000 }
  ]
}
```

✅ Route GET /steps/history
API BE

```js
// Route lấy lịch sử các ngày có log bước chân (dùng cho danh sách hoạt động)
router.get("/steps/history", async (req, res) => {
	try {
		const userId = parseInt(req.query.userId as string);
		if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

		// Truy vấn các bản ghi bước chân gần đây, sắp xếp theo ngày mới nhất
		const logs = await prisma.stepLog.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: 30, // Giới hạn lấy 30 ngày gần nhất
		});

		// Chuyển về dạng dễ đọc hơn
		const result = logs.map((log) => ({
			date: dayjs(log.date).format("YYYY-MM-DD"),
			steps: log.steps,
			spointEarned: log.spointEarned,
		}));

		return res.json({ history: result });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

```

RESPONE CLIENT:

```json
{
  "history": [
    { "date": "2025-06-22", "steps": 5500, "spointEarned": 5000 },
    { "date": "2025-06-21", "steps": 5600, "spointEarned": 5000 }
  ]
}
```
