@isTest
public class AdminControllerTest {
  @isTest static void AdmnTest(){
      ExpenseCard__c eCc = TestDataFactory.createExpenseCard(Date.newInstance(2022, 1, 1),'gggg@mail.ru','lllf','Office 1');
      ExpenseCard__c eC = TestDataFactory.createExpenseCard(Date.newInstance(2023, 1, 1),'ggg@mail.ru','ff','Office 2');
      MonthlyExpense__c mE = TestDataFactory.createMonthlyExpenseWithCard();
      List <MonthlyExpense__c> monExList = AdminController.getOfficeMonthlyExpenses(2023,'Office 1');
      List <Decimal> ofMonSpAm = AdminController.getOfficeMonthlySpentAmount(2023,1,'Office 1');
      List<Decimal> sList = AdminController.getSumList(2023);
      Decimal ofBal = AdminController.getOfficeBalanceNow('Office 5');
      List<Decimal> monAv = AdminController.getMonthlyAverage(2023,'Office 1');
      List<Decimal> yearSum = AdminController.getYearSum(2023);
      List<Decimal>ofYES = AdminController.getOfficeYearExpenseSum(2023,'Office 1');
      List<Contact>conL = AdminController.getOfficeEmployees('Office 1');
      Contact con = TestDataFactory.createEmployeeWithExCard(Date.newInstance(2023, 1, 1),'jjjjj@uut.by','oooops','Office 1');
      List<Decimal>ofEME = AdminController.getOfEmpMonEx(con.Id,2023,1);
      List<Decimal>empYE = AdminController.getEmployeeYearExpense(con.Id,2023);
      
  }
}