import { track,wire,api } from "lwc";
import { LightningElement} from 'lwc';
import populateDates from '@salesforce/apex/EmployeeController.populateDates';

export default class Accord extends LightningElement {
@track dateList = [];
@track cardList = [];
@api year;
@api month;
@api login;
@api password;

  @wire(populateDates,{year:'$year',month:'$month'})
  getDates({ error, data }) {
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