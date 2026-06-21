import postgres from 'postgres';

async function create() {
  const sql = postgres('postgresql://postgres:kristo123@localhost:5432/postgres');
  try {
    await sql`CREATE DATABASE bangrajan;`;
    console.log("Database 'bangrajan' created successfully.");
  } catch(e) {
    if (e.code === '42P04') {
        console.log("Database 'bangrajan' already exists.");
    } else {
        console.error("Error creating database:", e);
    }
  } finally {
    await sql.end();
  }
}
create();
