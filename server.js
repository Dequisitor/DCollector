var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.set('views', __dirname + '/Views');
app.set('view engine', 'jade');
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser());

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/addEntry', function(req, res) {
	res.render('addEntry');
});

app.post('/addData', function(req, res) {
	fs.readFile('./Data/main.data', function (err, data) {
		if (err) {
			res.status(500).send(err);
		}

		var jsonData = JSON.parse("[]");		
		if (!!data && data.length > 2) {
			jsonData = JSON.parse(data);
		}

		var newData = {
			timeStamp: new Date(),
			data: req.body
		};
		jsonData.push(newData);

		fs.writeFile('./Data/main.data', JSON.stringify(jsonData), function (err, data) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.sendStatus(200);
			}			
		});
	});
});

app.get('/getLatest', function (req, res) {
	fs.readFile('./Data/main.data', function (err, data) {
		if (err) {
			res.status(200).send(null);
		} else {
			var result = [];
			var jsonData = JSON.parse("[]");
			if (!!data && data.length > 2) {
				jsonData = JSON.parse(data);
				result = jsonData[jsonData.length-1].data;
			}

			res.status(200).send(result);
		}
	});
});

app.listen(3000, function () {
	console.log('Listening on port 3000 ...');
});
