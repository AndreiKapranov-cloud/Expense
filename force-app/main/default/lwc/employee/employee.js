import { LightningElement,api,track,wire} from 'lwc';
import getTables from '@salesforce/apex/EmployeeController.getTables';
import getYearForTab from '@salesforce/apex/EmployeeController.getYearForTab';
import getYear from '@salesforce/apex/EmployeeController.getYear';
import getAmountTotal from '@salesforce/apex/EmployeeController.getAmountTotal';
import getYearIncome from '@salesforce/apex/EmployeeController.getYearIncome';
import getYearBalance from '@salesforce/apex/EmployeeController.getYearBalance';
import saveExpenseCard from '@salesforce/apex/EmployeeController.saveExpenseCard';
import saveIncomeInput from '@salesforce/apex/EmployeeController.saveIncomeInput';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Employee extends LightningElement {
   
year;  
amountTotal = 0;
month; 
yearIncome = 0;   
yearBalance = 0; 
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

@track dateList = [];
@track helpList = [];
@track tabs = [];
@track years = [];
@track months = [];
@track isModalOpen = false;
@track isIncomeModalOpen = false;

monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
@wire(getTables)
tables({ error, data }) {
    if (data) {
        this.tabs = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.tabs = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}

@wire(getYear)
year({ error, data }) {
    if (data) {
        this.year = data;
        console.log(this.year);
        this.error = undefined;
       
    } else if (error) {
        this.error = error;
        this.year = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
@wire(getAmountTotal,{year:'$year',login:'$login',password:'$password'})
total({ error, data }) {
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
income({ error, data }) {
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
balance({ error, data }) {
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
    
}