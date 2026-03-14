---
title: "Priority List, White List, and Black List"
description: "Understanding AI decision-making rules for classifying detected objects as true or false alarms"
tags:
  - category:alarm-management
  - platform:GCXONE
  - alarms
  - ai
  - false-alarms
  - analytics
sidebar_position: 12
last_updated: 2026-01-05
---

# Priority List, White List, and Black List

In the GCXONE platform, the **Priority List**, **White List**, and **Black List** are the decision-making rules our AI uses to determine whether a detected object should be flagged as a **"True Alarm"** or a **"False Alarm"**.

It is important to understand that these lists do **not affect the AI's ability to detect objects**; our system will still identify every person, vehicle, or animal it sees. Instead, these parameters act as a filter to ensure your operators only receive alerts for the events you actually care about.

## 1. The Priority List (Maximum Security)

The **Priority List** represents the highest level of security. Any object type added to this list will trigger an alarm simply by being **present on the screen**, regardless of whether it is moving or stationary.

*   **Example:** If you put "Person" or "Human" on the Priority List, an alert is triggered even if someone is standing completely still in the camera's view.

## 2. The White List (Movement Required)

The **White List** is used for objects that are only considered a threat if they are **actively moving**. If an object on this list is detected but remains stationary, the system will ignore it to prevent nuisance alarms.

*   **Example:** If you add "Car" or "Van" to the White List, a parked car will not trigger an alarm, but a **moving vehicle** will.

## 3. The Black List (Automatic Suppression)

The **Black List** is used to automatically classify specific objects as **false alarms**. This is typically used for environmental factors that often trigger sensors but do not pose a security risk.

*   **Example:** Common blacklisted items include **animals, birds, and insects**.
*   **Crucial Note:** If a blacklisted item (like a bird) and a prioritized item (like a person) appear in the same frame, the system is smart enough to still flag it as a **real alarm**.

## Where to Manage These Settings

These configurations can be applied at the **tenant, customer, or site level**. You can find them by navigating to the **Custom Properties** section of your configuration page. If you find that a real person was classified as a false alarm, it is often because the specific tag for that object (like "Pedestrian" or "Human") was missing from your Priority or White lists.

## Understanding the Lists: An Analogy

Think of these lists like a **security guard at a gate**.

*   The **Priority List** is for a "Wanted" poster: if the guard sees that person, they sound the alarm immediately, even if the person is just sitting on a bench.
*   The **White List** is like a "No Loitering" rule: the guard doesn't mind if a car is parked in the lot, but if they see a car driving toward the restricted area, they raise the alarm.
*   The **Black List** is like the "Local Wildlife": the guard knows the neighborhood stray cat will wander by every night, so they've been told to ignore it and not wake you up unless the cat is followed by an intruder.

## Related Documentation

- [False Alarm Management](/docs/alarm-management/false-alarms)
- [Alarm Filtering](/docs/alarm-management/alarm-filtering)
- [Alarm Codes](/docs/alarm-management/alarm-codes)
- [Redundant Alarms](/docs/alarm-management/redundant-alarms)
- [Event Overflow](/docs/alarm-management/event-overflow)
- [Custom Properties Overview](/docs/admin-guide/custom-properties-overview)

