public with sharing class EmployeeController {
    public EmployeeController() {
    }
    @AuraEnabled
    public static  List<ExpenseCard__c> getCardList(Date cardDay,String login){
        try {
          List<Contact> con_List=[Select Id,Email,Password__c,Admin__c from Contact where Email =: login Limit 1];
     
          List<ExpenseCard__c> expCard_List=[Select Id,Description__c,Amount__c,CardDate__c from ExpenseCard__c where CardKeeper__r.Password__c =: con_List[0].Password__c Limit 1];
      
          return expCard_List;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Table__c> getTables(){
        try {
           List <Table__c> tabList = [select Month__c,Income__c,Amount__c from Table__c];
            return tabList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<MonthlyExpense__c> getMonthlyExpense(Integer year){
        try {
            Integer firstMonth = 1;
            Integer firstDay = 1;
            Integer lastMonth = 12;
            Integer lastDay = 31;

            Date previousYear = Date.newInstance(year, firstMonth, firstDay) - 1;
            Date nextYear = Date.newInstance(year, lastMonth, lastDay) + 1;
           List <MonthlyExpense__c> me = [select Balance__c,SpentAmount__c,Keeper__r.Email,monthDate__c,Name from MonthlyExpense__c
            where monthDate__c > :previousYear AND monthDate__c < :nextYear ];
            return me;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    

  
    @AuraEnabled
    public static List<Table__c>  populateMonths(Integer year){
        try {
            List <MonthlyExpense__c> monExList = getMonthlyExpense(year);
            
          
          
            List<Table__c>listForTable = new List<Table__c>();
           
            List<String>monthList = new List<String>{'January       ','February      ','March         ','April         ','May           ',
            'June          ','July          ','August        ','September     ','October       ','November      ','December      '};
         
            Map<String, Table__c> tabMap = new Map<String, Table__c>();
           
               for(String month : monthList){
                Table__c tab = new Table__c(Month__c = month,Year__c = Decimal.valueOf(year));
                listForTable.add(tab); 
                tabMap.put(tab.Month__c,tab);
            }

            Map<Integer,String> monthNames = new Map<Integer,String>{
                1 => 'January       ',
                2 => 'February      ',
                3 => 'March         ',
                4 => 'April         ',
                5 => 'May           ',
                6 => 'June          ',
                7 => 'July          ',
                8 => 'August        ',
                9 => 'September     ',
                10 => 'October       ',
                11 => 'November      ',
                12 => 'December      '
            };
           
          for(MonthlyExpense__c mon : monExList){
         
            Table__c tab = tabMap.get(monthNames.get(mon.MonthDate__c.month()));
            tab.Amount__c =  mon.SpentAmount__c;
            tab.Income__c =  mon.Balance__c + mon.SpentAmount__c;

             }
          List<Table__c> oldList = [select Id from Table__c];
          delete oldList;
          insert listForTable;
          return listForTable;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static Integer getYear(){
        try {
           List <Table__c> listForTable = [select Id,Year__c from Table__c];
           Integer year = Integer.valueOf(listForTable[0].Year__c);
           return year;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Integer> getYearForTab(){
        try {
            Date now = date.today();
            Integer yearNow = now.Year();
            Integer firstYear = yearNow - 2;
            Integer secondYear = yearNow - 1;
            Integer fourthYear = yearNow + 1;
            List<Integer> years = new List<Integer>{firstYear,secondYear,yearNow,fourthYear}; 
            return years;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Date> populateDates(Integer year,Integer month){
        try {
       
        List<Date>dateList = new List<Date>();
    
        Date monthBeginning = Date.newInstance(year, month, 1);
        Date monthEnd = Date.newInstance(year, month+1, 1) - 1;
        while(monthBeginning <= monthEnd) {
            dateList.add(monthBeginning);
            monthBeginning = monthBeginning.addDays(1);
        }
        
      
      return dateList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static Integer getAmountTotal(){
        try {
    Integer amountTotal = 0;
    List <MonthlyExpense__c> monExList = getMonthlyExpense(getYear());
    
    for(MonthlyExpense__c mE : monExList){
    amountTotal = amountTotal + Integer.valueOf(mE.SpentAmount__c);
  }
    return amountTotal;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static Integer getYearIncome(){
        try {
       return getAmountTotal() + getYearBalance();
      } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
/*@AuraEnabled(cacheable=true)
public static List<Accord__c> getAccords(Integer year,Integer month){
    try {
        Date monthBeginning = Date.newInstance(year, month, 1);
        Date monthEnd = Date.newInstance(year, month + 1, 1) - 1;
        List<Accord__c> acdList = [select CardDate__c,ExpenseCard__c,Name from Accord__c
        where CardDate__c >= :monthBeginning AND CardDate__c <= :monthEnd];
        return acdList;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}*/









@AuraEnabled(cacheable = true)
public static Integer getYearBalance(){
    try {
        List <MonthlyExpense__c> monExList = getMonthlyExpense(getYear());

        Integer yearBalance = 0;
        for(MonthlyExpense__c mE : monExList){
            yearBalance = yearBalance + Integer.valueOf(mE.Balance__c);
        }
        return yearBalance;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}


@AuraEnabled(cacheable=true)
public static List<Accord__c> getAccords(){
    try {
        
        List<Accord__c> acdList = [select CardDate__c,ExpenseCard__c,Name from Accord__c
     ];
        return acdList;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
   @AuraEnabled
   public static List<Accord__c> getAccordWithExCards(Integer month){
       try {
      List<Table__c> tabList = [select Year__c from Table__c];   
      Integer year = Integer.valueOf(tabList[0].Year__c);
      List<Accord__c> acdList = new List<Accord__c>();
      List<Date> dates = populateDates(year,month + 1);
      for(Date dt : dates){
          Accord__c acd = new Accord__c(CardDate__c = dt);
          acdList.add(acd);
      }
      Date beginningOfMonth = dates[0];
      Date endOfMonth = dates.get(dates.size() - 1);
      
      List <ExpenseCard__c> exCards = [select CardDate__c,Description__c,Amount__c from ExpenseCard__c
      where CardDate__c >= :beginningOfMonth AND CardDate__c<= :endOfMonth ];
      Map<Date, ExpenseCard__c> exCardsMap = new Map<Date, ExpenseCard__c>();
     
      for(ExpenseCard__c eC : exCards){
       
        exCardsMap.put(eC.CardDate__c,eC);
    }


      for(Accord__c acd : acdList){
     
       
      
      //  ExpenseCard__c card = exCardsMap.get(acd.CardDate__c);
      //  acd.ExpenseCard__c = card.Id;

        for(ExpenseCard__c exc : exCards){
              if(exc.CardDate__c == acd.CardDate__c){
                acd.ExpenseCard__c = exc.Id;
              }
          }
      }
    List<Accord__c> oldAccords = [select Id from Accord__c];
    delete oldAccords;
    insert acdList; 
    return acdList;
       } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
    }
    
    @AuraEnabled
    public static void saveExpenseCard(Integer amount,Date cardDate,String description,
    Id cardKeeperId){
        try {
         ExpenseCard__c exCard = new ExpenseCard__c(Amount__c = amount,CardDate__c =
         cardDate,Description__c = description,CardKeeper__c = cardKeeperId);
         insert exCard; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void saveIncomeInput(Integer income,Date incomeDate,Id keeper){
        try {
         Date monthBeginning = incomeDate.toStartOfMonth();
         Date monthEnd = date.newInstance(incomeDate.year(), incomeDate.month()+1,1)-1;
         List<MonthlyExpense__c> mEList = [select Id,Balance__c from MonthlyExpense__c
         where Monthdate__c  < :monthEnd AND Monthdate__c > :monthBeginning];
         if(mEList.size() > 0){
         mEList[0].Balance__c = mEList[0].Balance__c + income;
         update mEList;
         }else{
            MonthlyExpense__c newMExpense = new  MonthlyExpense__c(
                MonthDate__c = incomeDate,Keeper__c = keeper,Balance__c = income
            );
         insert newMExpense;
         }
         
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
