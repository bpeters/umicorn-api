var Parse = require('parse').Parse;
var config = require('config');
var parseApp = process.env.PARSE_APP || config.get('Parse.app');
var parseJavascript = process.env.PARSE_JAVASCRIPT || config.get('Parse.javascript');

Parse.initialize(parseApp, parseJavascript);

var Scout = Parse.Object.extend("Scout");

exports.postScouts = function(req, res) {

	console.log(req.body.position)

	var scout = new Scout();
	var point = new Parse.GeoPoint(req.body.position);

	scout.set("location", point);

	scout.save(null, {
		success: function(scout) {
			res.json(scout);
		},
		error: function(scout, error) {
			res.send(error);
		}
	});

};

exports.getScouts = function(req, res) {

	res.json({req: req.query});

};
