import { LightningElement, wire } from 'lwc';
import getOfficeMonthlyExpense from '@salesforce/apex/AdminController.getOfficeMonthlyExpense';
const columns=[
    // { "label" : "Name", "apiName" : "Name" ,"fieldType":"text","objectName":"Account"}, 
    // { "label" : "Phone", "apiName" : "Phone" ,"fieldType":"text","type":"phone","objectName":"Account"},
    // { "label" : "Account Source", "apiName" : "AccountSource","fieldType":"picklist","objectName":"Account" }

    {
        label: 'Month',
        fieldName: 'Description__c',
        type: 'string',
        editable: true
    },
    {
        label: 'AMOUNT',
        fieldName: 'Amount__c',
        type: 'currency',
        editable: true
    }




];
export default class Admin extends LightningElement {
    @track columns = columns; 
    
    
    
    
    
    
    
    
    
    
    
    @wire(getOfficeMonthlyExpense,{year:this.year,month:this.month,office:this.office})
    oMExp({ error, data }) {
        if (data) {
            this.officeMonthlyExpense = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.officeMonthlyExpense = undefined; 
            console.log('Something went wrong:', error);
            console.error('e.message => ' + e.message );
        }
      }
    
    }
}