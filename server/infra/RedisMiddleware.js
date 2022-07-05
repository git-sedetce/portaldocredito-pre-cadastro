/**
 * RedisMiddleware.js
 * 
 * Handles caching of postgres queries
 * (and presumably other stuff)
 * 
 */

var redis = require("redis"), client = redis.createClient();

redis.debug = true;

client.on("error", function(err) {
	console.log("Error " + err);
});


///////////////////////////////////////

module.exports = {
	getQueryCache: getQueryCache,
	setQueryCache: setQueryCache
};

///////////////////////////////////////

function getQueryCache(key, next) {
	client.get('postgres:' + key, function (err, result) {
		console.log(err, result);
		if (err || !result) return next(err);
		return next(null, JSON.parse(result));
	});
}

function setQueryCache(key, ttl, data, next) {
	console.log(key);
	client.setex('postgres:' + key, ttl, JSON.stringify(data), function(err, result) {
		if (err || !result) return next(err);
		return next(null, result);
	});
}