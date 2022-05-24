import { LightningElement,wire,api } from 'lwc';
import getOfficeEmployees from '@salesforce/apex/AdminController.getOfficeEmployees';

export default class ModalEmployeeTab extends LightningElement {
    monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
    officeEmployees = [];
    @api office;
    @api year;
    maneTable = true;
    
    @wire(getOfficeEmployees,{office:'$office'})
    getOE({ error, data }) {
    if (data) {
        this.officeEmployees = data;         
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.officeEmployees = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
      }
   }
   
   handleBackClick(){
       
    this.maneTable = false;
  }
 
}