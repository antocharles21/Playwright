Feature: Mouse hover interactions
  Scenario: Hovering over a profile reveals its profile link
    Given I open the "hovers" example page
    When I hover over the configured profile
    Then the configured profile link should be visible
