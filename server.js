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

var dataPath = "./public/Data/";

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/dprocess', function(req, res) {
	res.render('dprocessor');
});

app.get('/addEntryPopup', function(req, res) {
	res.render('addEntry');
});

app.post('/saveData', function(req, res) {
	fs.readFile(dataPath + req.body.file, function (err, data) {
		if (err) {
			res.status(500).send(err);
		} else {
			var jsonData = [];		
			if (!!data && data.length > 2) {
				jsonData = JSON.parse(data);
			}

			var newData = {
				timeStamp: new Date(),
				data: req.body.data
			};
			jsonData.push(newData);

			fs.writeFile(dataPath + req.body.file, JSON.stringify(jsonData), function (err, data) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).send(null);
				}			
			});
		}
	});
});

var getLastEntryFromFile = function (fileName) {
	var data = fs.readFileSync(dataPath + fileName);
	try {
		json = JSON.parse(data);
		if (json && typeof json === 'object' && json !== null) {					
			return json[json.length -1];
		} else {
			console.log('not json data');
			return null;
		}
	} catch (e) {
		console.log('catched an exception: ', e);
		return null;
	};
};

app.get('/getLatest', function (req, res) {
	//get files list
	fs.readdir(dataPath, function (err, files) {
		if (err) {
			res.status(500).send(null);
		} else {
			var result = [];
			files.forEach(function (file) {
				result.push({
					fileName: file,
					data: getLastEntryFromFile(file)
				});
			});

			res.status(200).send(result);
		};
	});
});

app.listen(3000, function () {
	console.log('Listening on port 3000 ...');
});
