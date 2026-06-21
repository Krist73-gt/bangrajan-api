import postgres from 'postgres';

async function listUsers() {
  const sql = postgres('postgresql://postgres:kristo123@localhost:5432/bangrajan');
  try {
    const users = await sql`SELECT id, name, email, role FROM "user";`;
    console.log("Users in DB:", users);
  } catch(e) {
    console.error("Error getting users:", e);
  } finally {
    await sql.end();
  }
}
listUsers();
