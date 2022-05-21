import { LightningElement,api,wire } from 'lwc';
import getOfficeYearExpenseSum from '@salesforce/apex/AdminController.getOfficeYearExpenseSum';
export default class OfficeYearExpenseSum extends LightningElement {
    @api office;
    @api year;
    officeYearExpenseSum = 0;

    @wire(getOfficeYearExpenseSum,{year:2023,office:'$office'})
    getOYE({ error, data }) {
    if (data) {
        this.officeYearExpenseSum = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.officeYearExpenseSum = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
      }
     }
}