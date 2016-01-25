express = require 'express'
bp = require 'body-parser'
fs = require 'fs'
router = express.Router()

router.get '/', (req, res) ->
	res.redirect '/dcollector/views/dcollector.html'

router.get '*', (req, res, next) ->
	path = req.params[0]
	fs.stat './DCollector/public/' + path, (err, stat) ->
		if err
			next()
			return
		else
			res.sendFile path, {root: './DCollector/public'}
			return

router.get '/getlatest', (req, res) ->
	fs.readdir __dirname + '/public/data/', (err, files) ->
		if err
			res.send err
			return

		result = []
		if files? and files.length>0
			for file in files
				raw = fs.readFileSync __dirname + '/public/data/' + file, 'utf-8'
				json = JSON.parse raw
				result.push {fileName: file, data: json[json.length-1]}

		res.send result
		return

parser = bp.json()
router.post '/savedata', parser, (req, res) ->
	file = req.body.file
	data = req.body.data

	fs.readFile __dirname + '/public/data/' + file, (err, fileData) ->
		if err
			res.status(500).send 'error: can\'t read ' + file + ': ' + err
			return
		else
			obj = JSON.parse fileData
			obj.push {timeStamp: new Date(), data: data}

			fs.writeFile __dirname + '/public/data/' + file, JSON.stringify(obj), (err, file) ->
				if err
					res.status(500).send 'error: can\'t write ' + file + ': ' + err
					return
				else
					res.send 'OK'
					return
			return
	return

module.exports = router
