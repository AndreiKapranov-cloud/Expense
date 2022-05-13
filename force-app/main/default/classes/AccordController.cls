public with sharing class AccordController {
    public AccordController() {

    }
    @AuraEnabled(cacheable=true)
public static List<Accord__c> getAccords(){
    try {
        Integer maxDaysInAMonth = 31;
        List<Accord__c> acdList = [select CardDate__c,ExpenseCard__c,Name from Accord__c
        Limit :maxDaysInAMonth];
        
        return acdList;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled(cacheable=true)
public static List<ExpenseCard__c> getExpenseCards(Date cardDate){
    try {
        
        return [select Amount__c,Description__c,CardDate__c 
        from ExpenseCard__c where CardDate__c =: cardDate];

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled(cacheable = true)
  public static Integer getSum(Date cardDate){
      try {
        Integer total = 0;
        List <ExpenseCard__c> exList =  getExpenseCards(cardDate);
        for(Expensecard__c exCard : exList){
        total = total + Integer.valueOf(exCard.Amount__c);
        }
        return total;
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
  @AuraEnabled
  public static void deleteCard(Id cardId){
      try {
          List<ExpenseCard__c>exList = [select Id from ExpenseCard__c where Id =: cardId];
          delete exList[0];
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
}
