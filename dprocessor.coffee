express = require 'express'
bp = require 'body-parser'
fs = require 'fs'
router = express.Router()

router.get '/', (req, res) ->
	res.redirect '/dprocessor/views/dprocessor.html'

router.get '*', (req, res, next) ->
	path = req.params[0]
	fs.stat './DCollector/public/' + path, (err, stat) ->
		if err
			next()
		else
			res.sendFile path, {root: './DCollector/public'}

router.get '/getlatest', (req, res) ->
	fs.readdir __dirname + '/public/data/', (err, files) ->
		res.send err if err

		result = []
		for file in files
			raw = fs.readFileSync __dirname + '/public/data/' + file, 'utf-8'
			json = JSON.parse raw
			result.push {fileName: file, data: json[json.length-1]}

		res.send result

module.exports = router
