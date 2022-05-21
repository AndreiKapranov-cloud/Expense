import { LightningElement,api,track,wire } from 'lwc';
import getOfficeMonthlySpentAmount from '@salesforce/apex/AdminController.getOfficeMonthlySpentAmount';
export default class adminTab extends LightningElement {
  @api year;//@api year;
  @api month;//@api month;
  @api office;//@api office;

 @track officeMonthlySpentAmount = 0;

 @wire(getOfficeMonthlySpentAmount,{year:'$year',month:'$month',office:'$office'})//year:2023,month:2,office:'Office 1'
 //year:this.year,month:this.month,office:this.office
    getOMSA({ error, data }) {
    if (data) {
        this.officeMonthlySpentAmount = data;
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