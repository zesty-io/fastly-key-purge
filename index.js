require('env-yaml').config();

exports.fastlyKeyPurge = (req, res) => {
  const cors = require("cors")();

  cors(req, res, () => {
    exportFastlyKeyPurge(req, res);
  });
};


const exportFastlyKeyPurge = async (req, res) => {
  // error handling
  if (req.method !== "POST") {
    return res.status(400).send("Error: expected HTTP POST.");
  }

  // optional auth key
  if(process.env.SERVICE_KEY != ''){
    if (!req.get("X-Auth")) {
      return res.status(400).send(`Error: Requires "X-Auth" header with Service Key`);
    }

    let authKey = req.get("X-Auth");
    if(authKey !== process.env.SERVICE_KEY){
        return res.status(400).send("Error: service key does not match.");
    }
  }
  
  var cacheTags = JSON.parse(req.body)
  
  /*{
      "objects": [
          "ZUID"
      ]
  }*/

  var fastly = require('fastly')(process.env.FASTLY_KEY);

  fastly.purgeKey(process.env.FASTLY_SERVICE, cacheTags.objects[0], function (err, obj) {

      if (err) return res.send(err)   // Oh no!
      res.send(obj);                   // Response body from the fastly API
  });

}