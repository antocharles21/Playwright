Feature: Dropdown menus
  Scenario: A user can choose an option from the simple dropdown
    Given I open the "dropdown" example page
    When I choose the configured dropdown option
    Then the configured dropdown option should be selected
