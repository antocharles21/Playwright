Feature: Google search
  Scenario: Search for Playwright Automation
    Given I open the Google search page
    When I search for "Playwright Automation"
    Then the Google search page should show the query "Playwright Automation"
