express = require 'express'
bp = require 'body-parser'
fs = require 'fs'
router = express.Router()

publicDir = __dirname+'/public/'
dataDir = publicDir+'data/'

router.get '/', (req, res) ->
	res.sendFile publicDir + 'views/main.html'

router.use bp.json()
router.use express.static(publicDir)

router.get '/data', (req, res) ->
	fs.readdir dataDir, (err, files) ->
		if err
			res.status(500).send err
		else
			res.json files

router.post '/data/:file', (req, res) ->
	file = dataDir+req.params.file
	obj = []
	data = {
		timeStamp: new Date(),
		data: req.body
	}

	#if file exists append, if not create
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
				res.sendFile file

module.exports = router
