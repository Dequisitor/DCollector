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

	constructor(private _http: Http) {
	}

	private ngOnInit() {
		this._http.get('getlatest')
			.map(res => res.json())
			.subscribe(
				res => {
					this.entries = res[2].data.data
				},
				error => {
					this.entries = []
					console.log("error: ", error)
				} //TODO: error message
			)
	}
}
