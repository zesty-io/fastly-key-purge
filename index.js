require('env-yaml').config();
const https = require('https');

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
  zuid = cacheTags.objects[0]

  // purge the instances system cache, requires the Instance ZUID, check to see if zuid starts with 8- to represent an instance zuid https://zesty-io.github.io/zuid-specification/
  // this is done because its possible to purge other tags (not instance zuids) in Akamai 
  if(zuid.includes('8-')){
    https.get(`https://us-central1-zesty-prod.cloudfunctions.net/redisPurge?zuid=${zuid}`);
  }


  var fastly = require('fastly')(process.env.FASTLY_KEY);

  fastly.purgeKey(process.env.FASTLY_SERVICE, cacheTags.objects[0], function (err, obj) {

      if (err) return res.send(err)   // Oh no!
      res.send(obj);                   // Response body from the fastly API
  });

}