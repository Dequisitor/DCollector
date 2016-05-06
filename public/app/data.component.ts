import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core'

@Component({
	selector: 'data-input',
	templateUrl: 'views/data.component.html'
})
export class DataInput {
	@Input() entry: any
	@Output() entryChange: EventEmitter<any> = new EventEmitter<any>()

	private oldValue: number
	private diff: string
	private good: boolean

	constructor() {
	}

	private ngOnInit() {
		this.oldValue = this.entry.value
		this.diff = "";
		this.good = true
	}

	private calculateDiff() {
		var tmp: number = this.entry.value - this.oldValue
		if (tmp == 0) {
			this.diff = ""
		} else {
			this.diff = (tmp>0 ? '+' : '') + tmp.toFixed(1)
			this.good = (tmp>0) == this.isGood
		}
		console.log(this.entry)
		this.entryChange.emit(this.entry)
	}
}
