Feature: Keyboard input
  Scenario: A pressed key is reported on the page
    Given I open the "keyPresses" example page
    When I press the configured key
    Then the configured key result should be displayed
