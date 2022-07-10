@isTest
public class OnUpdateCardAmountTest {
    @isTest static void upTest(){
     ExpenseCard__c eC = TestDataFactory.createExpenseCard(Date.newInstance(2023, 1, 1),'fffffff@tut.by','password','Office 1');
     eC.Amount__c = 200;
     update eC;
    }
}