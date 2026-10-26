Feature: Checkbox controls
  Scenario: Checkbox defaults can be changed
    Given I open the "checkboxes" example page
    Then the default checkbox states should match the JSON data
    When I select the configured checkbox
    Then the configured checkbox should be selected
