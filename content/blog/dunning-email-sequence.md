---
title: "The Dunning Email Sequence That Recovers Failed Payments (Timing + Templates)"
metaTitle: "The Dunning Email Sequence That Recovers Failed Payments (Timing + Templates) | ChurnGuard"
description: "A proven dunning email cadence for Stripe SaaS: when to retry, when to email, and exactly what to say. Includes copy-paste templates."
date: "2026-08-24"
author: "Naj"
authorRole: "Founder, ChurnGuard"
authorBio: "Naj is the founder of ChurnGuard, a retention automation platform for subscription SaaS businesses. He writes about churn prediction, intervention playbooks, and the systems that turn retention into a growth engine."
tags: ["dunning", "failed payments", "payment recovery", "email templates"]
readTime: "7 min read"
featured: false
---

"Dunning" just means the process of recovering a failed payment — retrying the card and emailing the customer until the invoice is paid or the subscription is written off. A good dunning sequence retries in the background and emails the customer on Days 0, 1, 3, 5, 7, 8, and 14. Below is the cadence, the evidence behind it, and copy-paste templates.

## The documented case: 23% → 71% recovery

A founder on r/SaaS documented rebuilding their dunning flow at $40K MRR. The result: payment recovery went from 23% to 71%, recovering $2,400/month, using a Day 0/1/3/5/7/8/14 sequence — retries running throughout, emails on those days.

For context, founders commonly report Stripe's default recovery at roughly 40–60% — and if you're wondering [whether Stripe Smart Retries are enough on their own](/blog/stripe-smart-retries-enough), this case is the answer. The lift didn't come from clever retry timing. It came from talking to the customer, repeatedly, in plain language. Given that [involuntary churn](/blog/what-is-involuntary-churn) is 20–40% of all SaaS churn, this is one of the highest-ROI fixes available to a small SaaS.

## The cadence, day by day

- **Day 0** — charge fails. Retry. Send email #1 immediately: "your payment didn't go through, update your card here." Most recoveries happen here.
- **Day 1** — retry again. Short nudge if the card still isn't updated.
- **Day 3** — retry. Second email, slightly more direct: the account will lose access if this isn't fixed.
- **Day 5** — retry. Check-in email; offer help in case something's wrong on their end.
- **Day 7** — retry. Clear final-notice framing.
- **Day 8** — last-chance reminder, one day after the final notice.
- **Day 14** — the subscription cancels if still unpaid. (A win-back email afterward is a separate, worthwhile play.)

## Pre-dunning: prevent the failure entirely

The cheapest failed payment is the one that never happens. Cards expire on a schedule you can see in advance in Stripe. Emailing customers two to four weeks before their card expires — "your card ends in 09/26, here's a 30-second update link" — prevents a chunk of failures before dunning is ever needed. ChurnGuard's dunning playbooks include this pre-expiry outreach alongside post-failure emails.

## Tone: helpful, not threatening

These emails work because they sound like a human founder, not a collections department. Guidelines:

- Plain text, from a person's name, short paragraphs. No heavy design.
- One clear call to action: a direct card-update link. Nothing else competing.
- Frame it as a favor you're doing them ("keeping your account active"), not a debt you're collecting.
- Never fake urgency ("your account deletes in 1 hour!!") and never guilt-trip.

There's supporting evidence for the plain-text founder voice: cancel-flow surveys see response rates under 2%, while plain-text founder emails get 10–30% response rates. Real-sounding emails get read.

## Three copy-paste templates

**Template 1 — Day 0, payment failed:**

**Subject:** Quick heads-up — your payment didn't go through

Hi {name},

Your card was declined when we tried to process this month's payment for {product}. This is usually an expired card or a bank flag — takes 30 seconds to fix:

{card-update link}

Your account is fully active in the meantime. If you hit any issues, just reply to this email.

— {founder name}, founder of {product}

---

**Template 2 — Pre-dunning, card expiring soon:**

**Subject:** Your card on file expires soon

Hi {name},

The card we have for your {product} subscription expires at the end of this month. To keep everything running without interruption, you can update it here:

{card-update link}

Takes under a minute. Thanks for being a customer.

— {founder name}

---

**Template 3 — Day 7, final notice before cancellation:**

**Subject:** Your {product} subscription will cancel on {date}

Hi {name},

We've tried charging your card a few times now and it keeps getting declined. If the payment isn't updated by {date}, your subscription will automatically cancel and you'll lose access to {key thing they care about}.

Update your card here (30 seconds): {card-update link}

If you've decided to move on, no hard feelings — you don't need to do anything. And if something's broken on our side, reply and I'll fix it personally.

— {founder name}

## What NOT to do

- Don't fake countdowns or urgency. Customers notice, and it poisons trust with the people who do update.
- Don't guilt-trip. "We're a small business and this really hurts us" is not a payment recovery strategy.
- Don't offer invented discounts to save the payment. Save discounting for a considered win-back strategy, not a panic move.
- Don't send one email and give up. The cadence is the point — single-email flows are why default recovery sits where it sits.

## Measuring whether it's working

One metric matters: recovery rate — the percentage of failed payments that eventually succeed within your dunning window. Check it monthly. If you're starting from Stripe defaults, founders commonly report something in the 40–60% range; the documented case above reached 71% with a full sequence. Your number will vary with customer mix and price point, but the direction of travel after adding a cadence should be obvious within a month or two.

Also watch where recoveries happen. If most recoveries come from the Day 0 email, your later emails are doing their job as a safety net. If nothing recovers until Day 7, your early emails probably aren't being seen — check subject lines and sender name before touching the cadence.

## Automating it

Doing this by hand works for a handful of failures a month; it stops working the first week you're busy. [ChurnGuard](/) connects to Stripe, detects failed payments and expiring cards, and runs the dunning playbook — retries plus this email cadence — once you activate it. Nothing sends until you turn the playbook on, and you control the copy. [Pricing is flat and public](/pricing), and if you're comparing dedicated tools, here's an [honest ChurnGuard vs Churnkey breakdown](/alternatives/churnkey).

Dunning covers payments that already failed. The related skill is catching customers who are drifting before anything fails — that's in [how to spot at-risk customers before they cancel](/blog/spot-at-risk-customers).

> See your own numbers — [free churn audit](/audit). 2 minutes, no credit card.

*Last updated: August 2026*

---

## FAQ

**What is a dunning email?**
A dunning email is a message sent to a customer after their payment fails, asking them to update their card so the subscription can continue. A dunning sequence sends several of these on a schedule — commonly Days 0, 1, 3, 5, 7, 8, and 14 — while retries run in the background.

**How many dunning emails should I send?**
The best-documented founder case used seven touches across 14 days (Days 0/1/3/5/7/8/14) and took recovery from 23% to 71%. One email is not a sequence — most recoveries need follow-ups, because the first email often lands at the wrong moment.

**What should a payment failed email say?**
Keep it short, plain-text, and from a real person: state that the card was declined, give one direct card-update link, reassure them the account is still active, and invite a reply if something's wrong. Avoid fake urgency, guilt trips, and invented discounts.
