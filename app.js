const pg = require('pg');
const request = require('request');
const dbConfig = require('./database.json');

const pool = new pg.Pool(dbConfig);

const panicIf = err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
};

const range = (from = 1, to = 10) => {
  return new Array(to - from).fill(0).map((ele, idx) => idx + from);
};

const places = (length = 1) => {
  return range(1, length + 1)
    .map(e => `($${e})`)
    .join(', ');
};

const save = (records, callback) => {
  const val = places(records.length);
  const sql = `INSERT INTO records (body) VALUES ${val}`;
  pool.query(sql, records, callback);
};

const opts = (page = 1) => {
  return {
    method: 'GET',
    uri: 'https://hub.docker.com/api/content/v1/products/search',
    qs: {
      type: 'image',
      q: '',
      page_size: 100,
      page,
    },
    headers: {
      // getting around what is probably the previous attempt at API limiting
      Referer: `https://hub.docker.com/search?q=&type=image&page=${page}`,
      'Search-Version': 'v3',
    },
    json: true,
  };
}

const getPage = (page = 1) => {
  console.log(`get: ${page}`);
  request.get(opts(page), (err, res, body) => {
    panicIf(err);
    const {next, summaries} = body;

    if (res.statusCode !== 200) {
      console.error(`status was ${res.statusCode}`);
      process.exit(1);
    }

    save(summaries, err => {
      panicIf(err);
      if (next) {
        getPage(page + 1);
      } else {
        pool.end().then(() => {
          process.exit(0);
        });
      }
    });
  });
};

getPage(1);
