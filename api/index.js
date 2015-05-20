var Parse = require('parse').Parse;
var config = require('config');
var _ = require('lodash');
var parseApp = process.env.PARSE_APP || config.get('Parse.app');
var parseJavascript = process.env.PARSE_JAVASCRIPT || config.get('Parse.javascript');

Parse.initialize(parseApp, parseJavascript);

var Scout = Parse.Object.extend("Scout");

function findScout (id, callback) {

	var query = new Parse.Query(Scout);

	query.get(id, {
		success: function(scout) {
			return callback(null, scout);
		},
		error: function(object, error) {
			return callback(error, null);
		}
	});

}

exports.createScout = function(req, res) {

	var scout = new Scout();
	var point = new Parse.GeoPoint(req.body);

	scout.set("location", point);
	scout.set("deletedAt", null);

	scout.save(null, {
		success: function(scout) {
			res.json(scout.id);
		},
		error: function(scout, error) {
			res.send(error);
		}
	});

};

exports.getScouts = function(req, res) {

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
		error: function(scout, error) {
			res.send(error);
		}
	});

};


exports.updateScout = function(req, res) {

	var point = new Parse.GeoPoint(req.body);

	findScout(req.params, function(error, scout) {

		if (error) res.send(error);

		scout.set("location", point);

		scout.save(null, {
			success: function(scout) {
				res.json(scout.id);
			},
			error: function(scout, error) {
				res.send(error);
			}
		});

	});

};

exports.getScout = function(req, res) {

	findScout(req.params, function(error, scout) {

		if (error) res.send(error);
		res.json(scout.id);

	});

};

exports.stopScout = function(req, res) {

	findScout(req.params, function(error, scout) {

		if (error) res.send(error);

		scout.set("deletedAt", Date.now());

		scout.save(null, {
			success: function(scout) {
				res.json(scout.id);
			},
			error: function(scout, error) {
				res.send(error);
			}
		});

	});

};
