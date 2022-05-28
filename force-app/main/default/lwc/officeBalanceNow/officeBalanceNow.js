import { LightningElement,wire,api,} from 'lwc';
import getOfficeBalanceNow from '@salesforce/apex/AdminController.getOfficeBalanceNow';

export default class OfficeBalanceNow extends LightningElement {
@api office;
officeBalanceNow = 0;
zero = 0;

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
}