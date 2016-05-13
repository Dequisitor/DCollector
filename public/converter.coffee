###
# timestamp
# data
#	value
#	unit
#	name
#	formula
###

###
# timestamp
# data
#	value
#	unit
#	name
#	isGood
###

progressbarLength = 100
fs = require 'fs'

if process.argv.length != 4
	console.log 'invalid argument count: ', process.argv.length
	console.log process.argv
	process.exit()

inputFile = __dirname + '/' + process.argv[2]
outputFile = __dirname + '/' + process.argv[3]

console.log 'reading input file: ', inputFile
raw = fs.readFileSync inputFile, 'utf-8'
console.log 'file read complete, data size: ', raw.length

console.log 'parsing raw data to JSON'
obj = JSON.parse raw
console.log 'parsed JSON, entry count: ', obj.length

console.log 'converting JSON to new format'
output = []
for entry, index in obj
	tmp = {
		timeStamp: entry.timeStamp,
		data: []
	}
	for metric in entry.data when metric.formula == null
		tmp.data.push {
			name: metric.name,
			unit: metric.unit,
			value: metric.value,
			isGood: false
		}
	output.push tmp

	#progressbar
	process.stdout.clearLine
	process.stdout.cursorTo 0
	process.stdout.write "entry #{index+1} of #{obj.length} [ "
	for i in [0..progressbarLength]
		res = " "
		if Math.round(i*obj.length/progressbarLength) <= index
			res = "x"
		process.stdout.write res
	process.stdout.write "]"

console.log '\nconversion done'
console.log 'writing file ', outputFile
rawOut = JSON.stringify(output, null, 2)
fs.writeFileSync outputFile, rawOut
console.log 'done'
