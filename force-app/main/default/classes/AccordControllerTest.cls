@isTest
public class AccordControllerTest {
    @isTest static void getExpenseCardsTest(){
    
    ExpenseCard__c exC = TestDataFactory.createExpenseCard(Date.newInstance(2023, 1, 1),'gggggg@mail.ru','fff','Office 1');
    
    List<Decimal> sum = AccordController.getSum(Date.newInstance(2023, 1, 1),'gggggg@mail.ru','fff');
   
    List<ExpenseCard__c> exCardsList = AccordController.getExpenseCards(Date.newInstance(2023, 1, 1),'gggggg@mail.ru','fff');
    AccordController.deleteCard(exCardsList[0].Id);
    
    }
    @isTest static void getExpenseCardsWithMETest(){
    MonthlyExpense__c mE = TestDataFactory.createMonthlyExpenseWithCard();
    ExpenseCard__c exC = TestDataFactory.createExpenseCard(Date.newInstance(2023, 1, 1),'gggggg@mail.ru','fff','Office 1');
    
    }
}