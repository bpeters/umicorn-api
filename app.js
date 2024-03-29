var express = require('express');
var app = express();
var api = require('./api');
var bodyParser = require('body-parser');
var config = require('config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.route('/scouts')
	.post(api.createScout)
	.get(api.getScout);

router.route('/scouts/:id')
	.post(api.updateScoutById)
	.get(api.getScoutById)
	.delete(api.stopScoutById);

router.route('/scouts/:id/missed_connection')
	.post(api.createMissedConnection);

router.route('/scouts/:id/umicorns')
	.post(api.createUmicorns)
	.get(api.getUmicorns);

app.use('/api/v1', router);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		message: err.message,
		error: {}
	});
});
