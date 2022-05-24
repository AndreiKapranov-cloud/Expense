import { LightningElement,api,track,wire } from 'lwc';
import getOfficeMonthlySpentAmount from '@salesforce/apex/AdminController.getOfficeMonthlySpentAmount';
export default class adminTab extends LightningElement {
  @api year;
  @api month;
  @api office;
  
  @track officeMonthlySpentAmount = 0;

  @wire(getOfficeMonthlySpentAmount,{year:'$year',month:'$month',office:'$office'})
 
    getOMSA({ error, data }) {
    if (data) {
        this.officeMonthlySpentAmount = data[0];
        console.log(this.officeMonthlySpentAmount );
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.officeMonthlySpentAmount = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
}