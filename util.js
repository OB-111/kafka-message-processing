const fs = require('fs');
const readline = require('readline');

function readAllLines(path) {    
  return new Promise((resolve, reject) => {
    // Test file access directly, so that we can fail fast.
    // Otherwise, an ENOENT is thrown in the global scope by the readline internals.
    try {
      fs.accessSync(path, fs.constants.R_OK);
    } catch (err) {
      reject(err);
    }
    
    let lines = [];
    
    const reader = readline.createInterface({
      input: fs.createReadStream(path),
      crlfDelay: Infinity
    });
    
    reader
      .on('line', (line) => lines.push(line))
      .on('close', () => resolve(lines));
  });
}

exports.configFromPath = async function configFromPath(path) {
  const lines = await readAllLines(path);
  return lines
    .filter((line) => !/^\s*$|^\s*?#/.test(line)) // ignore comments and whitespace-only lines
    .map((line) => line
      .split(/=(.*)/) // the (.*) group causes split only on the first occurrence since values can contain equals signs
      .map((s) => s.trim())
    )
    .reduce((config, [k, v]) => {
      config[k] = v;
      return config;
    }, {});
};