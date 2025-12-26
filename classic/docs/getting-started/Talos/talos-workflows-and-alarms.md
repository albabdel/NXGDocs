---
title: "Talos Workflows and Alarms"
description: "Complete guide to understanding workflows, alarm processing, and operator interfaces in Evalink Talos"
tags:
  - role:operator
  - category:features
  - difficulty:intermediate
  - platform:talos
sidebar_position: 3
last_updated: 2025-12-21
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Talos Workflows and Alarms

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Workflows are the core of how Talos manages alarms. This guide covers everything you need to know about alarm processing, workflow configuration, and the operator interface in Evalink Talos.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⚙️</div>
      <h3 style={{color: 'white', margin: 0}}>Workflows</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Alarm Processing</p>
    </div>
  </div>
</div>

## What are Workflows?

**Workflows** are a core part of how Talos manages alarms. A workflow is a set of predefined steps or a scenario that guides how a specific type of alarm should be handled.

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>Workflow Characteristics</h3>
  <ul>
    <li>Workflows ensure that alarms are processed <strong>consistently</strong></li>
    <li>They guide operators through the <strong>correct procedures</strong></li>
    <li>They can be <strong>manual</strong> (guiding an operator step-by-step) or <strong>automated</strong> (system performs actions without human interaction)</li>
    <li>When an alarm comes into the buffer, it usually gets picked up by a workflow</li>
    <li>The workflow then dictates what happens next – whether it's assigned to an operator, if automated calls are made, if information is logged, etc.</li>
  </ul>
</div>

### Workflow Definition

A **workflow** is a sequence of actions that are performed by Evalink Talos to process an alarm.

:::info Workflow Scope
An alarm is always triggered for a certain site. Therefore, a workflow, though it can be created on different levels (site, site group, or global), is always executed for a particular site.
:::

A workflow allows you to implement a complete specialized end-to-end procedure for handling each type of alarm. A workflow may include several conditional branches. Each branch can contain a separate action or a sequence of actions.

**Example:** When a burglary alarm comes in, a workflow can be configured to verify the alarm by contacting a responsible person and, depending on the result:
- If the alarm is real, notify an intervention team
- If the alarm is a false positive, close the workflow

A workflow can also be configured to execute several branches (sequences of actions) in parallel.

:::info Workflow Permissions
Only Administrator and Manager can create, edit or delete workflows.
:::

## Workflow Structure

A workflow consists of the following principal blocks:

1. **Incoming conditions** - Define when the workflow should be triggered
2. **Settings** - Configure workflow behavior and parameters
3. **Steps** - The actual actions to be performed

### Workflow Incoming Conditions

An alarm that is received for a site can be assigned to a certain workflow automatically, based on a set of **incoming conditions** that are configured for the workflow by Administrator or Manager.

Incoming conditions may include:
- Alarm code
- Zone and/or partition
- Alarm value (Alarm or Restore)
- Regular expression in the payload
- Schedule (e.g., business hours)
- Day of week
- Any combination of such parameters

The incoming conditions for a workflow are set in the **Incoming Alarm** step.

**Example Incoming Conditions:**

An alarm that satisfies the incoming conditions of a workflow:
- Arrives during the hours of the **Business Hours** schedule
- **AND** has a value **Alarm** (alarms with **Restore** value do not trigger the current workflow)
- **AND either**
  - Is triggered from zone **5 – Server room** or from zone **6 – Server room 2**
  - **OR** has one of these alarm codes: **350, 351, or 352**

If one of the above condition combinations is fulfilled, an alarm is considered a match and triggers the workflow.

### Logic: "All of" vs. "One of"

Conditions added in the top part of the trigger (**"When all of"**) use **AND** logic. All those conditions must be true for the workflow to start.

**Example:** Alarm code is BA **AND** Day of Week is Saturday

Conditions added in the bottom part (**"When one of"**) use **OR** logic. If **any** of those conditions are true, the workflow can start.

**Example:** Alarm Type is Burglary **OR** Alarm Type is Fire **OR** Alarm Code is PA

:::warning Conflicting Conditions
Be careful setting these up! If you put conflicting conditions in the "All of" section (e.g., "Alarm Type is Burglary" AND "Alarm Type is Fire"), that workflow will never run because an alarm can't be both at the same time.
:::

## The Alarms Page

The **Alarms** page is where operators will typically see and manage alarms. Think of it as the central buffer for incoming events that need attention.

### Layout

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', height: '100%'}}>
      <div className="card__header">
        <h3>📋 Left Side: Alarm Buffer</h3>
      </div>
      <div className="card__body">
        <p>This area lists new alarms that have arrived and haven't been picked up or assigned to an operator yet.</p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Unassigned alarms</li>
          <li>New incoming alarms</li>
          <li>Alarms waiting for operator</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>👥 Right Side: Workflows/Operator View</h3>
      </div>
      <div className="card__body">
        <p>This area shows information about workflows and which operators are active or working on specific alarms.</p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Active workflows</li>
          <li>Operator assignments</li>
          <li>Team workload</li>
        </ul>
      </div>
    </div>
  </div>
