// Smoke test for orders API and production stock decrement
// Usage: node scripts/test-orders.js

async function run(){
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('Base URL:', base);

  const prodRes = await fetch(base + '/api/production');
  if (!prodRes.ok) { console.error('Failed to fetch production'); process.exit(2); }
  const production = await prodRes.json();
  if (!Array.isArray(production) || production.length === 0) { console.error('No production data'); process.exit(2); }

  // pick first available sabor with at least 1 available
  const choice = production.find(p => (Number(p.producidas || 0) - Number(p.vendidas || 0)) > 0);
  if (!choice) { console.error('No available sabor to test'); process.exit(2); }

  const sabor = choice.sabor;
  const prevVendidas = Number(choice.vendidas || 0);
  console.log('Chosen sabor:', sabor, 'prev vendidas:', prevVendidas);

  const orderPayload = {
    client_name: 'Smoke Test',
    items: [ { sabor, units: 1, unit_price: Number(choice.precio || 6) } ]
  };

  const createRes = await fetch(base + '/api/orders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(orderPayload) });
  const created = await createRes.json();
  if (!createRes.ok) { console.error('Create order failed:', created); process.exit(3); }
  console.log('Created order id:', created.id);

  // fetch production again
  const prodRes2 = await fetch(base + '/api/production');
  const production2 = await prodRes2.json();
  const updated = production2.find(p => p.sabor === sabor);
  const newVendidas = Number(updated.vendidas || 0);
  console.log('New vendidas for', sabor, ':', newVendidas);

  if (newVendidas === prevVendidas + 1) {
    console.log('SMOKE TEST PASSED');
    process.exit(0);
  } else {
    console.error('SMOKE TEST FAILED - vendidas did not increment as expected');
    process.exit(4);
  }
}

run().catch(e=>{ console.error(e); process.exit(99); });
