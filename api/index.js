var Parse = require('parse').Parse;
var config = require('config');
var _ = require('lodash');
var Q = require('q');
var parseApp = process.env.PARSE_APP || config.get('Parse.app');
var parseJavascript = process.env.PARSE_JAVASCRIPT || config.get('Parse.javascript');

Parse.initialize(parseApp, parseJavascript);

var Scout = Parse.Object.extend("Scout");
var Umicorn = Parse.Object.extend("Umicorn");

var findScout = function (id) {

	var deferred = Q.defer();

	var query = new Parse.Query(Scout);

	query.get(id, {
		success: function(obj) {
			deferred.resolve(obj);
		},
		error: function(obj, error) {
			deferred.reject(error);
		}
	});

	return deferred.promise;

};

exports.createScout = function(req, res) {

	var scout = new Scout();
	var point = new Parse.GeoPoint(req.body);

	scout.set("location", point);
	scout.set("deletedAt", null);

	scout.save(null, {
		success: function(obj) {
			res.json(obj.id);
		},
		error: function(obj, error) {
			res.send(error);
		}
	});

};

exports.getScout = function(req, res) {

	var point = new Parse.GeoPoint(req.query);

	var query = new Parse.Query(Scout);

	query.near("location", point);
	query.equalTo("deletedAt", null);

	query.limit(10);

	query.find({
		success: function(results) {
			var scouts = [];
			_.forEach(results, function(scout) {
				scouts.push({
					id: scout.get('id')
				});
			});
			res.json(scouts);
		},
		error: function(results, error) {
			res.send(error);
		}
	});

};


exports.updateScoutById = function(req, res) {

	var point = new Parse.GeoPoint(req.body);
	var scout = Q.when(findScout(req.params), function(scout) {
		return scout;
	});

	scout.set("location", point);

	scout.save(null, {
		success: function(obj) {
			res.json(obj.id);
		},
		error: function(obj, error) {
			res.send(error);
		}
	});

};

exports.getScoutById = function(req, res) {

	var scout = Q.when(findScout(req.params), function(scout) {
		return scout;
	});

	res.json(scout.id);

};

exports.stopScoutById = function(req, res) {

	var scout = Q.when(findScout(req.params), function(scout) {
		return scout;
	});

	scout.set("deletedAt", Date.now());

	scout.save(null, {
		success: function(obj) {
			res.json(obj.id);
		},
		error: function(obj, error) {
			res.send(error);
		}
	});

};

exports.createMissedConnection = function(req, res) {

	var scout = Q.when(findScout(req.params), function(scout) {
		return scout;
	});

	scout.set("missedConnection", req.body);

	scout.save(null, {
		success: function(obj) {
			res.json(obj.id);
		},
		error: function(obj, error) {
			res.send(error);
		}
	});

};

exports.createUmicorns = function(req, res) {

	var scout = findScout(req.params);

	var umicorns = [];
	var promises = [];

	_.forEach(req.body, function(umi) {

		promises.push(
			findScout(umi.id)
		);

	});

	Q.all(promises).then(function(scouts) {

		_.forEach(scouts, function(umi) {

			var umicorn = new Umicorn();

			umicorn.set('scout', scout);
			umicorn.set('umicorn', umi);

			umicorns.push(umicorn);

		});
		
	});

	Parse.Object.saveAll(umicorns, {
		success: function(objs) {
			res.json(objs);
		},
		error: function(objs, error) {
			res.send(error);
		}
	});

};

exports.getUmicorns = function(req, res) {

	var scout = Q.when(findScout(req.params), function(scout) {
		return scout;
	});

	var query = new Parse.Query(Umicorn);

	query.equalTo("scout", scout);

	query.find({
		success: function(results) {
			var umicorns = [];
			_.forEach(results, function(umicorn) {
				umicorns.push({
					id: umicorn.get('id')
				});
			});
			res.json(umicorns);
		},
		error: function(results, error) {
			res.send(error);
		}
	});

};
