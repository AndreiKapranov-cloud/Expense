public with sharing class AdminController {
    @AuraEnabled(cacheable = true)
    public static Decimal getOfficeMonthlyExpense(Integer year,Integer month,String office){
        try {
            Date monthBeginning = Date.newInstance(year, month, 1);
            Date monthEnd = Date.newInstance(year, month + 1, 1) - 1;
            List<Contact> keepers = [select 
            (select SpentAmount__c,MonthDate__c from MonthlyExpenses__r WHERE
            MonthDate__c > :monthBeginning AND MonthDate__c < :monthEnd)
            from Contact WHERE Office__c = :office];  

            Decimal officeExpenses = 0;
            for(Contact con : keepers){
                for(MonthlyExpense__c mE : con.MonthlyExpenses__r){
                 officeExpenses += mE.SpentAmount__c;
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string poulateTable(){
        try {


            
            AdminTable__c.MonthName__c
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    
    
    
   
}
