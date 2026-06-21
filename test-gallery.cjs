const fs = require('fs');

async function run() {
  try {
    // We can just use the built-in FormData in Node 18+
    const formData = new FormData();
    formData.append('title', 'Test Image');
    
    // Convert a file to a blob
    const fileBuffer = fs.readFileSync('test.png');
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    console.log("Sending FormData POST...");
    const res = await fetch('http://127.0.0.1:3001/api/website/gallery', {
      method: 'POST',
      body: formData
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());

  } catch (e) {
    console.error(e);
  }
}
run();
