import { LightningElement,api,wire,track } from 'lwc';
import getExpenseCards from '@salesforce/apex/AccordController.getExpenseCards';
import getSum from '@salesforce/apex/AccordController.getSum';
import deleteCard from '@salesforce/apex/AccordController.deleteCard';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import messageChannel from '@salesforce/messageChannel/DeleteCardMessageChannel__c';
import {publish, MessageContext} from 'lightning/messageService'
import messageChannelForAccord from '@salesforce/messageChannel/DisplayNewCardOnAccordTabMessageChannel__c';
import {subscribe} from 'lightning/messageService';
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
    cardListData;
    sumData;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }
 
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, messageChannelForAccord, (message) => {
            return this.refresh();
            });
        }
    }


    @wire(getExpenseCards,{cardDate:'$cardDate',login:'$login',password:'$password'})
    cards(wireResult) {
   
        const { data, error } = wireResult;
        this.cardListData = wireResult;
  
   
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
    sum(wireResult) {
    
        const { data, error } = wireResult;
        this.sumData = wireResult;

    if (data) {
        this.sum = data[0];
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
            refreshApex(this.sumData);
            return this.refresh();
        })
        .then(() => {
            const deleteEvent = new CustomEvent();
            this.dispatchEvent(deleteEvent);
          })
          .then(() => {
            let message = {messageText: 'need refresh'};
            publish(this.messageContext, messageChannel, message);
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

  }
    handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
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
     })
    .then(() => {
        let message = {messageText: 'need refresh'};
        publish(this.messageContext, messageChannel, message);
      })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Changes Not Saved!',
                variant: 'error'
            })
        );
    }).finally(() => {
        this.saveDraftValues = [];
    });
}

async refresh() {  
    await refreshApex(this.cardListData);
    await refreshApex(this.sumData);
 }

}