</div>

### Understanding the Workflow Columns

On the right side of the Alarms page, you'll see columns, often labeled with operator names or group names (like "NXGEN ADMIN," "NXGEN SUPPORT," "Operatore SVAT").

These columns show which alarms are currently assigned to or being worked on by specific users or teams.

**Column Information:**
- You can see if users are **"Online"** or **"Offline"**
- If a user has alarms assigned, they'll appear under their name
- If they have no active alarms, it might say "doesn't have any alarms assigned" or show a "Clear" status

### Filtering Alarms and Operator Views

At the top of the workflow/operator view section, there are usually filters. These let you change what you see:

<Tabs>
  <TabItem value="anyone" label="Assigned to Anyone" default>
    <p><strong>Default setting:</strong> Shows all unassigned alarms in the buffer and all assigned alarms under the respective operators.</p>
  </TabItem>
  
  <TabItem value="active" label="Assigned to Active Users">
    <p>Filters to show only alarms assigned to operators currently logged in and active.</p>
  </TabItem>
  
  <TabItem value="you" label="Assigned to You">
    <p>Shows only alarms assigned directly to you.</p>
  </TabItem>
  
  <TabItem value="specific" label="Specific Users/Groups">
    <p>You can often select specific users (like "Assigned to NXGEN ADMIN") to see only their workload. This is helpful for supervisors or team leads.</p>
  </TabItem>
</Tabs>

As operators log in or start working on alarms, their status and assigned alarms will update in these columns.

## Useful Buttons on the Alarms Page

### 1. Trigger Alarm (Bell Icon)

This button allows administrators or testers to manually simulate an alarm. It's very useful for testing how different alarm types are processed by your workflows and how the system behaves.

**When you click it, you can typically:**
- Select a **Site** to trigger the alarm for
- Choose an **Alarm Definition** or **Alarm Code** (e.g., "100-Medical," "102-Fail to Report In," "110-Fire")
- Specify if it's an "Alarm/Restore," a "Technical" alarm, or just a "Test Message"

This helps you see how a specific alarm would go through your configured scenarios without waiting for a real event.

### 2. Incoming Call (Phone Icon)

This feature is helpful when an operator receives a phone call related to a site or alarm, perhaps on a separate desk phone.

**When you click this button:**
- Tells Talos "I'm handling an incoming call"
- You can then search for the site or contact using information the caller provides
- Search options include:
  - Site name
  - Contact name
  - **Codeword** - A unique number or phrase assigned to a person or site

If a caller provides a codeword, the operator can quickly search for it in Talos to identify who is calling and which site they are referring to.

## Workflow Types

### Manual Workflows

Designed for human operators. An operator picks up an alarm, and the workflow guides them through a series of steps (e.g., "Call customer," "Check video," "Dispatch guard"). The operator makes decisions and inputs information.

**Characteristics:**
- Requires operator interaction
- Step-by-step guidance
- Decision points for operators
- Manual data entry

### Automated Workflows

The system handles these automatically without direct human interaction for each step.

**Examples:**
- An automated call to a customer if their system fails to arm on schedule
- Automatically sending an SMS to a technician if a device reports a technical fault
- Automatically closing very low-priority, known nuisance alarms after logging them

**Characteristics:**
- No operator interaction required
- Runs automatically
- Can trigger notifications
- Can escalate to manual workflows if needed

Often, a process might start with an automated workflow, and if it can't resolve the issue, it then passes the alarm to a manual workflow for an operator to handle.

## Workflow Steps

Once triggered, a workflow proceeds through a series of steps you define. Some common steps include:

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #8B5CF6', height: '100%'}}>
      <div className="card__header">
        <h4>🤔 Decisions</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>Yes/No questions for operators, or automated checks (e.g., "Is site armed?")</p>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h4>⚡ Actions</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>Call someone, send SMS, send email, update site status, deploy a guard</p>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h4>⏸️ Wait</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>Pause the workflow for a set time</p>
      </div>
    </div>
  </div>
</div>

**Additional Step Types:**
- **Jump**: Go to another step in the workflow
- **Close Workflow**: End the process, usually with an outcome status (e.g., "False Alarm," "Real Alarm - Dispatched")

## Example: Automating a "Failed to Close" Alarm

A common automated workflow addresses a site that's supposed to arm (close) at, say, 9 PM according to its schedule, but it doesn't.

**Workflow Steps:**

1. **Trigger**: Schedule indicates site should be armed, but status is still "Disarmed."

