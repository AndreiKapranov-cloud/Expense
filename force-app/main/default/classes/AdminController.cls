
public with sharing class AdminController {
    @AuraEnabled(cacheable = true)
    public static List <MonthlyExpense__c> getOfficeMonthlyExpenses(Integer year,String office){
        try {
            List<MonthlyExpense__c>officeMonExList = new List<MonthlyExpense__c>();
            Date yearBeginning = Date.newInstance(year, 1, 1);
            Date yearEnd = Date.newInstance( year + 1, 1, 1) - 1;
            List<Contact> keepers = [select 
            (select SpentAmount__c,MonthDate__c,Balance__c from MonthlyExpenses__r WHERE
            MonthDate__c >= :yearBeginning AND MonthDate__c <= :yearEnd)
            from Contact WHERE Office__c = :office];  

           
            for(Contact con : keepers){
                officeMonExList.addAll(con.MonthlyExpenses__r); 
                }
            
            return officeMonExList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   @AuraEnabled(cacheable = true)
   public static Decimal getOfficeMonthlySpentAmount(Integer year,Integer month,String office){
       try {
        Date monthBeginning = Date.newInstance(year, month, 1);
        Date monthEnd = Date.newInstance( year, month + 1, 1) - 1;
      
        Decimal monthlySpentAmount = 0;
        List<MonthlyExpense__c>officeMonExList = new List<MonthlyExpense__c>();
        List<Contact> keepers = [select 
        (select SpentAmount__c,MonthDate__c,Balance__c from MonthlyExpenses__r WHERE
        MonthDate__c >= :monthBeginning AND MonthDate__c <= :monthEnd)
        from Contact WHERE Office__c = :office];
        for(Contact con : keepers){
            officeMonExList.addAll(con.MonthlyExpenses__r); 
            }
        for(MonthlyExpense__c monEx : officeMonExList)
        monthlySpentAmount += monex.SpentAmount__c;
        return monthlySpentAmount;
       } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }
    @AuraEnabled(cacheable = true)
    public static List <MonthlyExpense__c> getOfficeMonthlyExpenseForList(Integer year,List<String> offices){
        try {
            List<MonthlyExpense__c> officeMonExList = new List<MonthlyExpense__c>();
            Date yearBeginning = Date.newInstance(year, 1, 1);
            Date yearEnd = Date.newInstance(year + 1, 1, 1) - 1;
            List<Contact> keepers = [select 
            (select SpentAmount__c,MonthDate__c from MonthlyExpenses__r WHERE
            MonthDate__c > :yearBeginning AND MonthDate__c < :yearEnd)
            from Contact WHERE Office__c IN :offices];  
            Decimal officeExpenses = 0;
            for(Contact con : keepers){
                officeMonExList.addAll(con.MonthlyExpenses__r); 
                }            
            return officeMonExList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
  
    @AuraEnabled
    public static List<AdminTable__c>  populateMonths(Integer year,String office){
        try {
            List <MonthlyExpense__c> monExList =  getOfficeMonthlyExpenses(year,office);
          
            List<AdminTable__c> adTabList = new List <AdminTable__c>();
            List<String>monthList = new List<String>{'January       ','February      ','March         ','April         ','May           ',
            'June          ','July          ','August        ','September     ','October       ','November      ','December      '};
         
            Map<String, AdminTable__c> tabMap = new Map<String, AdminTable__c>();
           
               for(String month : monthList){
                AdminTable__c tab = new AdminTable__c(MonthName__c = month);
                adTabList.add(tab); 
                tabMap.put(tab.MonthName__c,tab);
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
         


            AdminTable__c tab = tabMap.get(monthNames.get(mon.MonthDate__c.month()));
            tab.MonthlyAmount__c =  mon.SpentAmount__c;
            
           
             }
         
          upsert adTabList;
          return adTabList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
      }
      @AuraEnabled(cacheable = true)
      public static List<Decimal> getSumList(Integer year){
          try {
            List<Decimal> sumList = new List<Decimal>{0,0,0,0,0,0,0,0,0,0,0,0};
           
            List <MonthlyExpense__c> monExList = getYearMonthlyExpense(year);
           
            for(MonthlyExpense__c mon : monExList){
                sumList[mon.MonthDate__c.month()-1] += mon.SpentAmount__c;
            }
            return sumList;
            } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
      }
      @AuraEnabled(cacheable = true)
      public static Decimal getOfficeBalanceNow(String office){
          try {
            List <MonthlyExpense__c> monExList =  getOfficeMonthlyExpenses((Date.today()).year(),office);
            List <MonthlyExpense__c> previousYearMonExList = getOfficeMonthlyExpenses((Date.today()).year()-1,office);

            Decimal yearBalance = 0;
            for(MonthlyExpense__c pEME : previousYearMonExList){
                yearBalance = yearBalance + pEME.Balance__c; 
            }
            for(MonthlyExpense__c mE : monExList){
            if(mE.MonthDate__c <= Date.today())
                yearBalance = yearBalance + mE.Balance__c;
            }
            return yearBalance;
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
      }
    

      @AuraEnabled(cacheable = true)
      public static Decimal getMonthlyAverage(Integer year,String office){
          try {
            Decimal officeMonthlyAverage = 0; 
            Integer counter = 0; 
            List <MonthlyExpense__c> monExList =  getOfficeMonthlyExpenses(year,office);
            for(MonthlyExpense__c mon : monExList){
               
                if(mon.SpentAmount__c > 0){
                    counter += 1;
                    officeMonthlyAverage += mon.SpentAmount__c;
               }
            }
            if(counter > 0){
            officeMonthlyAverage = officeMonthlyAverage/counter;
        }
            return officeMonthlyAverage;
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
      }
    @AuraEnabled(cacheAble = true)
    public static Decimal getYearSum(Integer year){
        try {
            Decimal yearSum = 0; 
            
            List <MonthlyExpense__c> monExList = getYearMonthlyExpense(year);
            for(MonthlyExpense__c mE : monExList){
            yearSum += mE.SpentAmount__c;
            }
            return yearSum;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
       @AuraEnabled(cacheable = true)
       public static List <MonthlyExpense__c> getYearMonthlyExpense(Integer year){
           try {
            Date yearBeginning = Date.newInstance(year, 1, 1);
            Date yearEnd = Date.newInstance(year + 1, 1, 1) - 1;
            List <MonthlyExpense__c> monExList = [select SpentAmount__c,MonthDate__c from 
            MonthlyExpense__c where MonthDate__c >= :yearBeginning AND MonthDate__c <= :yearEnd];
            return monExList;
        } catch (Exception e) {
               throw new AuraHandledException(e.getMessage());
           }
       }
    @AuraEnabled(cacheable = true)
    public static Decimal getOfficeYearExpenseSum(Integer year,String office){
        try {
            Decimal officeYearSum = 0;
            List <MonthlyExpense__c> monExList = getOfficeMonthlyExpenses(year,office);
            for(MonthlyExpense__c mE : monExList){
                officeYearSum += mE.SpentAmount__c;
            }
            return officeYearSum;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    }
    
    
    
    
    
   

