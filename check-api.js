async function test() {
  try {
    const response = await fetch('https://prixuslabs.in/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', message: 'Test' })
    });
    console.log(response.status);
    console.log(await response.text());
  } catch(e) {
    console.error(e);
  }
}
test();
