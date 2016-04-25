import {Component, Input, OnInit} from 'angular2/core'

@Component({
	selector: 'data-input',
	templateUrl: 'views/data.component.html',
	inputs: ['dataEntry']
})
export class DataInput {
	@Input() dataEntry: any

	private name: string
	private unit: string
	private value: number
	private newValue: number
	private diff: string

	constructor() {
	}

	private ngOnInit() {
		this.name = this.dataEntry.name
		this.unit = this.dataEntry.unit
		this.value = this.dataEntry.data.slice(-1)[0].value
		this.newValue = this.value
		this.calculateDiff()
	}

	private calculateDiff() {
		var tmp: number = this.newValue - this.value
		if tmp == 0
			this.diff = ''
		else
			this.diff = (tmp>0 ? '+' : '') + tmp.toFixed(1)
	}
}
