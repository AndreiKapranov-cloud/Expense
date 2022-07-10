trigger OnCreateExpenseCard on ExpenseCard__c (before insert) {
    for(SObject sobj :Trigger.new){
    ExpenseCard__c eC = (ExpenseCard__c) sobj;
    if(eC.Amount__c < 0){
        eC.addError('Amount__c', 'Only Positive Numbers.');
    }
 }
     List<ExpenseCard__c> exCardList = trigger.new;
     ExpenseCard__c exCard = exCardList[0];
     Date cardDate = exCard.cardDate__c;
     Date monthBeginning = Date.newInstance(cardDate.year(), cardDate.month(), 1);
     Date monthEnd = Date.newInstance(cardDate.year(), cardDate.month() + 1, 1) -1;
         
 	List <MonthlyExpense__c> existingMExpenseList = [select MonthDate__c,Balance__c from MonthlyExpense__c
                                     where MonthDate__c >= :monthBeginning AND 
                               MonthDate__c <= :monthEnd AND Keeper__c = :exCard.CardKeeper__c LIMIT 1];
   
    if (existingMExpenseList.size() == 0){
       MonthlyExpense__c newMonExpense = new MonthlyExpense__c(
       Keeper__c = ExCard.CardKeeper__c,MonthDate__c = cardDate,Balance__c = -exCard.Amount__c);
       insert newMonExpense;
       List<MonthlyExpense__c> mon = [select Id from MonthlyExpense__c where MonthDate__c =: cardDate ];
       ExCard.MonthlyExpense__c = mon[0].Id;
    }else{
        if(existingMExpenseList.size() > 0) {
 
        ExCard.MonthlyExpense__c = existingMExpenseList[0].Id;
        existingMExpenseList[0].Balance__c -= exCard.Amount__c;
        update existingMExpenseList[0];
        }
    }
}