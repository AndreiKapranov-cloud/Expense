import { LightningElement,wire,api } from 'lwc';
import getEmployeeYearExpense from '@salesforce/apex/AdminController.getEmployeeYearExpense';

export default class EmployeeYearExpense extends LightningElement {
    @api year;
    @api employeeId;
    employeeYearExpenseSum = 0;
   
    @wire(getEmployeeYearExpense,{employeeId:'$employeeId',year:'$year'})
    getOMSA({ error, data }) {
    if (data) {
        this.employeeYearExpenseSum = data[0];
       
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.employeeYearExpenseSum = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
}