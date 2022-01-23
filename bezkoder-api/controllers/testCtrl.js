const redisClient = require("../utils/redis");

exports.sendDataToRedis = async (req, res) => {
  redisClient.set('xml', JSON.stringify(req.body), (setError, setReply) => {
    if (setError) {
      return res.status(500).send('Failed');
    } else {
      return res.status(200).send('Success');
    }
  });
};