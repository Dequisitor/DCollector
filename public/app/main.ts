import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'
import {DataCollector} from './datacollector.component'

bootstrap(DataCollector, [HTTP_PROVIDERS])
