public with sharing class LoginController {
    public LoginController() {     
     }
    @AuraEnabled
    public static String getDetails(String login, String password){ 
        try {
        List<Contact> con_List=[Select Id,Email,Password__c,Admin__c from Contact where Email =: login Limit 1];
        if(login == ''){
            return 'Enter login'; 
        }else if(con_List.size() == 0)
         {
            return 'User does not exist'; 
         }
         else
         {
             if(con_List[0].Password__c==password && con_List[0].Password__c != null)
             {
                 return con_List[0].Admin__c?'Admin':'Employee';
             }
             else
             {
                 return 'Invalid password please try again!!!!';
             }
        }
    } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
      }
    }