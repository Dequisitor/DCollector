import {Component} from 'angular2/core'

@Component({
	selector: 'data-input',
	templateUrl: '/dcollector/views/data.component.html'
})
export class DataInput {
	public name:string = "titties"
	public unit:string = "pairs"

	constructor() {
	}
}
