import { LightningElement,api,wire } from 'lwc';
import getMonExSpentAm from '@salesforce/apex/EmployeeController.getMonExSpentAm';
import getMonExBalance from '@salesforce/apex/EmployeeController.getMonExBalance';
import getMonExIncome from '@salesforce/apex/EmployeeController.getMonExIncome';
import getMonthNameFromNum from '@salesforce/apex/EmployeeController.getMonthNameFromNum';
export default class NavVertical extends LightningElement {
 
  
  @api month;
  @api year;
  @api login;
  @api password;
  
  helper;
  monthlyExpenseSpentAmount = 0;
  monExBalance = 0;
  monExIncome = 0;
  monthName = 0;

  //month:1,login:'gggggg@mail.ru',password:'fff'
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
  // @wire(getMonExBalance,{year:'$year',month:'$month',login:'$login',password:'$password'})
  // getMEB({ error, data }) {
  //   if (data) {
  //     if(data[0]){
  //       this.monExBalance = data[0];
  //     }
  //       this.error = undefined;
  //   } else if (error) {
  //       this.error = error;
  //       this.monExBalance = undefined; 
  //       console.log('Something went wrong:', error);
  //       console.error('e.message => ' + e.message );
  //   }
  // }
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
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthName = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
}