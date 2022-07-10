public with sharing class EmployeeController {
   
    @AuraEnabled(cacheable =true)
    public static MonthlyExpense__c getMonEx(Integer year,Integer month,String login,String password){
        try {
            Date monthBeginning = Date.newInstance(year, month, 1);
            Date monthEnd = Date.newInstance(year, month + 1, 1) - 1;
          
        
            List<MonthlyExpense__c> meList = [select Balance__c,SpentAmount__c,Keeper__r.Email,monthDate__c,Name from MonthlyExpense__c
            where monthDate__c >= :monthBeginning AND monthDate__c <= :monthEnd AND Keeper__r.Email = :login AND Keeper__r.Password__c =:password];
           
            MonthlyExpense__c me = (meList != null && meList.size()>0) ? meList[0] : null;
             
            return me;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Decimal> getMonExSpentAm(Integer year,Integer month,String login,String password){
        try {
            MonthlyExpense__c me = getMonEx(year,month,login,password);
           
            Decimal spentAmount = 0;
            if (me != null) {
            spentAmount = me.SpentAmount__c;
            }
            List<Decimal>spEmList = new List<Decimal>();
            spEmList.add(spentAmount);
            return spEmList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static List<Decimal> getMonExIncome(Integer year,Integer month,String login,String password){
      try {
       Decimal spentAmount = getMonExSpentAm(year,month,login,password)[0];
       Decimal balance = getMonExBalance(year,month,login,password)[0];
       
       Decimal income = balance + spentAmount;
       List<Decimal>incomeList = new List<Decimal>();
       incomeList.add(income);
       return incomeList;
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
    @AuraEnabled(cacheable = true)
    public static List<Decimal> getMonExBalance(Integer year,Integer month,String login,String password){
        try {
            MonthlyExpense__c me = getMonEx(year,month,login,password);
            Decimal balance = 0;
            if (me != null) {
            balance = me.Balance__c;
            }
            List<Decimal>balanceList = new List<Decimal>();
            balanceList.add(balance);
            return balanceList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<MonthlyExpense__c> getMonthlyExpense(Integer year,String login,String password){
        try {
            Integer firstMonth = 1;
            Integer firstDay = 1;
            Integer lastMonth = 12;
            Integer lastDay = 31;

            Date previousYear = Date.newInstance(year, firstMonth, firstDay) - 1;
            Date nextYear = Date.newInstance(year, lastMonth, lastDay) + 1;
            List <MonthlyExpense__c> me = [select Balance__c,SpentAmount__c,Keeper__r.Email,monthDate__c,Name from MonthlyExpense__c
            where monthDate__c > :previousYear AND monthDate__c < :nextYear AND Keeper__r.Email = :login AND Keeper__r.Password__c =:password];
            return me;
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
    public static List<Decimal> getAmountTotal(Integer year,String login,String password){
        try {
    Decimal amountTotal = 0;
    List <MonthlyExpense__c> monExList = getMonthlyExpense(year,login,password);
    
    for(MonthlyExpense__c mE : monExList){
    amountTotal = amountTotal + mE.SpentAmount__c;
    }
    List<Decimal>amountTotalList = new list<Decimal>();
    amountTotalList.add(amountTotal);
    return amountTotalList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Decimal> getYearIncome(Integer year,String login,String password){
        try {
      
       List<Decimal> yearIncomeList = new List<Decimal>();
       Decimal yearIncome = getAmountTotal(year,login,password)[0] + getYearBalance(year,login,password)[0];
       yearIncomeList.add(yearIncome);
       return yearIncomeList;
    } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

@AuraEnabled(cacheable = true)
public static List<Decimal> getYearBalance(Integer year,String login,String password){
    try {
        List <MonthlyExpense__c> monExList = getMonthlyExpense(year,login,password);

        Decimal yearBalance = 0;
        for(MonthlyExpense__c mE : monExList){
            yearBalance = yearBalance + mE.Balance__c;
        }
        List<Decimal>yearBalanceList = new List<Decimal>();
        yearBalanceList.add(yearBalance);
        return yearBalanceList;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
 }

    @AuraEnabled(cacheable = true)
    public static List<ExpenseCard__c> getExCards(Integer month,Integer year,String login,String password){
        try {
    
    Date monthBeginning = Date.newInstance(year, month, 1);
    Date monthEnd = Date.newInstance(year, month + 1, 1) - 1;
    
       List <ExpenseCard__c> exCards = [select CardDate__c,Description__c,Amount__c from ExpenseCard__c
       where CardDate__c >= :monthBeginning AND CardDate__c<= :monthEnd
       AND CardKeeper__r.Email = :login AND CardKeeper__r.Password__c =:password ];
       Map<Date, ExpenseCard__c> exCardsMap = new Map<Date, ExpenseCard__c>();
      
     return exCards;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
     }
     
    @AuraEnabled
    public static void saveExpenseCard(Decimal amount,Date cardDate,String description,
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
    public static void saveIncomeInput(Decimal income,Date incomeDate,Id keeperId){
        try {
         if(income < 0 ){
            System.assert(false);
         }
         Date monthBeginning = incomeDate.toStartOfMonth();
         Date monthEnd = date.newInstance(incomeDate.year(),incomeDate.month()+1,1)-1;
         List<MonthlyExpense__c> mEList = [select Id,Balance__c from MonthlyExpense__c
         where Monthdate__c  <= :monthEnd AND Monthdate__c >= :monthBeginning
         AND Keeper__c =:keeperId];
        
        
        
        
        
         if(mEList.size() > 0){
         mEList[0].Balance__c = mEList[0].Balance__c + income;
         update mEList;
         }else{
            MonthlyExpense__c newMExpense = new  MonthlyExpense__c(
                MonthDate__c = incomeDate,Keeper__c = keeperId,Balance__c = income
            );
         insert newMExpense;
         }
         
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static List<string> getMonthNameFromNum(Integer num){
        try {
            List<String>monthList = new List<String>{'January','February','March','April','May',
            'June','July','August','September','October','November','December'};
         
            String monthName = monthList[num-1];
            List<String>mNList = new List<String>();
            mNList.add(monthName);
            return mNList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}