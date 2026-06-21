import 'dotenv/config';
import { createAuth } from './src/config/auth.config.js';

const auth = createAuth(
  process.env.DATABASE_URL,
  process.env.BETTER_AUTH_URL,
  process.env.BETTER_AUTH_SECRET
);

async function run() {
  const req = new Request('http://localhost:3001/api/auth/forget-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3001'
    },
    body: JSON.stringify({ email: 'kristodalope01@gmail.com', redirectTo: 'http://localhost:3000/reset-password' })
  });
  
  const res = await auth.handler(req);
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}

run();
