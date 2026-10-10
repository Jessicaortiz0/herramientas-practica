const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

test('API: secuencia completa, validación, PUT/PATCH y errores', async () => {
  const server = spawn(process.execPath, ['dist/main.js'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  server.stdout.on('data', (data) => { logs += data; });
  server.stderr.on('data', (data) => { logs += data; });
  const request = (method, path = '/Usuarios', body) => fetch(`http://127.0.0.1:3000${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  try {
    let ready = false;
    for (let i = 0; i < 1200; i++) {
      if (server.exitCode !== null) throw new Error(logs);
      if (logs.includes('API disponible')) { ready = true; break; }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, `El servidor no inició: ${logs}`);
    let response = await request('GET');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [{ id: 1, nombre: 'Jessica', edad: 19 }, { id: 2, nombre: 'Diego', edad: 20 }]);
    response = await request('PUT', '/Usuarios/1', { nombre: 'Jessica Ortiz', edad: 20 });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { id: 1, nombre: 'Jessica Ortiz', edad: 20 });
    response = await request('PATCH', '/Usuarios/2', { edad: 21 });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { id: 2, nombre: 'Diego', edad: 21 });
    response = await request('DELETE', '/Usuarios/2');
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Usuario #2 eliminado');
    response = await request('GET');
    assert.deepEqual(await response.json(), [{ id: 1, nombre: 'Jessica Ortiz', edad: 20 }]);
    for (const body of [{ edad: 20 }, { nombre: 'Jessica' }, {}, { nombre: '', edad: 20 }, { nombre: '   ', edad: 20 }, { nombre: 5, edad: 20 }, { nombre: 'Jessica', edad: -1 }, { nombre: 'Jessica', edad: 1.5 }, { nombre: 'Jessica', edad: '20' }, { nombre: 'Jessica', edad: 20, id: 8 }]) {
      assert.equal((await request('PUT', '/Usuarios/1', body)).status, 400, JSON.stringify(body));
    }
    for (const body of [{ edad: null }, { nombre: null }, { nombre: '' }, { edad: -1 }, { edad: 2.5 }, { edad: '21' }, { id: 9 }]) {
      assert.equal((await request('PATCH', '/Usuarios/1', body)).status, 400, JSON.stringify(body));
    }
    response = await request('PATCH', '/Usuarios/1', { nombre: 'Jessica Ortiz' });
    assert.deepEqual(await response.json(), { id: 1, nombre: 'Jessica Ortiz', edad: 20 });
    assert.equal((await request('PATCH', '/Usuarios/1', {})).status, 200);
    assert.equal((await request('PATCH', '/Usuarios/1', { edad: 0 })).status, 200);
    for (const [method, body] of [['PUT', { nombre: 'Nadie', edad: 0 }], ['PATCH', { edad: 0 }], ['DELETE', undefined]]) {
      assert.equal((await request(method, '/Usuarios/999', body)).status, 404);
    }
    assert.equal((await request('DELETE', '/Usuarios/2')).status, 404);
    assert.equal((await request('DELETE', '/Usuarios/abc')).status, 400);
    assert.equal((await request('GET', '/usuarios')).status, 404);
    assert.equal((await request('GET', '/USUARIOS')).status, 404);
    for (const [method, body] of [['PUT', { nombre: 'Jessica', edad: 20 }], ['PATCH', { edad: 20 }], ['DELETE', undefined]]) {
      assert.equal((await request(method, '/usuarios/1', body)).status, 404);
    }
  } finally {
    server.kill();
    await new Promise((resolve) => { if (server.exitCode !== null) resolve(); else server.once('exit', resolve); });
  }
});
