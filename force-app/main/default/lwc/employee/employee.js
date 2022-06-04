import { LightningElement,api,track,wire} from 'lwc';
import getMonExSpentAm from '@salesforce/apex/EmployeeController.getMonExSpentAm';
import getMonExIncome from '@salesforce/apex/EmployeeController.getMonExIncome';
import getYearForTab from '@salesforce/apex/EmployeeController.getYearForTab';
import getAmountTotal from '@salesforce/apex/EmployeeController.getAmountTotal';
import getYearIncome from '@salesforce/apex/EmployeeController.getYearIncome';
import getYearBalance from '@salesforce/apex/EmployeeController.getYearBalance';
import saveExpenseCard from '@salesforce/apex/EmployeeController.saveExpenseCard';
import saveIncomeInput from '@salesforce/apex/EmployeeController.saveIncomeInput';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import messageChannel from '@salesforce/messageChannel/DeleteCardMessageChannel__c';
import { subscribe, MessageContext } from 'lightning/messageService';
 
export default class Employee extends LightningElement {
    
 back = false;
year;  
@ track amountTotal = 0;
month; 
@track yearIncome = 0;   
@ track yearBalance = 0;
zero = 0; 
@api office;
@api keeperId;

@api login;
@api password;

dateInput;
amountInput;
descInput;
cardDay;

incomeDateInput;
incomeInput;

amountTotalData;
yearIncomeData;
yearBalanceData;

@track dateList = [];
@track years = [];
@track months = [];
@track isModalOpen = false;
@track isIncomeModalOpen = false;

monthList = [1,2,3,4,5,6,7,8,9,10,11,12];

monthlyExpenseSpentAmount;
monExIncome;
yearIncomeData;

subscription = null;
 
    @wire(MessageContext)
    messageContext;
 
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
 
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, messageChannel, (message) => {
                console.log(`grand parent received ${message.messageText}`);
                               
                  refreshApex(this.amountTotalData);
                
                  refreshApex(this.yearBalanceData);
                     
                    this.template.querySelectorAll('c-nav-vertical').forEach(element => {
                    element.changeSpentAmount();         
                    });
                })   
           }
      }

    @wire(getAmountTotal,{year:'$year',login:'$login',password:'$password'})
        total(wireResult) {
    
        const { data, error } = wireResult;
        this.amountTotalData = wireResult;
    
    if (data) {
     
        this.amountTotal = data[0];
       
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.amountTotal = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
@wire(getYearIncome,{year:'$year',login:'$login',password:'$password'})
income(wireResult) {
   
    const { data, error } = wireResult;
    this.yearIncomeData = wireResult;
   
    if (data) {
       
        this.yearIncome = data[0];
        
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.yearIncome = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
@wire(getYearBalance,{year:'$year',login:'$login',password:'$password'})
balance(wireResult) {
   
    const { data, error } = wireResult;
    this.yearBalanceData = wireResult;
   
    if (data) {
        
        this.yearBalance = data[0];
    
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.yearBalance = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
    @wire(getYearForTab)
    getYears({ error, data }) {
    if (data) {
        this.years = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.years = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  async handleYearClick(event){
    this.error = '';
    const itemIndex = event.currentTarget.dataset.index;
    
    this.year = this.years[itemIndex];
    
    console.log(this.year);
      try {
       
        } catch (error) {
          console.error(error);
          this.error = error;
          console.error('e.message => ' + e.message );
      }
    }

    async handleMonthClick(event){
        try {
        this.error = '';
        const itemIndexx = event.currentTarget.dataset.index;
        
        this.month = this.monthList[itemIndexx];
        
        console.log(this.month);
        console.log(this.year);
      
        console.log(this.dateList);
        } catch (error) {
            console.error(error);
            this.error = error;
            console.error('e.message => ' + e.message );
        }
     }

     handleNewExpenseClick(){
       
            this.isModalOpen = true;
     }
     closeModal(){
       
            this.isModalOpen = false;
        
     }
     handleDescInput(event) {
        let element = event.target.name;
        let value = event.target.value;
        if(element === 'Description') {
            this.descInput = value;
        }
    }
    handleDateInput(event) {
        let element = event.target.name;
        let value = event.target.value;
        if(element === 'Date') {
            this.dateInput = value;
        }
    }
    handleAmountInput(event) {
        let element = event.target.name;
        let value = event.target.value;
        if(element === 'Amount') {
            this.amountInput = value;
        }
    }
    
    handleSaveExpenseCard(event){
        
    saveExpenseCard({amount:this.amountInput,cardDate:this.dateInput,
    description:this.descInput,
    cardKeeperId:this.keeperId})
    
    .then(() => {                 
    return refreshApex(this.amountTotalData);
                })
    .then(() => {
    return refreshApex(this.yearBalanceData);
                })
    .then(() => {           
    this.template.querySelectorAll('c-nav-vertical').forEach(element => {
    element.changeSpentAmount();         
    });
                })
    .then(res => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Expense Card Saved Successfully!!',
                variant: 'success'
            })
        );                      
    })
        .catch((error) => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Expense Card Not Saved!!',
                    variant: 'error'
                })
            );
        });  
    }
    handleIncomeClick(){
        
        this.isIncomeModalOpen = true;
    }
    closeIncomeModal(){
       
    this.isIncomeModalOpen = false;

    }
    handleIncomeInput(event) {
        let element = event.target.name;
        let value = event.target.value;
        if(element === 'Income') {
            this.incomeInput = value;
        }
    }
    handleIncomeDateInput(event) {
        let element = event.target.name;
        let value = event.target.value;
        if(element === 'IncomeDate') {
            this.incomeDate = value;
        }
    }
    handleSaveIncome(event) {
        saveIncomeInput({income:this.incomeInput,incomeDate:this.incomeDate,
           keeperId:this.keeperId})
           .then(() => {
            return refreshApex(this.yearIncomeData);
                       })
            .then(() => {
            return refreshApex(this.yearBalanceData);
                        })
            .then(() => {           
            this.template.querySelectorAll('c-nav-vertical').forEach(element => {
            element.changeIncome();         
            });
                        })          
           .then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Income Saved Successfully!!',
                    variant: 'success'
                })
            );
        })
        .catch((error) => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Income Not Saved!!',
                    variant: 'error'
                })
            );
        });

    }
  
    @api
    changeSpentAmountTotal(){
    refreshApex(this.amountTotalData);     
    }
    @api
    changeYearBalance(){
    refreshApex(this.yearBalanceData);     
    }

}