2. **Automated Action**: Talos makes an automated call to the site manager:
   > "Your system at [Site Name] was due to arm at 9 PM but is still disarmed. Press 1 to postpone arming for one hour. Press 2 to notify the monitoring center."

3. **Conditional Steps:**
   - **If manager presses 1**: Workflow waits an hour. If still not armed, it might call again or escalate.
   - **If manager presses 2** (or doesn't answer after a few tries): The alarm is sent to the operator queue for a manual follow-up.

This saves operators from manually calling every site that forgets to arm.

## Managing Workflows at Different Levels

Workflows can exist at different levels in your Talos hierarchy (Global, Organizational Unit, Site Group, Site).

### How it Works

When an alarm comes in for a specific site, Talos looks for a matching workflow. It starts by looking for a workflow defined directly at that **Site** level.

**Priority Order:**
1. **Site level** - Most specific, highest priority
2. **Site Group** - If no site-level workflow matches
3. **Organizational Unit** - If no site group workflow matches
4. **Global (Company Level)** - Default fallback

### Default Workflow

You can set one workflow at each level as a **"default."** If an alarm comes in and **no other specific workflow** matches its criteria at that level or any lower level, the default workflow for that level will be used. This ensures that every alarm has some defined way of being handled.

## Event Logs and Alarms

### Event Logs

Talos keeps a detailed record of activities related to your sites and customers. This is found in the **"Event Logs."**

**You can see a history of events like:**
- Sites being armed or disarmed
- Workflows being executed
- Alarms arriving
- Rule violations (e.g., a site not armed on schedule)
- Changes in site status (e.g., from inactive to active)

**Filtering Options:**
- Filter by date range (e.g., the last week, or a custom period)
- Filter by specific event types
- Filter by alarm codes
- Filter by zones

This is very useful for investigating past incidents or reviewing site activity.

### Data Retention

**How long are these logs kept?**
- **Trial accounts**: Typically 90 days
- **Regular paid customers**: Usually one and a half years
- **Custom retention**: If different retention times are needed, this can sometimes be adjusted by discussing with Evalink

### Events Page

The **"Events"** page gives you a more focused view, specifically on the alarms themselves.

**You'll see:**
- A list of alarms
- Which site they came from
- Details about the alarm type
- If an alarm was a "test message," a "technical alarm," or a standard alarm/restore signal

## Understanding Alarm Details

When you click on any alarm in the Events list, you get more detailed information:

### Alarm Timestamps

- **Arrival time**: When the alarm arrived in the Talos system
- **Transmission time**: How long Talos took to process the alarm and get it ready to show you (e.g., 5ms). This is usually very quick.

### Alarm Headers & Information

Alarms come with extra pieces of information called "headers." Some are standard, and some can be added by your workflows or system settings.

**Common Headers:**
- **Type of Event**: Indicates if it's a regular alarm, a technical alarm, or a restore signal
- **Payload**: For technical users, shows the raw data exactly as it was sent by the device
- **Receiver Information**: Shows which virtual receiver in Talos received the alarm
- **Integrity Score**: Talos has an internal "integrity" score for alarms (1 is highest, 0 is lowest)
- **Channel**: Can route alarms to specific operators or groups based on criteria like language
- **Dispatch Account**: If forwarding alarms to another system
- **X-Channel, X-IP, X-Receiver**: Technical details about the communication path
- **X-Tags**: Custom labels you can put on sites (e.g., "English Speaker," "VIP Customer")
- **Real ID**: A unique identification number for that specific alarm event within Talos
- **Category**: Alarms are grouped into categories (e.g., "CONNECTION," "BURGLARY," "FIRE")

## Alarm Definitions and Categories

Talos needs to understand the different alarm codes sent by various devices.

### Alarm Definitions

The system has predefined lists of alarm codes (like from the "Contact ID Standard" or "SIA Standard"). For example, code "130" in Contact ID usually means a burglary alarm.

**You can find these definitions in:**
- **Company Settings > Alarms > Alarm Definitions**

**Features:**
- Search for specific codes to see what they mean
- View in a simple list or in a technical JSON format
- Customize definitions if needed

### Alarm Categories

Alarms are grouped into categories. You can see and sometimes customize these categories in **Company Settings > Alarms > Alarm Categories**.

**You can also adjust:**
- The default **Severity** level for different categories
- Category names and descriptions
- Which categories appear in reports

## Related Articles

- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/Talos/getting-to-know-evalink-talos-complete)
- [Talos Site Management](/docs/getting-started/Talos/talos-site-management)
- [Talos Roles and Permissions](/docs/getting-started/Talos/talos-roles-and-permissions)
- [What is Evalink Talos?](/docs/getting-started/what-is-evalink-talos)

## Need Help?

For comprehensive Evalink Talos documentation, visit the [official Evalink Talos documentation](https://documentation.evalink.io/) or contact [GCXONE Support](/docs/support).

