const redis = require('redis')
const client = redis.createClient();

(async () => {
    await client.connect();
})();

client.on("connect" , () => {
    console.log("connected")
})

module.exports = client;