import postgres from 'postgres';

async function setupAdmin() {
  console.log("Creating admin user...");
  try {
    const res = await fetch('http://localhost:3001/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        name: 'Admin Bangrajan',
        email: 'admin@bangrajan.test',
        password: 'adminpassword123',
        phone: '081200000000'
      })
    });
    
    const data = await res.json();
    if (!res.ok) {
        if (data.message === 'User already exists') {
            console.log("User already exists, just updating role...");
        } else {
            console.error("Failed to sign up:", data);
            return;
        }
    } else {
        console.log("Sign up successful. User ID:", data.user.id);
    }

    // Now update role to admin in the DB
    const sql = postgres('postgresql://postgres:kristo123@localhost:5432/bangrajan');
    await sql`UPDATE "user" SET role = 'admin' WHERE email = 'admin@bangrajan.test'`;
    console.log("Updated role to 'admin'.");
    await sql.end();
    
    console.log("Admin setup complete!");
    console.log("Email: admin@bangrajan.test");
    console.log("Password: adminpassword123");

  } catch(e) {
    console.error("Error setting up admin:", e);
  }
}
setupAdmin();
