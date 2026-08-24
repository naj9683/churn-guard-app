---
title: "Dunning Email Templates for Failed Payment Recovery (With Real Copy)"
metaTitle: "Dunning Email Templates: Failed Payment Recovery for SaaS"
description: "Copy-paste dunning email templates for SaaS failed payment recovery. Includes Day 1, Day 3, Day 7, and Day 14 sequences — plus the subject lines, timing, and tone that actually get cards updated."
date: "2026-06-17"
author: "Naj"
authorRole: "Founder, ChurnGuard"
authorBio: "Naj is the founder of ChurnGuard, a retention automation platform for subscription SaaS businesses. He writes about churn prediction, intervention playbooks, and the systems that turn retention into a growth engine."
tags: ["failed payment recovery", "dunning emails", "SaaS billing", "churn prevention"]
readTime: "10 min read"
featured: false
---

## Table of Contents
1. [Why Failed Payment Recovery Matters](#why-failed-payment-recovery-matters)
2. [The Dunning Sequence: Timing and Structure](#the-dunning-sequence-timing-and-structure)
3. [Email Templates: Day 1 Through Day 14](#email-templates-day-1-through-day-14)
4. [Subject Line Best Practices](#subject-line-best-practices)
5. [Beyond Email: SMS, In-App, and Card Updaters](#beyond-email-sms-in-app-and-card-updaters)
6. [What Not to Do](#what-not-to-do)
7. [Measuring Success](#measuring-success)
8. [FAQ](#faq)

---

Failed payments are the most under-addressed churn driver in SaaS.

On average, 20–40% of monthly SaaS churn is involuntary — customers who didn't choose to cancel but simply had a card decline. A Visa expiry, a bank fraud flag, an insufficient funds error on a tight month. These customers wanted to stay. They just didn't notice the payment failed.

How much can a well-designed dunning sequence recover? The best-documented public case: a founder at $40K MRR went from 23% to 71% recovery — $2,400/month — by adding a Day 0/1/3/5/7/8/14 email cadence (documented on r/SaaS). Since these are customers who wanted to stay, even a modest lift compounds into a meaningful reduction in total monthly churn — without product changes, CS effort, or a single new customer.

Here's the exact sequence — and the actual email copy — to build it.

---

## Why Failed Payment Recovery Matters

Before diving into templates, let's anchor on the numbers.

Say you're at $100K MRR with 3% monthly churn. That's $3,000 in lost MRR each month. If 30% of that ($900/mo) is involuntary churn from failed payments, and a dunning sequence recovers 50% of those customers, you're saving $450/mo — $5,400/year — with zero incremental acquisition cost.

At $1M MRR, the same math produces $54,000/year in recovered revenue from a handful of automated emails.

This is why "fix your dunning first" is the universal recommendation for early-stage SaaS: it's the highest-ROI retention initiative available.

---

## The Dunning Sequence: Timing and Structure

The optimal dunning sequence for most SaaS businesses:

| Day | Trigger | Tone | Goal |
|-----|---------|------|------|
| Day 0 | Payment fails | — | Stripe retries (automatic) |
| Day 1 | Retry fails | Helpful, urgent-light | Alert customer, prompt update |
| Day 3 | Still unpaid | Helpful, direct | Second prompt, show consequences |
| Day 7 | Still unpaid | Clear urgency | Final warning before suspension |
| Day 14 | Subscription lapses | Re-engagement | Win back after lapse |

**A few principles that govern this sequence:**

1. **Don't start aggressive.** Day 1 should feel like a helpful service notification, not a collections letter. Most card failures are accidental.
2. **Make the update action one click.** Every email should link directly to a billing portal or payment update page — not to the homepage or dashboard.
3. **Escalate tone gradually.** Day 7 can be direct about consequences; Day 1 should not be.
4. **Send from a human.** Emails from `billing@` perform worse than emails from a real name at your domain. "Alex from ChurnGuard" outperforms "ChurnGuard Billing."

---

## Email Templates: Day 1 Through Day 14

These templates are written for a B2B SaaS product. Adapt the product name, support email, and billing portal URL.

---

### Day 1 — Heads Up (Helpful, Low Urgency)

**Subject:** Your payment didn't go through — quick update needed

---

Hi [First Name],

Just a quick heads up — we tried to charge your card on file for your [Product Name] subscription, but the payment didn't go through.

This usually happens when a card expires or a bank flags an unusual charge. No worries — it happens to everyone.

**[Update your payment details →](https://your-billing-portal-url)**

It only takes 30 seconds, and your subscription will stay active once it's updated.

If you have any questions or think this is an error, just reply to this email — I'm happy to help.

[Your Name]  
[Product Name]

---

### Day 3 — Gentle Reminder (Slightly More Direct)

**Subject:** Reminder: payment still pending for your [Product Name] account

---

Hi [First Name],

Your [Product Name] subscription payment is still unpaid — we sent a note about this 2 days ago and wanted to follow up.

Your account is still active right now, but we'll need to suspend access if the payment isn't updated soon.

**[Update payment details →](https://your-billing-portal-url)**

If you're dealing with a billing issue or need to change plans, just reply — I can help sort it out.

[Your Name]  
[Product Name]

---

### Day 7 — Clear Urgency (Access at Risk)

**Subject:** Final notice: [Product Name] access will be suspended in 24 hours

---

Hi [First Name],

Your [Product Name] subscription has been unpaid for 7 days. We need to suspend your account tomorrow if the payment isn't updated.

**Your access to [key features] will stop working until the payment is resolved.**

**[Update payment now →](https://your-billing-portal-url)**

If you're having trouble with payment or want to explore a different plan, reply to this email and I'll make sure we find a solution that works for you.

[Your Name]  
[Product Name]

P.S. If you'd like to pause your subscription rather than cancel, we offer that option too — just let me know.

---

### Day 14 — Re-engagement After Lapse

**Subject:** Your [Product Name] account has been suspended — we'd love to have you back

---

Hi [First Name],

Your [Product Name] account was suspended on [date] due to an unpaid balance.

We've kept your data and settings intact — if you'd like to reactivate, it only takes a moment.

**[Reactivate your account →](https://your-billing-portal-url)**

If you decided [Product Name] wasn't the right fit, I'd genuinely appreciate hearing why — it helps us build a better product. Just reply to this email.

If life got busy and the payment slipped through the cracks, no problem — your account will be back to normal as soon as the payment is updated.

[Your Name]  
[Product Name]

---

### Bonus: Card Update Confirmation

Send this immediately after a successful card update to close the loop.

**Subject:** Payment updated — you're all set

---

Hi [First Name],

Great news — your payment details have been updated and your [Product Name] subscription is active.

You won't need to do anything else. Your next billing date is [next billing date].

Thanks for staying with us — if there's anything we can do to make [Product Name] more useful for you, just let me know.

[Your Name]  
[Product Name]

---

## Subject Line Best Practices

Subject lines have the biggest impact on open rate — and open rate is the gating factor on recovery.

**High-performing patterns:**

- `"Your payment didn't go through"` — specific and non-threatening
- `"Quick update needed on your [Product] account"` — personal and actionable
- `"Your [Product] access expires tomorrow"` — urgency without aggression
- `"We need 30 seconds from you"` — curiosity-driven

**Avoid:**

- `"PAYMENT FAILED"` — caps = spam filters + aggressive tone
- `"URGENT: Account suspension"` — reads like a scam email
- `"Invoice #INV-2847 is overdue"` — formal/cold, triggers procrastination
- `"Your subscription has been cancelled"` — inaccurate and alarming; creates unnecessary support tickets

**Personalisation:** If your billing system passes the customer name, use it: `"[First Name], your payment didn't go through"`. A personal-looking email reads like a service notification, not a collections notice.

---

## Beyond Email: SMS, In-App, and Card Updaters

Email-only dunning leaves recovery rates on the table. The full stack:

**Stripe's network card updater:** Stripe automatically updates card details for some Visa, Mastercard, and Amex cards when they're renewed. Enable this in your Stripe settings — it silently recovers a percentage of failures before the customer even knows there was a problem.

**In-app payment banners:** Show a persistent payment failure banner inside your app when a customer is logged in with an overdue account. This catches customers who use the product but aren't reading billing emails.

**SMS (high-value accounts only):** For accounts over a certain ACV threshold, a short SMS on Day 7 cuts through a crowded inbox. Keep it short: *"Hi [Name] — quick note: your [Product] payment is overdue. Update here: [short link]"*

**Phone call (enterprise):** For accounts over $500/mo, a personal call from a founder or CS rep on Day 7 is almost always worth the time — it's the hardest channel to ignore.

---

## What Not to Do

**Don't suspend access without warning.** Suspending access on Day 1 (same day as first failure) is a reliable way to convert a recoverable situation into a cancellation. Give at least 7 days.

**Don't send from noreply@.** Customers can't reply to get help, which creates frustration and escalates the situation unnecessarily.

**Don't use legalese.** "Your subscription agreement requires payment within [X] days per clause 4.2 of our terms" is not how humans talk, and it will get ignored or reported as spam.

**Don't offer discounts in dunning emails.** Discounts in dunning sequences train customers to let payments fail whenever they want a discount. Save discounts for voluntary cancellation recovery instead.

**Don't stop at Day 7.** The Day 14 win-back email recovers a meaningful portion of customers who lapsed — even after suspension. Don't skip it.

---

## Measuring Success

The only metric that matters for dunning is **recovery rate**: percentage of failed payment customers who successfully update their payment details before permanent cancellation.

What moves recovery rates: each added channel reaches customers the previous one missed — email lands in spam, in-app catches them while active, SMS cuts through, and Stripe's network card updater silently fixes some expired cards before an email is ever needed. The full stack outperforms email alone. The benchmark that matters most is your own baseline: measure recovery this month, add a channel, measure again. (One public reference point: a founder documented 23% → 71% recovery with a full sequence — r/SaaS.)

**Track by cohort:** Measure recovery rate for each month's failed payment cohort. This lets you A/B test subject lines and copy without conflating results.

**Track the Day 14 email separately:** Win-back emails after lapse are a different motion from pre-lapse recovery. Keep them separate in your reporting.

---

## FAQ

**How soon should I send the first dunning email?**
Within 24 hours of the failed payment. The longer you wait, the further customers mentally move on from their subscription. Day 1 is the highest-recovery email in the sequence.

**Should I retry the payment before emailing?**
Yes — Stripe's Smart Retries will automatically retry the card at optimal times. Don't email until after the automatic retry has also failed (usually within a few hours).

**What if the customer has already cancelled?**
Don't send dunning emails to customers who have explicitly cancelled. Filter your dunning list to only customers whose subscriptions are in `past_due` or `unpaid` status, not `cancelled`.

**How many emails is too many?**
Four to five over two weeks is the sweet spot. More than that starts to erode trust and increase spam complaints. The Day 14 win-back is optional — many businesses stop at Day 7.

**Can I automate this, or do I need to build it myself?**
Tools like ChurnGuard, ProfitWell Retain, and Chargebee Retention handle this automatically for Stripe-billing businesses. If you'd rather own the logic, Customer.io or Klaviyo can run the sequences with a webhook trigger from Stripe.

---

*ChurnGuard automates your entire dunning sequence from Stripe — failed payment detection, email sequences, and win-back flows. [Start a free trial](https://churnguardapp.com/signup) and see how much involuntary churn you're currently losing.*
