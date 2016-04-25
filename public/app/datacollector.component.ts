import {Component} from 'angular2/core'
import {DataInput} from './data.component'

@Component({
	selector: 'data-collector',
	templateUrl: 'views/datacollector.component.html',
	directives: [DataInput]
})
export class DataCollector {
	private entries:any

	constructor() {
		this.entries = [
			{
				name: "weight",
				unit: "kg",
				data: [
					{
						value: 75.3
					},
					{
						value: 76.3
					},
					{
						value: 74.8
					}
				]
			},
			{
				name: "fat",
				unit: "%",
				data: [
					{
						value: 15.1
					},
					{
						value: 14.9
					},
					{
						value: 14.8
					}
				]
			}
		]
	}
}
