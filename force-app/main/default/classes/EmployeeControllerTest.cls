@isTest
public class EmployeeControllerTest {
 
  @isTest static void emTest(){
      MonthlyExpense__c mE = EmployeeController.getMonEx(2023,1,'gggg','gggg');
      List<Decimal> mESE = EmployeeController.getMonExSpentAm(2023,1,'gggg','gggg');
      List<Decimal>mEI = EmployeeController.getMonExIncome(2023,1,'gggg','gggg');
      List<MonthlyExpense__c>mEE = EmployeeController.getMonthlyExpense(2023,'gggg','gggg');
      List<Integer> yFT = EmployeeController.getYearForTab();
      List<Date> dateL = EmployeeController.populateDates(2023,1);
      List<Decimal> amTot = EmployeeController.getAmountTotal(2023,'gggg','gggg');   
      List<Decimal> yearInc = EmployeeController.getYearIncome(2023,'gggg','gggg');
      List<ExpenseCard__c> eCards = EmployeeController.getExCards(1,2023,'gggg','gggg');
      Contact con = TestDataFactory.createEmployeeWithExCard(Date.newInstance(2023, 1, 1),'hhhh@dot.com','gggg','Office 1');
      EmployeeController.saveExpenseCard(123,Date.newInstance(2023, 1, 1),'Yahoo',
      con.Id);
      EmployeeController.saveIncomeInput(122,Date.newInstance(2023, 1, 1),con.Id);
      List<string>monthNames = EmployeeController.getMonthNameFromNum(3);
      
      
  }
}