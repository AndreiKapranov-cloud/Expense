import { LightningElement,api,wire } from 'lwc';
import getMonExSpentAm from '@salesforce/apex/EmployeeController.getMonExSpentAm';
import getMonExIncome from '@salesforce/apex/EmployeeController.getMonExIncome';
import getMonthNameFromNum from '@salesforce/apex/EmployeeController.getMonthNameFromNum';
import { refreshApex } from '@salesforce/apex';
export default class NavVertical extends LightningElement {
  
  @api month;
  @api year;
  @api login;
  @api password;

  helper;
  @api monthlyExpenseSpentAmount;
  @api monExBalance;
  @api monExIncome;
  
  monthName = 0;
  monthlyExpenseSpentAmountData;
  monExIncomeData;

  @api
  changeSpentAmount(){
  refreshApex(this.monthlyExpenseSpentAmountData);     
  }

  @api
  changeIncome(){    
  refreshApex(this.monExIncomeData);
  }

  @wire(getMonExSpentAm,{year:'$year',month:'$month',login:'$login',password:'$password'})
  getMESA(wireResult) {
   
      const { data, error } = wireResult;
      this.monthlyExpenseSpentAmountData = wireResult;

      if(data){
        this.monthlyExpenseSpentAmount = data[0];   
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthlyExpenseSpentAmount = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  
  @wire(getMonExIncome,{year:'$year',month:'$month',login:'$login',password:'$password'})
  getMEI(wireResult) {
   
    const { data, error } = wireResult;
    this.monExIncomeData = wireResult;
  
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
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.monthName = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
 }
}