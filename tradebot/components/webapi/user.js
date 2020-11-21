const express = require('express');
const User = require('../database/user');
const ApiKey = require('../database/apikeys');

module.exports = (async () => {
  const router = express.Router();

  router.get('/info', async (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: false, reason: 'not logged in', });

    if (req.user.type === 'apikey') {
      const apikey = await ApiKey.getByKeyid(req.user.keyid);
      if (!apikey.data) {
        return res.status(500).json({ status: false, reason: 'unable to find api key', details: apikey.reason || null });
      }

      if (!apikey.data.scopes || !apikey.data.scopes.contains('userProfile')) {
        return res.status(401).json({ status: false, reason: 'this apikey does not have the `userProfile` scope'});
      }
    }

    const user = await User.find(req.user.userid);
    if (!user.data) {
      return res.status(500).json({ status: false, reason: 'unable to load user data', details: user.reason || null});
    }

    return res.status(200).json(user.data);
  });

  await User.ready;
  await ApiKey.ready;
  return { router };
})();
