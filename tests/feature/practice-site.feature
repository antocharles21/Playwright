Feature: Expand Testing practice site
  As a user of the practice site
  I want to exercise common web application flows
  So that the core behavior is verified

  Scenario: Successful login opens the secure area
    Given I am on the login page
    When I log in with username "practice" and password "SuperSecretPassword!"
    Then I should reach the secure area

  Scenario: Invalid login is rejected
    Given I am on the login page
    When I log in with username "invalid-user" and password "wrong-password"
    Then I should see the invalid login error
    And I should remain on the login page

  Scenario: A new user can register
    Given I am on the registration page
    When I register with a unique username and password "TestPassword123!"
    Then I should see the registration success message

  Scenario: A user can request a password reset
    Given I am on the forgot password page
    When I request a password reset for "qa@example.com"
    Then I should see the password reset confirmation

  Scenario: Web input values can be displayed and cleared
    Given I am on the web inputs page
    When I enter sample web input values
    And I display the web input values
    Then the displayed values should match the entered values
    When I clear the web inputs
    Then all web input fields and displayed values should be empty
