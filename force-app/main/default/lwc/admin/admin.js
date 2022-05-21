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

import CONTACT_OBJECT from '@salesforce/schema/Contact';


import OFFICE_FIELD from '@salesforce/schema/Contact.Office__c';
const picColumns = [
    {
        
                label: 'Month',
                fieldName: 'MonthlyAverage__c',
                type: 'string',
                editable: false,
                
            
    }, {
        
        label: 'Month',
        fieldName: 'BalanceNow__c',
        type: 'string',
        editable: false,
        
    
}, {
        
    label: 'Month',
    fieldName: 'MonthName__c',
    type: 'string',
    editable: false,
    

}, {
        
    label: 'Month',
    fieldName: 'MonthName__c',
    type: 'string',
    editable: false,
    

}
];

const columns=[
    // { "label" : "Name", "apiName" : "Name" ,"fieldType":"text","objectName":"Account"}, 
    // { "label" : "Phone", "apiName" : "Phone" ,"fieldType":"text","type":"phone","objectName":"Account"},
    // { "label" : "Account Source", "apiName" : "AccountSource","fieldType":"picklist","objectName":"Account" }

    // {
    //     label: 'Month',
    //     fieldName: 'MonthName__c',
    //     type: 'string',
    //     editable: false,
    //     cellAttributes: { class: { fieldName: 'MonthlyAmount__c'}}
    // },
    // {
    //     label: 'Office 1',
    //     fieldName: 'MonthlyAmount__c',
    //     type: 'currency',
    //     editable: false,
     
    // },
    // {
    //     label: 'Office 2',
    //     fieldName: 'MonthlyAmount__c',
    //     type: 'currency',
    //     editable: false,
     
    // }, 
    {
        label: 'Office 3',
        fieldName: 'SpentAmount__c',
        type: 'currency',
        editable: false,
       
    }
];
export default class Admin extends LightningElement {
    @track columns = columns; 
    @track picColumns = picColumns;
    @track officeMonthlyExpense = [];
    @track ddd;
    @track officeBalanceNow;
    @track monthlyAverage;
    @track sumList = [];
    @track yearExpenseSum;
  
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
    
    helper = ['Office 1','Office 2','Office 3','Office 4' ];
    officePicklist = [];
    contactMetadata = [];
    office = 'Office 1';
    @api year = 2023;//@api year;
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

    async handleYearClick(event){
       
          try {

           
            let oofficeMonthlyExpense = await populateMonths({year:2022,office:'Office 1'}); 
           
            
            
             console.log(this.officeMonthlyExpense);
            } catch (error) {
              console.error(error);
              this.error = error;
              console.error('e.message => ' + e.message );
          }
        }
  
  
//         @wire(getOfficeMonthlyExpenseForList,{year:2022,office: '$officePicklist'})
//     getME({ error, data }) {
//     if (data) {
//         this.officeMonthlyExpense = data;
//         console.log(this.officeMonthlyExpense);
//         this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.officeMonthlyExpense = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
//   }




  




// @wire(getOfficeMonthlyExpense,{year:2022,office:'$office'})
//      getME({ error, data }) {
//         if (data) {
//           this.llll = data;
//             let ddd = JSON.parse(JSON.stringify(this.llll));
//                 this.officeMonthlyExpense = JSON.parse(JSON.stringify(this.llll));
//              console.log(this.officeMonthlyExpense);
//             this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.officeMonthlyExpense = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
//    }
  



// @wire(getOfficeMonthlyExpense,{year:2022,office:'Office 1'})
//      getME({ error, data }) {
//         if (data) {
        
//                 this.officeMonthlyExpense = data;
//              console.log(this.officeMonthlyExpense);
//             this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.officeMonthlyExpense = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//     }
//    }
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



 


//   @wire(getOfficeMonthlyExpenses,{year:2022,office:'$office'})
//   getOfMonEx({ error, data }) {
//     if (data) {
//         this.officeMonthlyExpense = data;
//         console.log(this.officeMonthlyExpense);
//         this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.officeMonthlyExpense = undefined; 
//         console.log('Something went wrong:', error);
//         console.error('e.message => ' + e.message );
//       }
//      }
     @wire(getSumList,{year:2023})
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
 
        @wire(getYearSum,{year:2023})
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

}
