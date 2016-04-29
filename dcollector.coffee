express = require 'express'
bp = require 'body-parser'
fs = require 'fs'
router = express.Router()

publicDir = __dirname+'/public/'
dataDir = publicDir+'data/'

router.get '/', (req, res) ->
	res.sendFile publicDir + 'views/main.html'

router.use express.static(publicDir)

router.get '/getlatest', (req, res) ->
	fs.readdir dataDir, (err, files) ->
		if err
			res.send err

		result = []
		if files? and files.length>0
			for file in files
				raw = fs.readFileSync dataDir+file, 'utf-8'
				json = JSON.parse raw
				result.push {fileName: file, data: json[json.length-1]}

		res.send result

parser = bp.json()
router.post '/savedata', parser, (req, res) ->
	file = dataDir + req.body.file
	obj = []
	data = {
		timeStamp: new Date(),
		data: req.body.data
	}

	fs.access file, fs.F_OK, (err) =>
		if err
			obj.push data
		else
			raw = fs.readFileSync file, 'utf-8'
			obj = JSON.parse raw
			obj.push data

		output = JSON.stringify obj
		fs.writeFile file, output, (err) ->
			if err
				res.status(500).send 'error: can\'t write ' + req.body.file + ': ' + err
			else
				res.send 'OK'

router.get '/data', (req, res) ->
	fs.readdir dataDir, (err, files) ->
		if err
			res.status(500).send err
		else
			res.json files

router.get '/data/:file', (req, res) ->
	file = req.param.file
	fs.readFile dataDir+file, 'utf-8', (err, data) ->
		if err
			res.status(500).send 'error: can\'t read file ' + file + ': ' + err
		else
			json = JSON.parse data
			res.json json

module.exports = router
