trigger OnUpdateCardAmount on ExpenseCard__c (before update) {
   for(SObject sobj :Trigger.new){
    ExpenseCard__c eC = (ExpenseCard__c) sobj;
    if(eC.Amount__c < 0){
        eC.addError('Amount__c', 'Only Positive Numbers.');
    }
 }   
    List<Id>monExIdList = new List<Id>();
    Decimal difference = 0;
    List<Integer> difList = new List<Integer>(); 
    List<Id> idList = new List<Id>();
    Map<Id,Decimal> difMonExMap = new Map<Id,Decimal>();
    
    for(Integer i=0; i<trigger.new.size(); i++){
        if(trigger.new[i].Amount__c != trigger.old[i].Amount__c){     
            difference = trigger.new[i].Amount__c - trigger.old[i].Amount__c;
            Id monExId = trigger.new[i].MonthlyExpense__c;
            idList.add(monExId);
            difMonExMap.put(monExId,difference);    
        }
        List <MonthlyExpense__c>monExList = [select Balance__c from MonthlyExpense__c where                                            Id in :idList];
        for(MonthlyExpense__c mE: monExList){
            Decimal difference = difMonExMap.get(mE.Id);
            mE.Balance__c -= difference;         
        }
        update monExList;
   }   
}