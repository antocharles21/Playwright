Feature: Notification messages
  Scenario: A new notification message can be loaded
    Given I open the "notificationMessage" example page
    When I reload the notification message
    Then a configured notification message should be displayed
