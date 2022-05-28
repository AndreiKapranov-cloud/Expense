import { LightningElement,api,wire } from 'lwc';
import getMonExSpentAm from '@salesforce/apex/EmployeeController.getMonExSpentAm';
import getMonExIncome from '@salesforce/apex/EmployeeController.getMonExIncome';
import getMonthNameFromNum from '@salesforce/apex/EmployeeController.getMonthNameFromNum';
export default class NavVertical extends LightningElement {
  january = 0;
  february = 0;
  march = 0;
  april = 0;
  may = 0;
  june = 0;
  july = 0;
  august = 0;
  september = 0;
  october = 0;
  november = 0;
  december = 0;



  @api month;
  @api year;
  @api login;
  @api password;
  
  helper;
  monthlyExpenseSpentAmount = 0;
  monExBalance = 0;
  monExIncome = 0;
  monthName = 0;

  @wire(getMonExSpentAm,{year:'$year',month:'$month',login:'$login',password:'$password'})
  getMESA({ error, data }) {
    if (data) {
      if(data){
        this.monthlyExpenseSpentAmount = data[0];
      }
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthlyExpenseSpentAmount = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  
  @wire(getMonExIncome,{year:'$year',month:'$month',login:'$login',password:'$password'})
  getMEI({ error, data }) {
    if (data) {
      if(data){
        this.monExIncome = data[0];
      }
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monExIncome = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  @wire(getMonthNameFromNum,{num:'$month'})
  getMNFM({ error, data }) {
    if (data) {
     if(data[0]){
        this.monthName = data[0];
      }
      switch(this.monthName){
        case 'January  ':
          this.january = 1;
          break;
        case 'February ':
          this.february = 1;
          break;
        case 'March    ':
          this.march = 1;
          break;
        case 'April    ':
          this.april = 1;
          break;
        case 'May      ':
          this.may = 1;
          break;
        case 'June     ':
          this.june = 1;
          break;
        case 'July     ':
          this.july = 1;
          break;
        case 'August   ':
          this.august = 1;
          break;
        case 'September':
          this.september = 1;
          break;
        case 'October  ':
          this.october = 1;
          break;
        case 'November ':
          this.november = 1;
          break;
        case 'December ':
          this.december = 1;
      }
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthName = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
}