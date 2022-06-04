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
    

//   connectedCallback(){
//     let keepId = getKeeperId();
//     if(keepId){
//     this.keeperId = keepId;
//     }
//     let off = getOfficeData();
//     if(off){
//     this.office = off;
//     }
//    let adm = getIsAdmin();
//    if(adm){
//     this.isAdmin = adm;
//    }
//     let emp = getIsEmployee();
//     if(emp){
//     this.isEmployee = emp;
//    }
//     let sel = getSelector();
//     if(sel){
//     this.selector = sel;
//     }
//    }
//    disconnectedCallback(){
//     this.deleteHelper();
//    }
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
                                    //    c__propertyValue: '500',

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
            //    await populateData({keeperId:this.keeperId,office:this.office,
            //     isEmployee:this.isEmployee,isAdmin:this.isAdmin,selector:this.selector});
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



    //  keeperId;
//  expPict = EXPENSES;
//  office;
//  login;
//  password;
//  error;
//  result;
//  isAdmin = false;
//  isEmployee = false;
//  selector = false;
 
//  // connectedCallback(){
//      // this.clearCookie();
   
//     // this.clearLoginCookie();
//     // this.clearPasswordCookie();
//     // this.clearIsEmployeeCookie();
//     // this.clearSelectCookie();
//     // this.clearOfficeCookie();    
//     // this.clearKeeperIdCookie();

   
//     // this.checkSelectorCookie();
  
//     // this.checkLoginCookie();
//     // this.checkPasswordCookie();
//     // this.checkIsEmployeeCookie();
   
  
//  //}
    
//     // clearLoginCookie() {
//     //     this.setCookie('login','',20);
//     // }
//     // clearPasswordCookie() {
//     //     this.setCookie('password','',20);
//     // }
//     // clearIsEmployeeCookie() {
//     //     this.setCookie('isEmployee','',20);
//     // }
//     // clearSelectCookie() {
//     //     this.setCookie('selector','',20);
//     // }
//     // clearOfficeCookie() {
//     //     this.setCookie('office','',20);
//     // }
//     // clearKeeperIdCookie() {
//     //     this.setCookie('keeperId','',20);
//     // }

//     handleLoginInput(event) {
//         let element = event.target.name;
//         let value = event.target.value;
//         if(element === 'inputLogin') {
//             this.login = value;
//         }
//     }
//     handlePassInput(event) {
//         let element = event.target.name;
//         let value = event.target.value;
//         if(element === 'inputPassword') {
//             this.password = value;
//         }
//     }
//  async handleClick() {
//     this.error = '';
//     try {   
       
//               this.result = await getDetails({
//                 login: this.login,password: this.password
//             });
  
//             switch (this.result) { 
//                 case 'Enter login': const eevt = new ShowToastEvent({
//                     title: 'Error',
//                     message: 'Login not entered',
//                     variant: 'error',
//                     mode: 'dismissable'
//                 });
//                 this.dispatchEvent(eevt);     
//                 break;    
//                 case 'User does not exist':  const evt = new ShowToastEvent({
//                     title: 'Error',
//                     message: 'User does not exist',
//                     variant: 'error',
//                     mode: 'dismissable'
//                 });
//                 this.dispatchEvent(evt);     
//                 break;
//                 case 'Admin':
//                               this.selector = true;
//                               this.isAdmin = true;
//                             //   this.clearPasswordCookie();
//                             //   this.clearIsEmployeeCookie();
//                             //   this.clearSelectCookie();
                             
//                 break;
//                 case 'Employee':  
                             
                              
//                                 // this.clearPasswordCookie();
//                                 // this.clearIsEmployeeCookie();
//                                 // this.clearSelectCookie();
                               
                              
//                             //   this.setCookie('login',this.login,0.00000003);
//                             //   this.setCookie('password',this.password,0.00000003);
//                             //   this.setCookie('selector','true',0.00000003);
//                             //   this.setCookie('isEmployee','true',0.00000003);
//                             //   this.selector = true;
//                             //   this.isEmployee = true;
                           
//                 break;
//                 case 'Invalid password please try again!!!!': const vt = new ShowToastEvent({
//                     title: 'Error',
//                     message: 'Invalid password please try again!!!!',
//                     variant: 'error',
//                     mode: 'dismissable'
//                 });
//                 this.dispatchEvent(vt); 
//                 break;
    
//             }
//             this.office = await  getOffice({
//                 login: this.login,password: this.password
//             });
           
//             this.keeperId = await getId({
//                 login: this.login,password: this.password
//             });
             
//     } catch (error) {
//         console.error(error);
//         this.error = error;
//         const evt = new ShowToastEvent({
//             title: 'Error',
//             message: 'User not found',
//             variant: 'error',
//             mode: 'dismissable'
//         });
//         this.dispatchEvent(evt);  
//     }
//   }

//     // setCookie(cname,cvalue,exdays) {
//     //     const d = new Date();
//     //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     //     let expires = "expires=" + d.toUTCString();
//     //     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
//     // }

//     // getCookie(cname) {
//     //     let name = cname + "=";
//     //     let decodedCookie = decodeURIComponent(document.cookie);
//     //     let ca = decodedCookie.split(';');
//     //     for(let i = 0; i < ca.length; i++) {
//     //     let c = ca[i];
//     //     while (c.charAt(0) == ' ') {
//     //         c = c.substring(1);
//     //     }
//     //     if (c.indexOf(name) == 0) {
//     //         return c.substring(name.length, c.length);
//     //     }
//     //     }
//     //     return "";
//     // }
    
   
   
   
//     // checkLoginCookie(){
//     // let value = this.getCookie('login');
//     // if(value){
//     // this.login = value;
//     //     } 
//     // }
//     // checkPasswordCookie(){
//     // let value = this.getCookie('password');
//     // if(value){
//     // this.password = value;
//     //     } 
//     // }
//     // checkSelectorCookie(){
//     // let value = this.getCookie('selector');
//     // if(value){
//     // this.selector = value;
//     //     }
//     // }
//     // checkIsEmployeeCookie(){
//     // let value = this.getCookie('isEmployee');
//     //     if(value){
//     // this.isEmployee = value;
//     //     }
//     // }
//     // checkOfficeCookie(){
//     //     let value = this.getCookie('office');
//     //     if(value){
//     //     this.office = value;
//     //     }                          
//     //     }
//     // checkKeeperIdCookie(){
//     // let value = this.getCookie('keeperId');
//     //     if(value){
//     // this.keeperId = value;
//     //     }
//     // }
//     }

 
