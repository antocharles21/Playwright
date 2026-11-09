Feature: Assertions page
  Scenario: Should-be page title identifies assertions
    Given I open the "assertionsShouldBe" example page
    Then the page title should contain "Assertions"
