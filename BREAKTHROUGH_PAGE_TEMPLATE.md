# Breakthrough Page Template - 3-Section Structure

**Updated:** 2025-12-28
**Purpose:** Master template for all 10 breakthrough pages

---

## Required Structure

Each breakthrough page MUST have exactly these 3 sections:

### 1. 📄 Marketing Materials (Exact PDF Copy)
- **Source:** Verbatim copy from the PDF brochure
- **Content:** ALL marketing copy, value propositions, statistics, benefits
- **Format:** Keep original structure and messaging
- **Assigned to:** Gemini (extract and paste exactly from PDF)

### 2. ⚙️ How to Activate
- **Purpose:** Step-by-step guide to enable the breakthrough in GCXONE
- **Content:** Prerequisites, activation steps, configuration, verification
- **Format:** Clear numbered steps with screenshots
- **Assigned to:** Gemini (write based on product knowledge)

### 3. 🚀 Adoption Guide
- **Purpose:** Help organizations roll out and maximize the breakthrough
- **Content:** Planning, pilot testing, training, rollout, best practices
- **Format:** Phased approach with timelines and metrics
- **Assigned to:** Gemini (write comprehensive guide)

---

## Template Code

```markdown
---
title: "[Breakthrough Name]"
description: "[One-line description]"
sidebar_position: [#]
tags:
  - role:all
  - category:breakthrough
  - feature:premium
---

# [Icon] [Breakthrough Name]

{/* BreakthroughHeader component */}
**[Tagline]**

---

## 📄 Marketing Materials

{/*
  SECTION 1: EXACT COPY FROM PDF
  Gemini: Extract and paste the COMPLETE marketing content from [Name].pdf
  Include ALL text, value propositions, statistics, and messaging EXACTLY as shown in the PDF
*/}

**TODO: Gemini - Copy EXACTLY from [Name].pdf**

[Paste all PDF content here verbatim]

---

## ⚙️ How to Activate [Breakthrough Name]

{/*
  SECTION 2: ACTIVATION GUIDE
  Gemini: Write step-by-step instructions for enabling this breakthrough
*/}

This section explains how to enable and configure [Breakthrough Name] in your GCXONE instance.

### Prerequisites

Before activating [Breakthrough Name], ensure you have:
- [ ] Administrator access to GCXONE
- [ ] [Breakthrough Name] license enabled
- [ ] Appropriate user permissions
- [ ] [Any specific requirements]

### Activation Steps

#### Step 1: Access Feature Settings

1. Log into GCXONE as an administrator
2. Navigate to **Settings** → **Features** → **Breakthrough Features**
3. Locate **[Breakthrough Name]** in the features list

#### Step 2: Enable the Feature

1. Click the **Enable** button
2. Review the terms and capabilities
3. Click **Confirm Activation**
4. Wait for activation (typically 1-2 minutes)

#### Step 3: Configure Initial Settings

1. Access **[Breakthrough Name] Settings**
2. Configure key options:
   - [Setting 1]
   - [Setting 2]
   - [Setting 3]

#### Step 4: Set User Permissions

1. Navigate to **Users & Permissions**
2. Assign permissions to appropriate roles

#### Step 5: Verify Activation

1. Check that [Breakthrough Name] appears in navigation
2. Test access with a sample operation
3. Verify notifications are working

### Video Walkthrough

{/* TODO: Add video player component */}
[Watch: How to Activate [Breakthrough Name] →](#)

---

## 🚀 Adoption Guide

{/*
  SECTION 3: ADOPTION STRATEGY
  Gemini: Write comprehensive guide for organizational rollout
*/}

Successfully rolling out [Breakthrough Name] across your organization requires planning and training. This guide helps you maximize adoption and ROI.

### Phase 1: Planning (Week 1)

#### Assess Your Needs

- **Inventory:** [What to assess]
- **Timeline:** Define deployment schedule
- **Scope:** Identify pilot locations/users
- **Resources:** Assign team members

#### Prepare Your Environment

1. [Preparation step 1]
2. [Preparation step 2]
3. [Preparation step 3]

### Phase 2: Pilot Testing (Week 2)

#### Conduct Small Tests

1. **First test ([size]):**
   - [Test activity 1]
   - [Test activity 2]
   - Measure results

2. **Refine your process:**
   - Document issues
   - Update procedures
   - Gather feedback

### Phase 3: Team Training (Week 2-3)

#### Train Your Team

**For Administrators:**
- [ ] [Training topic 1]
- [ ] [Training topic 2]
- [ ] [Training topic 3]

**For End Users:**
- [ ] [Training topic 1]
- [ ] [Training topic 2]
- [ ] [Training topic 3]

#### Create Training Materials

1. **Quick Reference Guide** - One-page cheat sheet
2. **Video Tutorial** - Walkthrough
3. **FAQ Document** - Common questions
4. **Examples** - Sample scenarios

### Phase 4: Full Rollout (Week 3-4)

#### Scale Up

1. **Expand deployment:**
   - [Rollout step 1]
   - [Rollout step 2]
   - Monitor performance

2. **Standardize processes:**
   - Document workflows
   - Establish best practices
   - Set up support channels

3. **Measure success:**
   - Track usage metrics
   - Monitor error rates
   - Collect feedback
   - Calculate ROI

### Phase 5: Optimization (Ongoing)

#### Continuous Improvement

- **Monthly reviews:** Analyze metrics
- **Process refinement:** Update based on learnings
- **Advanced features:** Explore additional capabilities
- **Training updates:** Refresh as features evolve

### Best Practices for Long-Term Success

✅ **Do's:**
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

❌ **Don'ts:**
- [Avoid 1]
- [Avoid 2]
- [Avoid 3]

### Success Metrics

Track these KPIs to measure adoption:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| [Metric 1] | [Target] | [Method] |
| [Metric 2] | [Target] | [Method] |
| [Metric 3] | [Target] | [Method] |

### Getting Help

**Resources:**
- 📖 [[Breakthrough Name] Documentation](#)
- 🎬 [Video Tutorials](#)
- 💬 [Community Forum](#)
- 📞 [Support Team](/support)

---

## 📊 Related Breakthroughs

- [Related Breakthrough 1](./link)
- [Related Breakthrough 2](./link)
- [Related Breakthrough 3](./link)

---

**Last Updated:** 2025-12-28
**Content Status:** Template
**PDF Source:** `Brochours/[Name].pdf`

**Section Status:**
1. ✅ Marketing Materials - Ready for PDF content
2. ✅ How to Activate - Ready for writing
3. ✅ Adoption Guide - Ready for writing
```

---

## Instructions for Gemini

### For Each Breakthrough:

1. **Section 1 - Marketing Materials:**
   - Open the PDF in `Brochours/[breakthrough-name].pdf`
   - Extract ALL text content
   - Paste EXACTLY as written in PDF (no rewording)
   - Include all statistics, quotes, and messaging
   - Preserve formatting and structure

2. **Section 2 - How to Activate:**
   - Write clear, step-by-step activation instructions
   - Include prerequisites
   - Add configuration details
   - Provide verification steps
   - Add screenshots/videos if available

3. **Section 3 - Adoption Guide:**
   - Create phased rollout plan (4-5 weeks)
   - Include planning, pilot, training, rollout, optimization
   - Add best practices and metrics
   - Provide training resources
   - Include success criteria

---

## Homepage Card Requirement

Each breakthrough also needs a card on the homepage featuring:
- Icon
- Title
- Tagline (one line)
- Brief description (2-3 sentences)
- Link to full page

**Claude Code to implement:** Homepage breakthrough showcase grid
