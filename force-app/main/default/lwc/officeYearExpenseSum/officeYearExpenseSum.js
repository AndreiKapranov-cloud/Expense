import { LightningElement,api,wire,track } from 'lwc';
import getOfficeYearExpenseSum from '@salesforce/apex/AdminController.getOfficeYearExpenseSum';
export default class OfficeYearExpenseSum extends LightningElement {
    @api office;
    @api year;
    @track officeYearExpenseSum = 0;
    zero = 0;

    @wire(getOfficeYearExpenseSum,{year:'$year',office:'$office'})
    getOYE({ error, data }) {
    if (data) {
        this.officeYearExpenseSum = data[0];
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.officeYearExpenseSum = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
      }
     }
}