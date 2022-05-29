public with sharing class LoginController {
    
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
      public static Contact getContact(String login, String password){
        try {
          List<Contact> con_List=[Select Id,Email,Password__c,Admin__c,Office__c from Contact where Email =: login
          AND Password__c = :password Limit 1];
          return con_List[0];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
      }
    
    
          @AuraEnabled(cacheable = true)
      public static string getOffice(String login, String password){
          try {
            Contact con = getContact(login,password);
            String office = con.Office__c;
            return office;
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
       }
       @AuraEnabled(cacheable = true)
      public static Id getId(String login, String password){
          try {
            Contact con = getContact(login,password);
            Id keeperId = con.Id;
            return keeperId;
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
       }
    }