import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const {
  DB_HOST = "db",
  DB_PORT = "3306",
  DB_USER = "user",
  DB_PASS = "password",
  DB_NAME = "poisoned_site",
} = process.env;

const seedPool = await mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  connectionLimit: 10,
});

const users = [
  { username: "admin", password: "Admin1234", role: "admin" },
  { username: "alice", password: "User1234", role: "user" },
];

for (const u of users) {
  const hash = await bcrypt.hash(u.password, 12);
  await seedPool.execute(
    `INSERT INTO users (username, password_hash, role)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    [u.username, hash, u.role]
  );
  console.log(`Seeded ${u.username}`);
}

await seedPool.end();
console.log("Seeding complete.");
