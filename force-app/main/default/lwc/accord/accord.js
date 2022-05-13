import { track,wire } from "lwc";
import { LightningElement} from 'lwc';

import getAccords from '@salesforce/apex/AccordController.getAccords';


export default class Accord extends LightningElement {
@track dateList = [];
@track cardList = [];


@wire(getAccords)
accords({ error, data }) {
    if (data) {
        this.dateList = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.dateList = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }

}