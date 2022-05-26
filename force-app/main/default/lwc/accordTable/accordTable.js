import { LightningElement,api,wire,track } from 'lwc';
import getExpenseCards from '@salesforce/apex/AccordController.getExpenseCards';
import getSum from '@salesforce/apex/AccordController.getSum';
import deleteCard from '@salesforce/apex/AccordController.deleteCard';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const columns = [{
    label: 'DESCRIPTION',
    fieldName: 'Description__c',
    type: 'string',
    editable: true
},
{
    label: 'AMOUNT',
    fieldName: 'Amount__c',
    type: 'currency',
    editable: true
},
{
    type: "button",
    fixedWidth: 150,
    typeAttributes: {
        label: 'Delete',
        title: 'Delete',
        name: 'Delete',
        value: 'Delete',
        disabled: false,  
        variant: 'base',
       class: 'scaled-down'
    }
}];

export default class AccordTable extends LightningElement {
    saveDraftValues = [];
    cardId = '';
    @track columns = columns; 
    @api cardDate;
    @track cardList;
    @track sum;
    @api login;
    @api password;


    @wire(getExpenseCards,{cardDate:'$cardDate',login:'$login',password:'$password'})
    cards({ error, data }) {
    if (data) {
        this.cardList = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.cardList = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  @wire (getSum,{cardDate:'$cardDate',login:'$login',password:'$password'})
  sum({ error, data }) {
    if (data) {
        this.sum = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.sum = undefined; 
        console.log('Something went wrong:', error);
        console.error('e.message => ' + e.message );
    }
  }
  handleRowAction( event ) {  
          
    this.cardId = event.detail.row.Id; 
    const actionName = event.detail.action.name;  
   if(actionName ===  'Delete'){
   deleteCard({ cardId: this.cardId })
        .then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record Deleted Successfully!!',
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
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        });
    }
//    if (actionName === 'soldProducts') {
  
//         this.isModalOpen = true;
 
//     }
  

    // let delayInMilliseconds = 1000;

    // setTimeout(function() {
    //    window.location.reload();
 
    // }, delayInMilliseconds);
  }
  handleSave(event) {
    this.saveDraftValues = event.detail.draftValues;
    const recordInputs = this.saveDraftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });

    // Updateing the records using the UiRecordAPi
    const promises = recordInputs.map(recordInput => updateRecord(recordInput));
    Promise.all(promises).then(res => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Records Updated Successfully!!',
                variant: 'success'
            })
        );
        this.saveDraftValues = [];
        return this.refresh();
    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'An Error Occured!!',
                variant: 'error'
            })
        );
    }).finally(() => {
        this.saveDraftValues = [];
    });
}

// This function is used to refresh the table once data updated
async refresh() {
    await refreshApex(this.cardList);
 }
}