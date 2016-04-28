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
	private isGood: boolean
	private good: boolean

	constructor() {
	}

	private ngOnInit() {
		this.name = this.dataEntry.name
		this.unit = this.dataEntry.unit
		this.isGood = this.dataEntry.isGood
		this.value = this.dataEntry.data.splice(-1)[0].value
		this.newValue = this.value
		this.diff = "";
		this.good = true
	}

	private calculateDiff() {
		var tmp: number = this.newValue - this.value
		if (tmp == 0) {
			this.diff = ''
		} else {
			this.diff = (tmp>0 ? '+' : '') + tmp.toFixed(1)
			this.good = (tmp>0) == this.isGood
		}
	}
}
