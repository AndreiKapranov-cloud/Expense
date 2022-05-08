import { LightningElement,api,track,wire} from 'lwc';
import getTables from '@salesforce/apex/EmployeeController.getTables';
import populateMonths from '@salesforce/apex/EmployeeController.populateMonths';
import getYearForTab from '@salesforce/apex/EmployeeController.getYearForTab';
import populateDates from '@salesforce/apex/EmployeeController.populateDates';
import getCardList from '@salesforce/apex/EmployeeController.getCardList';
import getAccords from '@salesforce/apex/EmployeeController.getAccords';
import getAccordWithExCards from '@salesforce/apex/EmployeeController.getAccordWithExCards';
import getYear from '@salesforce/apex/EmployeeController.getYear';
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



lol;
year;  
@track month;      
@api login;
@api password;
cardDay;
@track dateList = [];
@track helpList = [];
@track tabs = [];
@track years = [];
@track months = [];

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

@wire(getAccords)
accords({ error, data }) {
    if (data) {
        this.dateList = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.dateList = undefined; 
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
    
    this.lol = this.year;

    console.log(this.year);
      try {
         this.helpList = await populateMonths({year:this.year}); 
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
}