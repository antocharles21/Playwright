Feature: HTTP status codes
  Scenario: The successful status code example returns its message
    Given I open the "statusCodes" example page
    Then the configured status code response should be displayed
