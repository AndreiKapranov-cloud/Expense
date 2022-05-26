
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
   public static List<Decimal> getOfficeMonthlySpentAmount(Integer year,Integer month,String office){
       try {
        Date monthBeginning = Date.newInstance(year, month, 1);
        Date monthEnd = Date.newInstance( year,month +1, 1) - 1;
        
        Decimal officeMonthlyExpense = 0;
       
        List<MonthlyExpense__c>officeMonExList = new List<MonthlyExpense__c>();
        List<Decimal>monthlySpentAmountList = new List<Decimal>();
        
        List<Contact> keepers = [select 
        (select SpentAmount__c,MonthDate__c,Balance__c from MonthlyExpenses__r WHERE
        MonthDate__c >= :monthBeginning AND MonthDate__c <= :monthEnd)
        from Contact WHERE Office__c = :office];
        for(Contact con : keepers){
            officeMonExList.addAll(con.MonthlyExpenses__r); 
            }                                  

        for(MonthlyExpense__c monEx : officeMonExList){
         
            officeMonthlyExpense += monEx.SpentAmount__c;
            }
        monthlySpentAmountList.add(officeMonthlyExpense); 
        return monthlySpentAmountList;
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
      public static List<Decimal> getMonthlyAverage(Integer year,String office){
          try {
            Decimal officeMonthlyAverage = 0; 
            Integer counter = 0; 
            List <MonthlyExpense__c> monExList =  getOfficeMonthlyExpenses(year,office);
            List<Integer>numbers = new List<Integer>{0,0,0,0,0,0,0,0,0,0,0,0};
                 
            for(MonthlyExpense__c mon : monExList){
               
                if(mon.SpentAmount__c > 0){
                    officeMonthlyAverage += mon.SpentAmount__c;
                    numbers[mon.MonthDate__c.month() - 1] += 1;
               }
            }
            for(Integer num : numbers){
                if(num > 0){
                    counter ++; 
                }
            }
            if(counter > 0){
            officeMonthlyAverage = officeMonthlyAverage/counter;
           }else{
            officeMonthlyAverage = 0;   
           }
           List <Decimal>officeMonthlyAverageList =new List<Decimal>();
           officeMonthlyAverageList.add(officeMonthlyAverage);
           return officeMonthlyAverageList;
           } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
           }
      }
    @AuraEnabled(cacheAble = true)
    public static List<Decimal> getYearSum(Integer year){
        try {
            Decimal yearSum = 0; 
            
            List <MonthlyExpense__c> monExList = getYearMonthlyExpense(year);
            for(MonthlyExpense__c mE : monExList){
            yearSum += mE.SpentAmount__c;
            }
            List <Decimal> yearSumList = new List<Decimal>();
            yearSumList.add(yearSum);
            return yearSumList;
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
    public static List<Decimal> getOfficeYearExpenseSum(Integer year,String office){
        try {
            Decimal officeYearSum = 0;
            List <MonthlyExpense__c> monExList = getOfficeMonthlyExpenses(year,office);
            for(MonthlyExpense__c mE : monExList){
                officeYearSum += mE.SpentAmount__c;
            }
            List <Decimal> officeYearSumList = new List<Decimal>();
            officeYearSumList.add(officeYearSum);
            return officeYearSumList;
         } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
      }
      @AuraEnabled(cacheable =true)
      public static List<Contact> getOfficeEmployees(String office){
          try {
              List<Contact> keepers = [select 
              Name from Contact WHERE Office__c = :office AND Admin__c = false];
              return keepers;
          } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
      }
      @AuraEnabled(cacheable = true)
      public static List<Decimal> getOfEmpMonEx(Id employeeId,Integer year,Integer month){
          try {
            Date monthBeginning = Date.newInstance(year, month, 1);
            Date monthEnd = Date.newInstance(year, month + 1, 1)-1;
            List <MonthlyExpense__c> monExList = [select SpentAmount__c from MonthlyExpense__c WHERE
            MonthDate__c >= :monthBeginning AND MonthDate__c <= :monthEnd AND Keeper__c =: employeeId];
            Decimal ofEmpMonExAmount = 0;
            MonthlyExpense__c ofEmpMonEx = new MonthlyExpense__c();
            if(monExList != null && monExList.size() > 0) {

                ofEmpMonEx = monExList[0];
                ofEmpMonExAmount = ofEmpMonEx.SpentAmount__c;
                }
        
            List<Decimal>resultList = new List<Decimal>();
            resultList.add(ofEmpMonExAmount);
            return resultList;
        } catch (Exception e) {
              throw new AuraHandledException(e.getMessage());
          }
    }
          @AuraEnabled(cacheable = true)
          public static List<Decimal> getEmployeeYearExpense(Id employeeId,Integer year){
              try {
            Date yearBeginning = Date.newInstance(year, 1, 1);
            Date yearEnd = Date.newInstance(year +1, 1, 1)-1;
            Decimal YearAmountSum = 0;
            List <MonthlyExpense__c> monExList = [select SpentAmount__c from MonthlyExpense__c WHERE
            MonthDate__c >= :yearBeginning AND MonthDate__c <= :yearEnd AND Keeper__c =: employeeId];
            for(MonthlyExpense__c mon : monExList){
              YearAmountSum += mon.SpentAmount__c;
            }
            List<Decimal>resultList = new List<Decimal>();
            resultList.add(YearAmountSum); 
            return resultList;
              } catch (Exception e) {
                  throw new AuraHandledException(e.getMessage());
              }
          }
 }
       
    
    
    
    
    
    
   

