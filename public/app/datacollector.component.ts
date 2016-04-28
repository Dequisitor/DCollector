import {Component, OnInit} from 'angular2/core'
import {DataInput} from './data.component'
import {DataObject} from './model/dataObject'
import {Http} from 'angular2/http'
import 'rxjs/Rx' //.map stuff

@Component({
	selector: 'data-collector',
	templateUrl: 'views/datacollector.component.html',
	directives: [DataInput]
})
export class DataCollector {
	private entries: DataObject[]
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
					this.entries = res
					this.lastUpdate = this.entries[0].data.splice(-1)[0].timeStamp
				},
				error => {
					this.entries = []
					console.log("error: ", error)
				}
			)
	}
}
