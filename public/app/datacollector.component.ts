import {Component, OnInit} from 'angular2/core'
import {DataInput} from './data.component'
import {Http} from 'angular2/http'
import 'rxjs/Rx' //.map stuff

@Component({
	selector: 'data-collector',
	templateUrl: 'views/datacollector.component.html',
	directives: [DataInput]
})
export class DataCollector {
	private entries: any[]
	private files: string[]
	private selectedFile: string
	private lastUpdate: number

	constructor(private _http: Http) {
	}

	private ngOnInit() {
		this._http.get('data')
			.map(res => res.json())
			.subscribe(
				res => {
					this.files = res
				},
				error => {
					this.files = []
					console.log("error: ", error)
				}
			)
	}

	private selectFile(): void {
		this._http.get('data/'+this.selectedFile)
			.map(res => res.json())
			.subscribe(
				res => {
					this.entries = res.slice(-1)[0].data
					this.lastUpdate = res.slice(-1)[0].timeStamp
					console.log(this.entries)
				},
				error => {
					this.entries = null
					console.log("error: ", error)
				}
			)
	}

	private submitData(): void {
		var data = ""
		this._http.post('data/'+this.selectedFile, data)
			.map(res => res.json())
			.subscribe(
				res => {
					this.entries = res.slice(-1)[0].data
					this.lastUpdate = res.slice(-1)[0].timeStamp
				},
				error => {
					this.entries = null
					console.log("error: ", error)
				}
			)
	}
}
