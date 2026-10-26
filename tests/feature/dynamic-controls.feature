Feature: Dynamic controls
  Scenario: A checkbox can be removed dynamically
    Given I open the "dynamicControls" example page
    When I remove the checkbox
    Then the configured checkbox removal message should be displayed
