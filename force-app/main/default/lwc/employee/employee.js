import { LightningElement,api,track,wire} from 'lwc';
import getTables from '@salesforce/apex/EmployeeController.getTables';
import populateMonths from '@salesforce/apex/EmployeeController.populateMonths';
import getYearForTab from '@salesforce/apex/EmployeeController.getYearForTab';
import populateDates from '@salesforce/apex/EmployeeController.populateDates';
import getCardList from '@salesforce/apex/EmployeeController.getCardList';
import getAccords from '@salesforce/apex/EmployeeController.getAccords';
import getAccordWithExCards from '@salesforce/apex/EmployeeController.getAccordWithExCards';
import getYear from '@salesforce/apex/EmployeeController.getYear';
import getAmountTotal from '@salesforce/apex/EmployeeController.getAmountTotal';
import getYearIncome from '@salesforce/apex/EmployeeController.getYearIncome';
import getYearBalance from '@salesforce/apex/EmployeeController.getYearBalance';
import getOffice from '@salesforce/apex/LoginController.getOffice';
import saveExpenseCard from '@salesforce/apex/EmployeeController.saveExpenseCard';
import saveIncomeInput from '@salesforce/apex/EmployeeController.saveIncomeInput';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columnsForAc = [
{
    label: 'Description',
    fieldName: 'CardDate__c',
    type: 'date'
},
{
    label: 'Amount',
    fieldName: 'CardDate__c',
    type: 'date'
}];
const columnsForMonths = [
    {
        label: 'Months',
        fieldName: 'Name',
        type: 'string'
    },
    {
        label: 'Balance',
        fieldName: 'Title',
        type: 'currency'
    }];

const columns = [
{
    label: 'Amount',
    fieldName: 'Balance__c',
    type: 'currency'
},
{
    label: 'Income',
    fieldName: 'MonthDate__c',
    type: 'date'
}];


export default class Employee extends LightningElement {
   
@track columnsForAc = columnsForAc;
@track columnsForMonths = columnsForMonths;
@track columns = columns; 

@track year;  
@track amountTotal;
@track month; 
@track yearIncome;   
@track yearBalance; 
office = 'Office 5';//@api office
keeperId = '0035i000004hujfAAA';//@api keeperId

@api login = 'gggggg@mail.ru';
@api password = 'fff';

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
@wire(getAmountTotal,{login:'$login',password:'$password'})
total({ error, data }) {
    if (data) {
        this.amountTotal = data;
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.amountTotal = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
@wire(getYearIncome,{login:'$login',password:'$password'})
income({ error, data }) {
    if (data) {
        this.yearIncome = data;
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.yearIncome = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
@wire(getYearBalance,{login:'$login',password:'$password'})
balance({ error, data }) {
    if (data) {
        this.yearBalance = data;
        console.log(this.year);
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.yearBalance = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
}
// @wire(getAccords)
// accords({ error, data }) {
//     if (data) {
//         this.dateList = data;
//         this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.dateList = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
// }
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
         this.helpList = await populateMonths({year:this.year,login:this.login,password:this.password}); 
         let delayInMilliseconds = 2000; 

         setTimeout(function() {
            window.location.reload();
         }, delayInMilliseconds);

        } catch (error) {
          console.error(error);
          this.error = error;
          console.error('e.message => ' + e.message );
      }
    }

    async handleMonthClick(event){
        this.error = '';
        const itemIndexx = event.currentTarget.dataset.index;
        
        this.month = itemIndexx;
        
        console.log(this.month);
        console.log(this.year);
          try {
            this.dateList = await getAccordWithExCards({month:this.month});
            
          //  this.dateList = await populateDates({year:2022,month:this.month}); 
          let delayInMilliseconds = 2000; //1 second

          setTimeout(function() {
             window.location.reload();
       
          }, delayInMilliseconds);
  
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
              
                return this.refresh();
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
           keeper:this.keeperId})
           .then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Income Saved Successfully!!',
                    variant: 'success'
                })
            );
          
            return this.refresh();
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