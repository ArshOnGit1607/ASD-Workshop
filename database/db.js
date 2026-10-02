const fs = require('fs/promises');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

async function read() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function write(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

read.read = read;
read.write = write;

module.exports = read;