/// <reference types="Cypress"/>

it("A publisher should create an account, sign in, edit first name, add 3 books, edit first book author, delete third book, and sign out", () => {
  //sign up
  cy.visit("http://localhost:3000/sign-up");
  cy.get('[placeholder="First Name"]').type("Test");
  cy.get('[placeholder="Last Name"]').type("Publisher");
  cy.get('[placeholder="Email"]').type("testpublisher@email.com");
  cy.get('[placeholder="Password"]').type("Q1!wasdf");
  cy.get('[placeholder="Confirm Password"]').type("Q1!wasdf");
  cy.get('button:contains("Sign Up")').click();
  cy.wait(5000);
  //sign in
  cy.get('[placeholder="Email"]').type("testpublisher@email.com");
  cy.get('[placeholder="Password"]').type("Q1!wasdf");
  cy.get('button:contains("Sign In")').click();
  cy.wait(5000);
  //edit account publisher's first name
  cy.contains("Account Settings").click();
  cy.contains("Change Name").click();
  cy.get('[placeholder="Change First Name"]').type("Test1");
  cy.get('form button:contains("Change Name")').click();
  cy.contains("Name successfully changed");
  //adding 3 books
  cy.contains("Add Book").click();
  cy.get("[placeholder='Name']").type("test book 1");
  cy.get('[placeholder="Author"]').type("test");
  cy.get('[type="file"]').attachFile("test1.pdf");
  cy.get('form button:contains("Add Book")').click();
  cy.wait(5000);
  cy.get('[placeholder="Name"]').type("test book 2");
  cy.get('form button:contains("Add Book")').click();
  cy.wait(5000);
  cy.get('[placeholder="Name"]').type("test book 3");
  cy.get('form button:contains("Add Book")').click();
  cy.wait(5000);
  //edit the first book
  cy.get('button[data-testid="search-button"]').click();
  cy.contains("test book 1").click();
  cy.get('[placeholder="Author"]').type("test2");
  cy.get('button:contains("Update Book")').click();
  cy.contains("Book successfully updated");
  //delete the third book
  cy.get('button[data-testid="search-button"]').click();
  cy.contains("test book 3").click();
  cy.get('button:contains("Delete Book")').click();
  cy.wait(5000);
  //sign out
  cy.contains("Sign Out").click();
  cy.wait(5000);
});

it('A user should change the website theme color to blue, search for a book called "test book 1", and view it', () => {
  cy.visit("http://localhost:3000");
  //changing the website theme to blue
  cy.contains("Change Theme").click();
  cy.get('[value="blue"]').click();
  //searching for "test book 1"
  cy.get('[placeholder="Search"]').type("test book 1");
  cy.get('[data-testid="search-button"]').click();
  //view the book
  cy.contains("test book 1").click();
  cy.wait(5000);
});

it("The created publisher in the first test should sign in and deactivate the account", () => {
  //sign in
  cy.visit("http://localhost:3000/sign-in");
  cy.get('[placeholder="Email"]').type("testpublisher@email.com");
  cy.get('[placeholder="Password"]').type("Q1!wasdf");
  cy.get('button:contains("Sign In")').click();
  cy.wait(5000);
  //deactivating the account
  cy.contains("Account Settings").click();
  cy.contains("Deactivate Account").click();
  cy.get('button:contains("Deactivate Account")[onClick]').click();
  cy.get('button:contains("Yes")').click();
  cy.wait(5000);
});
