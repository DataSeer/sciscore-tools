/*
 * @prettier
 */

'use strict';

const express = require(`express`);
const router = express.Router();

const Sciscore = require(`../lib/sciscore.js`);

router.get(`/`, function (req, res) {
  return res.json({ err: false, res: true });
});

router.post(`/processFile`, function (req, res) {
  let filePath = req.body.filePath;
  if (!filePath) return res.json({ err: true, res: `filePath parameter must be set` });
  return Sciscore.processFile(
    {
      filePath: filePath
    },
    function (err, logs) {
      if (err) return res.json({ err: true, res: err });
      if (logs instanceof Error) return res.json({ err: true, res: logs.toString() });
      return res.json({ err: false, res: logs });
    }
  );
});

module.exports = router;
