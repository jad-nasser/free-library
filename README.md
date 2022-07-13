# **Free Library**

<br>
<br>

## **Overview**

<br>

This is a personal project website, and the aim of this project is to enhance my web development skills and to learn **Redux**.

This project provides a free library website that contains PDF books. The publicher can add, edit, and delete book items, and the user can download PDF books and read them for free.

<br>
<br>

## **Technologies Used**

<br>

### **Server Side:**

- **Node js**
- **Express js**
- **Microsoft SQL Server**
- **nodemon**: used to watch for changes and automatically restart the server
- **mssql**: driver for SQL Server database
- **msnodesqlv8**: used with mssql for easier connection to the database
- **Cors**
- **Multer**: used to upload books PDF files to the server
- **bcrypt**: for hashing users passwords
- **cookie-parser**
- **dotenv**: for storing some enviroment variables.
- **Json Web Token**: tokens for user login stored in httpOnly cookies in user's browser.
- **Lodash**
- **Mocha**: test framework.
- **chai**: for tests assertions.
- **sinon**: used for mocking while unit testing.
- **proxyquire**: used for mocking libraries while unit testing.
- **supertest**: used for integration testing.

### **Client Side:**

- **React**
- **Redux**
- **react-redux**
- **Bootstrap**
- **Axios**: for sending requests to the server.
- **form-data**: for uploading PDF files of the books.
- **number-abbreviate**: used to abbreviate large book's "number_of_downloads" attribute for better viewing experience.
- **dotenv**
- **React Router**: for managing routing through pages in the react app.
- **jest**: test framework.
- **React Testing Library**: used for unit testing.
- **Mock Service Worker**: used to mock server responses in unit testing.
- **Cypress**: used for e2e testing.
- **cypress-file-upload**: used to upload books PDF files for cypress e2e testing.

<br>
<br>

## **Detailed Explanation**

<br>

This project uses MVC architecture (**M**odel-**V**iew-**C**ontroller) with all MVC parts having validations for more security. The server side uses **REST API** strategy built with NodeJs, and ExpressJs framework, and Microsoft SQL Server database. The client side is built with ReactJS framework.

The project consists of two main parts:

- **Users**
- **Books**

### **Users**

This project consists of two user types:

- **Normal user**
- **Publisher**

All user types interactions with the system is via browser. Each user type has a specific pages for them. If a user go to a page that belongs to different user type then the user will be automatically redirected to other page.

The website will treat the user by default as a **Normal user** user type until the user sign in as a **Publisher**, then the server will generate Json Web Token and store it in a httpOnly cookie in publisher's browser.

##### **Normal user**

Normal users can:

- Sign in as publisher
- Sign up as publisher
- Search books
- View books
- Download books

##### **Publisher**

Publishers can:

- Sign out
- Search his/her added books
- View, edit, delete his/her books
- Add new books
- Edit account
- Deactivate account

### **Books**

Books are PDF files stored in the server and when the user sign in as publisher, he/she can add books.

<br>
<br>

## **Project Main Files Structure**

<br>

**Note**: Most client side components represented in this documentation by the parent folder that includes them not by their .js file name.

- **routers**: contains routers that are responsible for the CRUD operations in the database models.
  - **books.js**
  - **publishers.js**
- **controllers**: contains controllers for books and publishers routers.
  - **books.js**: controller for books router.
  - **publishers.js**: controller for publishers router.
- **database-controllers**: these database controllers are used by the controllers above and they are used to communicate with the database models.
  - **books.js**: controller for books database model.
  - **publishers.js**: controller for publishers database model.
- **tests**: contains unit and integration tests for the server side code.
  - **unit-tests**: contains all unit testing code for the server side.
    - **publishers.test.js**
    - **books.test.js**
  - **integration-tests**: contains all the integration testing code for the server side.
    - **publishers.test.js**
    - **books.test.js**
