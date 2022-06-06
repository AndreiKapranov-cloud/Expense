import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement,track,api} from 'lwc';
import EXPENSES from '@salesforce/resourceUrl/exp';
import getDetails from '@salesforce/apex/LoginController.getDetails';
import getOffice from '@salesforce/apex/LoginController.getOffice';
import getId from '@salesforce/apex/LoginController.getId';
import { NavigationMixin } from 'lightning/navigation';
// import populateData from '@salesforce/apex/LoginController.populateData';
// import getData from '@salesforce/apex/LoginController.getData';
// import getKeeperId from '@salesforce/apex/LoginController.getKeeperId';
// import getOfficeData from '@salesforce/apex/LoginController.getOfficeData';
// import getIsEmployee from '@salesforce/apex/LoginController.getIsEmployee';
// import getIsAdmin from '@salesforce/apex/LoginController.getIsAdmin';
// import getSelector from '@salesforce/apex/LoginController.getSelector';
// import deleteHelper from '@salesforce/apex/LoginController.deleteHelper';
export default class LoginPage extends NavigationMixin(LightningElement) {
    keeperId;
    expPict = EXPENSES;
    office;
    @track login;
    @track password;
    error;
    result;
    isAdmin = false;
    isEmployee = false;
    selector = false;
    
    handleLoginInput(event) {
       let element = event.target.name;
       let value = event.target.value;
       if(element === 'inputLogin') {
           this.login = value;
       }
   }
   handlePassInput(event) {
       let element = event.target.name;
       let value = event.target.value;
       if(element === 'inputPassword') {
           this.password = value;
       }
   }
    async handleClick() {
       this.error = '';
       try {   
               this.result = await getDetails({
                   login: this.login,password: this.password
               });
     
               switch (this.result) { 
                   case 'Enter login': const eevt = new ShowToastEvent({
                       title: 'Error',
                       message: 'Login not entered',
                       variant: 'error',
                       mode: 'dismissable'
                   });
                   this.dispatchEvent(eevt);     
                   break;    
                   case 'User does not exist':  const evt = new ShowToastEvent({
                       title: 'Error',
                       message: 'User does not exist',
                       variant: 'error',
                       mode: 'dismissable'
                   });
                   this.dispatchEvent(evt);     
                   break;
                   case 'Admin':
                                 this.selector = true;
                                 this.isAdmin = true;

                                 this[NavigationMixin.Navigate]({
                                    type: "standard__component",
                                    attributes: {
                                        componentName: "c__NavigateToLWCAdmin"
                                    },
                                    state: {
                                    }
                                });
                   break;
                   case 'Employee':  
                                 this.selector = true;
                                 this.isEmployee = true;
                                
                                 this.office = await getOffice({
                                    login: this.login,password: this.password
                                });
                                this.keeperId = await getId({
                                    login: this.login,password: this.password
                                });

                                this[NavigationMixin.Navigate]({
                                    type: "standard__component",
                                    attributes: {
                                        componentName: "c__NavigateToLWC"
                                    },
                                    state: {
                                   
                                        c__office: this.office,
                                        c__keeperId: this.keeperId,
                                        c__login: this.login,
                                        c__password: this.password
                                    }
                                });
                   break;
                   case 'Invalid password please try again!!!!': const vt = new ShowToastEvent({
                       title: 'Error',
                       message: 'Invalid password please try again!!!!',
                       variant: 'error',
                       mode: 'dismissable'
                   });
                   this.dispatchEvent(vt); 
                   break;
       
               }
       
               this.office = await getOffice({
                   login: this.login,password: this.password
               });
               this.keeperId = await getId({
                   login: this.login,password: this.password
               });

       } catch (error) {
           console.error(error);
           this.error = error;
           const evt = new ShowToastEvent({
               title: 'Error',
               message: 'User not found',
               variant: 'error',
               mode: 'dismissable'
           });
           this.dispatchEvent(evt);  
       }
     }
   }



