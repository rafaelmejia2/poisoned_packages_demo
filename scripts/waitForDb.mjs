import mysql from "mysql2/promise";

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_USER = "user",
  DB_PASS = "password",
  DB_NAME = "poisoned_site",
} = process.env;

async function wait() {
  const start = Date.now();
  while (true) {
    try {
      const conn = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
      });
      await conn.ping();
      await conn.end();
      console.log("DB is ready.");
      break;
    } catch (e) {
      const ms = Date.now() - start;
      if (ms > 60_000) {
        // 60s timeout
        console.error("DB did not become ready in time.", e.message);
        process.exit(1);
      }
      console.log("Waiting for DB...", e.message);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
wait();
