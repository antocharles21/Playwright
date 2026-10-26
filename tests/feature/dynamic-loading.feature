Feature: Dynamic loading
  Scenario: Hidden content appears after loading
    Given I open the "dynamicLoading" example page
    When I start loading the hidden content
    Then the configured loaded message should be displayed
