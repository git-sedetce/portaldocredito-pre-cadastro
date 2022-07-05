/**
 * PostgresMiddleware.js
 * 
 * Handles postgres queries and caching to redis
 * see README for usage
 * 
 */
 
var pg = require('pg'),
	crypto = require('crypto'),
	RedisMiddleware = require('./RedisMiddleware'),
	errors = require('../errors');

var types = require('pg').types;
var timestampOID = 1114;

types.setTypeParser(1114, function(stringValue) {
	return stringValue;
});

///////////////////

module.exports = {
	Query: Query
};

////////////////////

var connectionString = 'tcp://' + Config.database.username +
	':' + Config.database.password +
	'@' + Config.database.host +
	':' + Config.database.port +
	'/' + Config.database.db;

/**
 * Execute a postgres query
 * @param {String}		query  	Querystring
 * @param {Array}		params 	Array of paramters for the query (empty array for none)
 * @param {Number}   	ttl    	Expiration of cache in seconds
 * @param {Function} 	next   	callback in the form of function(err, data)
 */
function Query(query, params, ttl, next) {

	var cache = true;

	// If no time to live (ttl)  caching disabled
	if (typeof ttl !== 'number') {
		next = ttl;
		cache = false;
	}

	// Return if no callback
	if (!next) return console.log('YOU MUST PASS A CALL BACK TO QUERY FUNCTION!');
	
	// If we have caching enabled
	// Check and see if we have a cache in redis
	if (cache) {

		var hash = crypto.createHash('sha1').update(query + params.toString()).digest('hex');

		RedisMiddleware.getQueryCache(hash, function(err, data) {
			if (err || !data) {
				_execute(query, params, ttl, cache, next);
			} else {
				return next(data);
			}
		});

	} else {
		_execute(query, params, 0, false, next);
	}


}

function _execute(query, params, ttl, cache, next) {

	var hash = crypto.createHash('sha1').update(query + params.toString()).digest('hex');

	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			return  next(errors.postgresError('Error fetching client from pool'));
		}
		client.query(query, params, function(err, result) {

			if (err) {
				return next(errors.postgresError(err));
			}
			done();

			// If Caching set cache in redis
			if (cache) {

				RedisMiddleware.setQueryCache(hash, ttl, result.rows, function(err, data) {
					console.log(err, data);
					if (err || !data) return next(errors.postgresError('Error getting redis cache'));
					return next(result.rows);

				});
			} else {
				return next(result.rows);
			}

		});
	});
}