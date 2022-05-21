import { LightningElement,wire,api } from 'lwc';
import getMonthlyAverage from '@salesforce/apex/AdminController.getMonthlyAverage';
export default class OfficeMonthlyAverage extends LightningElement {
    @api office;
    @api year;
    monthlyAverage = 0;
    
    @wire(getMonthlyAverage,{year:2023,office:'$office'})
    getMonAv({ error, data }) {
    if (data) {
        this.monthlyAverage = data;
        console.log(this.monthlyAverage );
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthlyAverage = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
      }
     }
    
}