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
      //  @AuraEnabled
      //  public static void populateData(Id keeperId,String office,Boolean isEmployee,Boolean isAdmin,Boolean selector){
      //    try {
      //     // String a = 'adfh123edrftghu789';
      //     // Id i = Id.valueOf(a);
      //   //  Id i = Id.valueOf(a);
      //      String keeperIdStr = Id.valueOf(keeperId);
      //      Helper__c helper = new Helper__c(KeeperId__c = keeperIdStr,Office__c = office,
      //      IsEmployee__c = isEmployee,IsAdmin__c = isAdmin,Selector__c = selector);
           
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static List<Helper__c> getData(){
      //    try {
      //      List<Helper__c> helperList = [select KeeperId__c,Office__c,
      //      IsEmployee__c,IsAdmin__c,Selector__c from Helper__c LIMIT 1];
      //      return helperList;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static Id getKeeperId(){
      //    try {
      //     List<Helper__c> dataList =  getData();
      //     Id keeperId = Id.valueOf(dataList[0].KeeperId__c);
      //     return keeperId;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static String getOfficeData(){
      //    try {
      //     List<Helper__c> dataList =  getData();
      //     String office = dataList[0].Office__c;
      //     return office;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static Boolean getIsEmployee(){
      //    try {
      //     List<Helper__c> dataList =  getData();
      //     Boolean isEmployee = dataList[0].IsEmployee__c;
      //     return isEmployee;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static Boolean getIsAdmin(){
      //    try {
      //     List<Helper__c> dataList = getData();
      //     Boolean isAdmin = dataList[0].IsAdmin__c;
      //     return isAdmin;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled(cacheable = true)
      //  public static Boolean getSelector(){
      //    try {
      //     List<Helper__c> dataList =  getData();
      //    Boolean selector = dataList[0].Selector__c;
      //     return selector;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
      //  @AuraEnabled
      //  public static void deleteHelper(){
      //    try {
      //     List<Helper__c> helperList = [select KeeperId__c,Office__c,
      //     IsEmployee__c,IsAdmin__c,Selector__c from Helper__c LIMIT 1];
      //     delete helperList;
      //    } catch (Exception e) {
      //      throw new AuraHandledException(e.getMessage());
      //    }
      //  }
    }