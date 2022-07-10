@isTest
public class LoginControllerTest {
  @isTest static void logTest(){
      Contact con = TestDataFactory.createEmployeeWithExCard(Date.newInstance(2023, 1, 1),'login@tut.by','password','Office 1');
      String details = LoginController.getDetails('login@tut.by','password');
      String det = LoginController.getDetails('ddd','dddd'); 
      System.assertEquals('User does not exist', det);
      String de = LoginController.getDetails('','dddd');
      System.assertEquals('Enter login', de);
      String d = LoginController.getDetails('login@tut.by','trrrrrrrrrr');
      System.assertEquals('Invalid password please try again!!!!', d);
      
      Contact conn = LoginController.getContact('login@tut.by','password');
      String offf = LoginController.getOffice('login@tut.by','password');
      
      Id conId = LoginController.getId('login@tut.by','password');
      System.assertEquals(con.Id, conId);
      String detailss = LoginController.getDetails('','');
      String detailsss = LoginController.getDetails('','zcvzcvzcvzc');
      
      try
      {
        Id contId = LoginController.getId('login@tut.','passwor');
      }
      catch(Exception e){ 
      {
      
    } 
   }
  }
}