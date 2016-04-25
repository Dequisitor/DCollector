import {Component} from 'angular2/core'
import {DataInput} from './data.component'

@Component({
	selector: 'data-collector',
	templateUrl: '/dcollector/views/datacollector.component.html',
	directives: [DataInput]
})
export class DataCollector {
}
