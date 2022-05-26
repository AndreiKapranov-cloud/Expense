import { LightningElement, wire,track,api} from 'lwc';
import getOfficeMonthlyExpense from '@salesforce/apex/AdminController.getOfficeMonthlyExpenses';
import populateMonths from '@salesforce/apex/AdminController.populateMonths';
import getOfficeMonthlyExpenseForList from '@salesforce/apex/AdminController.getOfficeMonthlyExpenseForList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getOfficeBalanceNow from '@salesforce/apex/AdminController.getOfficeBalanceNow';
import getMonthlyAverage from '@salesforce/apex/AdminController.getMonthlyAverage';
import getSumList from '@salesforce/apex/AdminController.getSumList';
import getYearSum from '@salesforce/apex/AdminController.getYearSum';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import getYearForTab from '@salesforce/apex/EmployeeController.getYearForTab';
import getOfficeMonthlySpentAmount from '@salesforce/apex/AdminController.getOfficeMonthlySpentAmount';

import CONTACT_OBJECT from '@salesforce/schema/Contact';


import OFFICE_FIELD from '@salesforce/schema/Contact.Office__c';

export default class Admin extends LightningElement {
     
   
    @track officeMonthlyExpense = [];
    @track ddd;
    @track officeBalanceNow;
    @track monthlyAverage;
    @track sumList = [];
    @track yearExpenseSum;
    @track officeMonthlySpentAmount = [];
  
    @track january;
    @track february;
    @track march;
    @track april;
    @track may;
    @track june;
    @track july;
    @track august;
    @track september;
    @track october;
    @track november;
    @track december;
    
    @api maneTable = false;
    modalOfficeName;
    @api label ='Regional Expenses year...';
    

    years = [];
    @api year;
    get options() {
        return [
            { label: 'Regional Expenses ' + this.years[0], value: this.years[0] },
            { label: 'Regional Expenses ' + this.years[1], value: this.years[1] },
            { label: 'Regional Expenses ' + this.years[2], value: this.years[2] },
            { label: 'Regional Expenses ' + this.years[3], value: this.years[3] }
        ];
    }

    handleChange(event) {
        this.year = event.detail.value;
        this.label = 'Regional Expenses ' + this.year;
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
   
    helper = ['Office 1','Office 2','Office 3','Office 4' ];
    officePicklist = [];
    contactMetadata = [];
    office;
   // @api year = 2023;//@api year;
    llll = [];
  
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })

    contactMetadata;

    @wire(getPicklistValues,

        {
            recordTypeId: '$contactMetadata.data.defaultRecordTypeId', 
            fieldApiName: OFFICE_FIELD
        }
    )
  getPickList(result){
    if(result.data){
       let oofficePicklist = result.data.values;
       this.officePicklist = [...oofficePicklist];
       this.office =  this.officePicklist[0].value;
     
       console.log(this.officePicklist);
       console.log(this.office);
    }
    
}

@wire(getOfficeBalanceNow,{office:'$office'})
getOfBal({ error, data }) {
if (data) {
    this.officeBalanceNow = data;
    console.log(this.officeBalanceNow);
    this.error = undefined;
} else if (error) {
    this.error = error;
    this.officeBalanceNow = undefined; 
    console.log('Something went wrong:', error);
    console.error('e.message => ' + e.message );
  }
 }
@wire(getMonthlyAverage,{year:'$year',office:'$office'})
getMonAv({ error, data }) {
if (data) {
    this.monthlyAverage = data[0];
    console.log(this.monthlyAverage );
    this.error = undefined;
} else if (error) {
    this.error = error;
    this.monthlyAverage = undefined; 
    console.log('Something went wrong:', error);
    console.error('e.message => ' + e.message );
  }
 }

     @wire(getSumList,{year:'$year'})
     getSumList({ error, data }) {
       if (data) {
           this.sumList = data;
           this.january = data[0];
           this.february = data[1];
           this.march = data[2];
           this.april = data[3];
           this.may = data[4];
           this.june = data[5];
           this.july = data[6];
           this.august = data[7];
           this.september = data[8];
           this.october = data[9];
           this.november = data[10];
           this.december = data[11];
           console.log(this.sumList);
           this.error = undefined;
       } else if (error) {
           this.error = error;
           this.sumList = undefined; 
           console.log('Something went wrong:', error);
           console.error('e.message => ' + e.message );
         }
        }
 
        @wire(getYearSum,{year:'$year'})
        getYME({ error, data }) {
        if (data) {
            this.yearExpenseSum = data;
            console.log(this.officeBalanceNow);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.yearExpenseSum = undefined; 
            console.log('Something went wrong:', error);
            console.error('e.message => ' + e.message );
          }
         }
        //  @wire(getOfficeMonthlySpentAmount,{year:'$year',office:'$office'})
        //  getMonAv({ error, data }) {
        //  if (data) {
        //      this.officeMonthlySpentAmount = data;
        //      this.januarySpentAmount = data[0];
        //      this.februarySpentAmount = data[1];
        //      this.marchSpentAmount = data[2];
        //      this.aprilSpentAmount = data[3];
        //      this.maySpentAmount = data[4];
        //      this.juneSpentAmount = data[5];
        //      this.julySpentAmount = data[6];
        //      this.augustSpentAmount = data[7];
        //      this.septemberSpentAmount = data[8];
        //      this.octoberSpentAmount = data[9];
        //      this.novemberSpentAmount = data[10];
        //      this.decemberSpentAmount = data[11];
            
        //      this.error = undefined;
        //  } else if (error) {
        //      this.error = error;
        //      this.officeMonthlySpentAmount = undefined; 
        //      console.log('Something went wrong:', error);
        //      console.error('e.message => ' + e.message );
        //    }
        //   }
        
        officeClickHandler(event) {
            this.maneTable = true;
            this.modalOfficeName = event.target.title;
            this.office = event.target.title;
            //    let value = event.target.value;
       //     if(element === 'Amount') {
       //         this.amountInput = value;
            }
            closeModal(){
       
                this.isModalOpen = false;     
         }
       
        
}
