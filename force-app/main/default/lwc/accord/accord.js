import { track,wire,api } from "lwc";
import { LightningElement} from 'lwc';
import getExCards from '@salesforce/apex/EmployeeController.getExCards';
import getAccords from '@salesforce/apex/AccordController.getAccords';
import populateDates from '@salesforce/apex/EmployeeController.populateDates';

export default class Accord extends LightningElement {
@track dateList = [];
@track cardList = [];
@api year;
@api month;
@api login;
@api password;


// @wire(getAccords)
// accords({ error, data }) {
//     if (data) {
//         this.dateList = data;
//         this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.dateList = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
//   }
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
//     @wire(getExCards,{year:2023,month:2,login:'$login',password:'$password'})
//     getDL({ error, data }) {
//     if (data) {
//         this.dateList = data;
//         this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.dateList = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
//   }
}