- **app.js**: its the main router that the server run and it includes all the two routers mentioned above.
- **connect-to-db.js**: used by the server to connect to a database and if the database models are not created yet then this file will create the database models in the database.
- **server.js**: the server file itself.
- **client**: contains the client side code.
  - **cypress**: contains e2e tests.
    - **e2e**
      - **e2e-tests.cy.js**
  - **public**
    - **index.html**: include links to font awesome.
  - **src**
    - **App.css**: includes some css styles used in the entire app.
    - **index.js**: the main client side component and it also includes redux store.
    - **App.js**: the second main client side component included in index.js and this component includes all the routes of the client side app.
    - **reducer**: contains the reducer of the redux store and its actions
      - **reducer.js**
      - **actions.js**
    - **components**: includes all the components that the client side main app will use, each component is in a folder and many components comes with .test.js files that are unit tests to this component.
      - **advanced-search**: advanced search for the user to search for books.
      - **account-settings**: a component that include a tab that navigate the user to a setting the user needs.
      - **account-info**: a component that shows user's account info and can be accessed by account-settings component.
      - **edit-email**: allows the user to edit his/her email and can be accessed by account-settings component.
      - **edit-name**: allows the user to edit his/her name and can be accessed by account-settings component.
      - **edit-password**: allows the user to edit his/her password and can be accessed by account-settings component.
      - **deactivate-account**: allows the user to deactivate his/her account and can be accessed by account-settings component.
      - **books**: the component that used in the home page to represent list of books to the users.
      - **book**: represents one book used in books component.
      - **view-book**: this component rendered when a **Normal user** clicks a book component, allows the user to view a book and download it.
      - **sign-in**: allows the users to sign in to the system as publisher.
      - **sign-up**: allows the users to create a publisher account.
      - **footer**: the footer component.
      - **user-navbar**: a navbar that it is for the Normal users.
      - **publisher-navbar**: a navbar that it is for the Publishers.
      - **add-book**: allows the publisher to add new book item.
      - **edit-book**: this component will be rendered when a publicher clicks a book component, and this component allows the publisher to edit or delete a book item.
      - **notification**: represents a notification for success, error, or info
      - **route-components**: includes components that have `<Outlet/>` of react router.
        - **AccountSettingsRoute.js**: includes account-settings component tab and an outlet for the settings.
        - **User.js**: includes user-navbar component and an outlet for Normal users pages.
        - **Publisher.js**: includes publisher-navbar component and an outlet for publishers pages.
    - **functions**: includes some functions used by the components
      - **checkLogin.js**: contains a function that used in most component to check if the user is logged in to the system and if a user is not in the correct page type the user will be redirected to another page.
      - **getAllSearchParams**: returns all search params in an object.
    - **redux**: contains all redux store, actions, and reducer
      - **themeSlice.js**: reducer and actions for website theme change
      - **store.js**: the global store of the whole app

<br>
<br>

## **How To Use The Website**

<br>

Both users and publishers can change the website theme by clicking "Change Theme" in the navbar and then they can select a theme mode (light,dark) and a theme color.

### **User Guide**

- The first page that appears to the user is the home page, this page allows the user to search books.
- The user can use the search input in the navbar to search for a specific book in the home page.
- The user is not requird to enter the book's full name in the search input, because the user can write a substring of the name of the book and the system will find the book.
- Also the user can search books by clicking the button that contains the configuration icon in the navbar, this will navigate the user to the advanced-search page.
- In the advanced-search page the user can search for books by book's name or by book's author name, and also the user the select to sort books by:
  - Alphabetical order
  - Reverse alphabetical order
  - Most liked
  - Most downloaded
- The user can select a book in the home page by clicking it, this will navigate the user to the view-book page for this book.
- In the view-book page the user can see the details of the book and can download the book by clicking the download button and also the user can like a book by clicking the like button.

### **Publisher Guide**

- In order the users to sign as publishers they need to:
  1. Click the "Sign In As Publisher" button in the navbar, this will navigate to the sign in page.
  2. Insert email and password in the inputs.
  3. Click the "Sign In" button below the inputs and then the user will be navigated to the publishers home page.
  4. The publisher can sign out by clicking the "Sign Out" button in the navbar
- In order the users can create a publisher account they need to:
  1. Go to sign in page
  2. Click the "Sign Up" button in the bottom of the page, this will navigate the user to the sign up page
  3. Then the user **should** fill all the inputs and sign up
  4. If sign up not succeeded then maybe there are some inputs missing or the email is not valid or the password not valid or confirm password is the same as the password, and a red text will appear under the inputs telling the user what to do.
  5. After the sign up is completed the user needs to sign in in order to access his/her account.
- An email **can't** be linked to more than one account in the system.
- The first page appeared to the publisher after successful sign in is the publisher's home page and this page contains all the book items added by this publisher.
- If the publisher has a lot of books and he/she needs to find a specific book, then the publisher can use the search input in the navbar to search for a specific book in the home page.
- It is not necessary by the publisher to enter the book's full name in the search input in order to find a book, instead the publisher can write a substring of the book's name.
- In order the publisher to update a book item, he/she needs to click this item, this will navigate the publisher to the edit-book page.
- The edit-book page allows the publisher to edit this book or delete it
- It is not required by the publisher to fill all the inputs in the edit-book page to edit a book, the publisher can choose the fields that he/she needs to update and left the others blank so the system will only update the fields that the publisher needs to change and the other fields that their inputs are empty will not changed.
- For the publisher to add new book, in the navbar there is a button named "Add New Book", when the publisher clicks it, the publisher will be navigated to add-book page, then the publisher should fill all the inputs and click the "Add Book" button below.
- Just Note that in the add-book page, the file input can only accept a PDF file.
- For the publisher to go to the account-settings page, the publisher should click the button that contains the gear icon in the navbar.
- In the account-settings page the publisher can select which setting he/she needs by clicking a setting from the box that it is located at the left of the screen, but for small screen size this box will not appear instead a second navbar will appear under the original navbar and this navbar contains a button that have an icon like hamburger, when the publisher clicks this button all the settings will appear and then the publisher can select which setting he/she needs by clicking them.
- The account settings available are:
  - **Account Info**: allows the publisher to see all the account info except the password.
  - **Change Your Name**: allows the publisher to change his/her first and last name on the account.
  - **Change Your Email**: allows the publisher to change his/her email address for this account.
  - **Change Your Password**: allows the publisher to change his/her account password.
  - **Deactivate Your Account**: allows the publisher to delete his/her account.

<br>
<br>

---
