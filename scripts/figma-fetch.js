#!/usr/bin/env node

const https = require('https');

const TOKEN = process.env.FIGMA_API_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;

if (!TOKEN || !FILE_ID) {
  console.error('Missing FIGMA_API_TOKEN or FIGMA_FILE_ID in .env.local');
  process.exit(1);
}

function fetchFigma(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: `/v1/${endpoint}`,
      method: 'GET',
      headers: {
        'X-FIGMA-TOKEN': TOKEN,
      },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const file = await fetchFigma(`files/${FILE_ID}`);
    console.log(JSON.stringify(file, null, 2));
  } catch (error) {
    console.error('Error fetching Figma file:', error.message);
    process.exit(1);
  }
}

main();
