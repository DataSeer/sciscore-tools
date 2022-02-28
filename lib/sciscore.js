/*
 * @prettier
 */

'use strict';

const child_process = require(`child_process`);
const path = require(`path`);
const fs = require(`fs`);

const cheerio = require(`cheerio`);

const Self = {};

/**
 * Process the given file
 * @param {object} opts - Options available
 * @param {string} opts.filePath - File path
 * @param {function} cb - Callback function(err, res) (err: error process OR null, res: document instance OR undefined)
 * @returns {undefined} undefined
 */
Self.processFile = function (opts = {}, cb) {
  // Check params are set
  if (!opts.filePath || typeof opts.filePath !== `string`)
    return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid string (not empty)`));
  // Check filePath param
  let absoluteFilePath = opts.filePath.split(`/data/`)[1];
  if (!absoluteFilePath || typeof absoluteFilePath !== `string`)
    return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid path (can't extract filename)`));
  let filePath = path.resolve(__dirname, `../data`, absoluteFilePath);
  return fs.stat(filePath, function (err, fileStats) {
    if (err) return cb(err);
    if (!fileStats.isFile())
      return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid path (file not found)`));
    // Build outDir
    let outDir = path.dirname(filePath);
    return fs.stat(outDir, function (err, dirStats) {
      if (err) return cb(err);
      if (!dirStats.isDirectory())
        return cb(
          null,
          new Error(`Bad value : opts.filePath parameter must be a valid path (parent directory not found)`)
        );
      // Build fileId
      let fileId = outDir.split(path.sep).pop();
      if (!fileId) return cb(new Error(`fileId not found`));
      // Send data to python script
      let options = {
        cwd: __dirname
      };
      return child_process.exec(
        `python3 ${path.join(__dirname, `run.py`)} '${filePath}' '${fileId}' '${outDir}'`,
        options,
        function (error, stdout, stderr) {
          console.log(error, stdout, stderr);
          if (error) return cb(error);
          // logs is an array consisting of messages collected during execution
          return cb(null, { stdout: stdout.split(`\n`), stderr: stderr.split(`\n`) });
        }
      );
    });
  });
};

/**
 * Process the sentences of the given TEI file
 * @param {object} opts - Options available
 * @param {string} opts.filePath - File path
 * @param {function} cb - Callback function(err, res) (err: error process OR null, res: document instance OR undefined)
 * @returns {undefined} undefined
 */
Self.processSentences = function (opts = {}, cb) {
  // Check params are set
  if (!opts.filePath || typeof opts.filePath !== `string`)
    return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid string (not empty)`));
  // Check filePath param
  let absoluteFilePath = opts.filePath.split(`/data/`)[1];
  if (!absoluteFilePath || typeof absoluteFilePath !== `string`)
    return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid path (can't extract filename)`));
  let filePath = path.resolve(__dirname, `../data`, absoluteFilePath);
  return fs.stat(filePath, function (err, fileStats) {
    if (err) return cb(err);
    if (!fileStats.isFile())
      return cb(null, new Error(`Bad value : opts.filePath parameter must be a valid path (file not found)`));
    // Build outDir
    let outDir = path.dirname(filePath);
    return fs.stat(outDir, function (err, dirStats) {
      if (err) return cb(err);
      if (!dirStats.isDirectory())
        return cb(
          null,
          new Error(`Bad value : opts.filePath parameter must be a valid path (parent directory not found)`)
        );
      let xmlString = fs.readFileSync(filePath, `utf8`);
      if (typeof xmlString !== `string`) return cb(null, new Error(`Bad content : should contain text`));
      const $ = cheerio.load(xmlString.replace(/\n\s*/gm, ``), {
        xmlMode: true
      });
      if (!Object.keys($).length) return cb(null, new Error(`Bad content : should be a valid XML TEI`));
      let txt = $(`s[xml\\:id]`)
        .map(function (i, el) {
          return $(el).text();
        })
        .get()
        .join(`\n`);
      let txtPath = `${filePath}.sentences.txt`;
      fs.writeFileSync(txtPath, txt);
      // Build fileId
      let fileId = outDir.split(path.sep).pop();
      if (!fileId) return cb(new Error(`fileId not found`));
      // Send data to python script
      let options = {
        cwd: __dirname
      };
      return child_process.exec(
        `python3 ${path.join(__dirname, `run.py`)} '${txtPath}' '${fileId}' '${outDir}'`,
        options,
        function (error, stdout, stderr) {
          console.log(error, stdout, stderr);
          if (error) return cb(error);
          // logs is an array consisting of messages collected during execution
          return cb(null, { stdout: stdout.split(`\n`), stderr: stderr.split(`\n`) });
        }
      );
    });
  });
};

module.exports = Self;
