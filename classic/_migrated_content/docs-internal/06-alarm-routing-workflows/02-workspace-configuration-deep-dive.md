---
title: "Workspace Configuration Deep Dive"
sidebar_label: "Workspace Configuration Deep Dive"
tags: ["internal", "alarm routing", "workspace", "configuration"]
---

# Workspace Configuration Deep Dive

Artificial Intelligence (AI) is utilized in security for real-time data analysis, distinguishing genuine threats, and reducing false alarms.
AI Classification Mechanisms
The AI process is divided into two parts: identification (identifying objects, independent of configuration) and decision (deciding if the event is a real or false alarm based on configuration parameters). AI detection operates without exclusion rules, meaning the algorithm attempts to detect everything.
Custom properties dictate the AI’s decision:
Priority List: If a detected object (e.g., "person") is configured here, it is treated as a 100% real alarm. For a priority item, classification as a real alarm occurs even if the object is static (not moving).
Whitelist: A detected object on the whitelist (e.g., "car") has a potential to be a real alarm.
Blacklist: Any detected object configured here (e.g., "bicycle") is flagged as a false alarm (i.e., suppressed).
Reject Unknown: This setting deals with objects that cannot be identified (classified as "unknown" or "NA"). If only an unknown object is detected (e.g., due to wind movement or light reflection), the alarm should typically be suppressed as a false alarm. The inclusion of "NA" (Not Applicable/Not Classified) in this rejection bucket requires discussion with development (ASR).
Troubleshooting Incorrect Classification
If alarms are incorrectly classified (real vs. false), the primary check is the Analytics dashboard to ensure false alarm filtering is applied. If filtering is applied, the next steps are to check the custom properties:
Review Custom Properties: Check the four custom properties (priority list, whitelist, blacklist, etc.) to see if the incorrectly flagged object (e.g., "person") is marked as a rejection/blacklist criteria.
Check for Masking: Verify if the area generating the alarm was masked in the configuration. Masking might not always be indicated by a red region.
Data Analysis and Escalation: If settings appear correct but misclassification persists (e.g., a person is detected but marked as a false alarm because "person" was missing from the priority list), documentation must be prepared and escalated to the data science team (Nazem or Asan).
Critical Documentation Gap for AI: There is currently no finite list of classifications that the AI versions (V4 and Nova/V6) support (e.g., if "person" is detected, does the AI return "person," "human," "pedestrian," "man," "woman," etc.?). A comprehensive list of all supported tags must be obtained from the development team to ensure accurate custom property configuration.
Ticket Analysis Examples: AJAX (4796) and C Contact (4792)
AJAX Filtering Issue (Ticket 4796)
The issue reported was no filtering for AJAX sites at the customer level (Securitas Pain). Initial analysis showed AI was, in fact, working at a high level (person classified). The customer had a large number of sites.
Old Implementation: This customer uses the older way of implementing AJAX via a workflow. This setup is highly cumbersome, requiring extreme expertise in Tallos and GCXONE for troubleshooting. Only a few individuals (Rajesh and the speaker) can figure out this implementation.
Migration Recommendation: Due to maintenance problems and complexity, new AJAX customers are not onboarded this way. Discussion should occur with Eve (EV) regarding migrating Securitas Pain sites to the GCXONE AJAX implementation, despite their strict quality procedure for testing.
Device Type: Securitas uses PIR CAMs (passive infrared cameras) that take three or four images when an alarm from the PIR CAM is received, and these images are analyzed by GCXONE. The images do not come from a traditional camera installed on AJAX.
Configuration Check (Generic): Normally, if AI is reported as not working, the first step is to check the Analytics dashboard to see if False Alarm Filtering is turned on. For this specific, older workflow implementation, however, the AI appears to work even if False Alarm Filtering is not turned on, because the system is calling AI through an API via the workflow, bypassing the usual GCXONE configuration checks (a known issue).
C Contact Alarms Blocked Issue (Ticket 4792)
The customer reported alarms were blocked at site 80091.
Device Context: The site has two devices, including an Axon device. Axon devices are known to send too many alarms and frequently get blocked.
Overflow Cause: The system's threshold is 25 alarms (default). The system received 46 alarms in the defined period, requiring the system to block them. This is considered a device problem that the platform will not support, and the customer should be told to tune their analytics.
Troubleshooting Steps:
Check if alarms are blocked currently (as of the check date).
Check the event overflow logs for the site.
Check the custom property related to the blocked alarm overflow threshold to confirm if it is set above 25.
If Axon is the cause, recommend configuring IVS alarms instead of motion alarms to introduce a level of filtering before alarms reach GCXONE.
