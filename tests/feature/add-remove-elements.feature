Feature: Add and remove elements
  Scenario: A dynamically added element can be removed
    Given I open the "addRemoveElements" example page
    When I add an element
    Then the configured delete button should be visible
    When I remove the added element
    Then no delete button should remain
