import { LightningElement,wire,api,track } from 'lwc';
import getOfEmpMonEx from '@salesforce/apex/AdminController.getOfEmpMonEx';
export default class OfficeEmployeeMonEx extends LightningElement {
    
    @api employeeId;
    @api year;
    @api month;
    officeEmployeeMonthlyExpense = 0;
    zero = 0;
    
    @wire(getOfEmpMonEx,{employeeId:'$employeeId',year:'$year',month:'$month'})
    getOfBal({ error, data }) {
    if (data) {
        if(data[0]){
        this.officeEmployeeMonthlyExpense = data[0];
        }
      
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.officeEmployeeMonthlyExpense = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
      }
     }
}