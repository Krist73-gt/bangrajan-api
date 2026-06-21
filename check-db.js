import 'dotenv/config';
import postgres from 'postgres';

async function check() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gallery_images';
    `;
    console.log("Columns in gallery_images:");
    console.log(res);
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
check();
