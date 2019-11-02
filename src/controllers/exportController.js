const path = require('path');
const csv = require('csv');
const fs = require('fs');
const { Client: PostgreSqlClient } = require('pg');
const uuidV4 = require('uuid/v4');
const keys = require('../../config/keys');
const PgQueryStream = require('../util/pgQueryStream');

async function exportPostgreSql(req, sql, params, host, database, port, user, password) {
  // Setup database connection.
  const client = new PostgreSqlClient(
    {
      user, host, database, password, port,
    },
  );
  await client.connect();
  const query = new PgQueryStream(sql, params, {});
  const stream = client.query(query);
  // Create temporary file and write stream in append mode.
  const tempFile = path.join(__dirname, `${uuidV4()}.csv`);
  const tempFileWriteStream = fs.createWriteStream(tempFile, { flags: 'a' });
  // If header is present add it to the file.
  if (req.body.header !== undefined) {
    tempFileWriteStream.write(`${req.body.header}\n`);
  }
  // Start streaming database rows to the file.
  stream.pipe(csv.stringify()).pipe(tempFileWriteStream);
  // We need to wrap event emitters in promise in order to await them.
  const result = await new Promise((resolve, reject) => {
    stream.on('error', async (err) => {
      // There was an error. Release the client.
      console.log(err);
      await client.end();
      reject(err);
    });
    stream.on('end', async () => {
      // If footer is present add it to the file.
      if (req.body.footer !== undefined) {
        tempFileWriteStream.write(req.body.footer);
      }
      // Release the client when the stream is finished.
      await client.end();
      resolve(tempFile);
    });
  });

  return result;
}

async function exportDb(req, res) {
  const file = await exportPostgreSql(
    req, keys.dbSql, req.body.sqlParams, keys.dbHost, keys.dbDatabase, keys.dbPort, keys.dbUser,
    keys.dbPassword,
  );
  res.download(file, req.body.filename);
  res.on('finish', async () => {
    fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

module.exports = exportDb;
