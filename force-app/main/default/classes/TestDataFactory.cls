@isTest
public class TestDataFactory {
    
    public static Contact createEmployeeWithExCard(Date cardDate,String email,String password,String office){
        Contact con = New Contact(FirstName = 'Andrei',LastName = 'jjj',Email = email,Password__c = password,Office__c = office);
        insert con;
        ExpenseCard__c exC = new ExpenseCard__c(CardDate__c = cardDate,CardKeeper__c = con.Id,Amount__c = 100);
        insert exC;
       return con;
    }
       
    public static ExpenseCard__c createExpenseCard(Date cardDate,String email,String password,String office){
        Contact con = new Contact(FirstName = 'Andrei',LastName = 'jjj',Email = email,Password__c = password,Office__c = office);
        insert con;
        ExpenseCard__c exC = new ExpenseCard__c(CardDate__c = cardDate,CardKeeper__c = con.Id,Amount__c = 100);
        
        insert exC;
        return exC;
    }
    public static MonthlyExpense__c createMonthlyExpenseWithCard(){
         Contact con = new Contact(FirstName = 'Andre',LastName = 'jj',Email = 'ggggg@mail.ru',Password__c = 'ff');
         insert con;
         MonthlyExpense__c mE = new MonthlyExpense__c(MonthDate__c = Date.newInstance(2023, 1, 1),Keeper__c = con.Id);
         ExpenseCard__c exC = new ExpenseCard__c(CardDate__c = Date.newInstance(2023, 1, 1),CardKeeper__c = con.Id);
      insert mE;
      insert exC;
      return mE;
     }
}