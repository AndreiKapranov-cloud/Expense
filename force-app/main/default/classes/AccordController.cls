public with sharing class AccordController {
   
@AuraEnabled(cacheable=true)
public static List<ExpenseCard__c> getExpenseCards(Date cardDate,String login,String password){
    try {
       
        return [Select Description__c,Amount__c,CardDate__c from ExpenseCard__c
        where CardDate__c =: cardDate AND CardKeeper__r.Password__c =: password 
        AND CardKeeper__r.Email =: login ];
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
  }
 
  @AuraEnabled(cacheable = true)
  public static List<Decimal> getSum(Date cardDate,String login,String password){
      try {
        Decimal total = 0;
        List <ExpenseCard__c> exList =  getExpenseCards(cardDate, login,password);
        List<Decimal>sumList = new List<Decimal>();
        for(Expensecard__c exCard : exList){
        total = total + exCard.Amount__c;
        }
        sumList.add(total);
        return sumList;
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
  @AuraEnabled
  public static void deleteCard(Id cardId){
      try {
         List<ExpenseCard__c>exList = [select Id,Amount__c,MonthlyExpense__c from ExpenseCard__c where Id =: cardId LIMIT 1];
         List <MonthlyExpense__c> monExList = [select Balance__c from MonthlyExpense__c where Id = :exList[0].MonthlyExpense__c LIMIT 1];     
         monExList[0].Balance__c += exList[0].Amount__c;
         upsert monExList;
          
         delete exList[0];
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
  
}
