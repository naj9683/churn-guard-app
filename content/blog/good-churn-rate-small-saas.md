---
title: "What Is a Good Churn Rate for a Small SaaS? (Benchmarks by Stage)"
metaTitle: "What Is a Good Churn Rate for a Small SaaS? (Benchmarks by Stage) | ChurnGuard"
description: "Is your churn rate normal? Benchmarks for small and indie SaaS by stage and customer type — plus the compounding math most founders get wrong."
date: "2026-08-24"
author: "Naj"
authorRole: "Founder, ChurnGuard"
authorBio: "Naj is the founder of ChurnGuard, a retention automation platform for subscription SaaS businesses. He writes about churn prediction, intervention playbooks, and the systems that turn retention into a growth engine."
tags: ["churn rate", "SaaS metrics", "benchmarks", "customer retention"]
readTime: "7 min read"
featured: false
---

Short answer: for a small SaaS selling to other businesses, 3–5% monthly logo churn is typical, and under ~2–3% is genuinely good at small scale. Consumer products run higher — 5–7%+ monthly. But the raw number matters less than two things most founders skip: the compounding math, and the split between voluntary and involuntary churn.

## The benchmarks founders actually cite

Benchmarks compiled for a free churn-rate calculator for SaaS founders line up with what indie founders report in practice:

- **SMB-focused SaaS:** ~3–5% monthly churn is the typical range.
- **Consumer SaaS:** 5–7%+ monthly — consumers cancel faster and think less about it.
- **Selling to larger companies:** lower, but that's not most indie products.

Treat these as orientation, not targets carved in stone. Your price point, contract length, and customer type move the number a lot.

## The compounding math most founders get wrong

"5% monthly churn" sounds fine. It isn't, and here's why: churn compounds. You don't lose 5% × 12 = 60% of customers in a year, but the real figure is still brutal:

- 3%/month → ~31% of customers gone over a year (1 − 0.97¹²)
- 5%/month → ~46% gone over a year (1 − 0.95¹²)
- 8%/month → ~63% gone over a year (1 − 0.92¹²)

At 5% monthly churn, you have to replace nearly half your customer base every year just to stay flat. Growth on top of that means acquisition has to beat replacement and add net new customers. This is why small improvements in churn beat big improvements in signups for most small SaaS products.

## Logo churn vs revenue churn

Logo churn is the percentage of customers who leave. Revenue churn is the percentage of MRR that leaves. They tell different stories.

If your churned customers are mostly your cheapest plan, logo churn can look scary while revenue churn is mild. If your biggest customer leaves, one logo can be a revenue catastrophe. Track both. For most indie SaaS with similar-sized customers, they move together — but know which one you're quoting when you say "my churn is 4%."

## Why early-stage churn is noisy

At 40 customers, one cancellation moves your monthly churn by 2.5 percentage points. Three cancellations in a month — which can happen by pure chance — makes it look like your product is collapsing. It probably isn't.

With a small denominator, churn numbers swing wildly month to month. Look at 3-month rolling averages, not single months, and don't restructure your roadmap because of a bad two weeks.

## How to actually calculate your churn rate

Founders get tripped up here more than you'd expect, so keep it simple:

Monthly logo churn = customers who cancelled during the month ÷ customers you had at the start of the month. Use the starting count, not the ending count or an average — mixing denominators makes months incomparable.

A few judgment calls to make once and then keep consistent:

- Decide whether failed-payment losses count as churn this month (they should — see the voluntary/involuntary split below).
- Count annual-plan customers at renewal time, not when they go quiet.
- Don't count pauses as cancellations if the customer can resume — track them separately.

The formula matters less than consistency. A slightly imperfect churn number measured the same way every month is far more useful than a "correct" number you keep redefining. And measure monthly — quarterly smoothing hides the very trends you're trying to catch early.

## When NOT to obsess over churn

Two situations where churn-watching is the wrong use of your time:

- **Your first months with a handful of customers.** The number is statistically meaningless. Talk to customers instead.
- **Pre-product-market-fit.** If people are cancelling because the product doesn't solve their problem yet, no retention tactic fixes that. Fix the product.

Once you have stable signups and a product people demonstrably use, churn becomes the highest-leverage number in the business — because of the compounding above.

## The first diagnostic: voluntary vs involuntary

Before benchmarking yourself against anyone, split your churn. Industry estimates put [involuntary churn](/blog/what-is-involuntary-churn) — failed payments, not deliberate cancellations — at 20–40% of the total, and one r/microsaas founder found ~30% of apparent "cancellations" were actually failed cards. If a third of your churn is involuntary, you don't have a churn problem — you have a payment recovery problem, and it's the fixable kind.

You can see your own split with a [free churn audit](/audit) — it connects to Stripe and shows what's actually driving your number. [ChurnGuard](/) is built around exactly this split, and [pricing is flat and public](/pricing) if you're curious.

## The next step: who's about to leave

Benchmarks tell you how you did last month. The more useful question is who's drifting right now — failed cards, expiring cards, usage falling off. That's the subject of our post on [how to spot at-risk customers before they cancel](/blog/spot-at-risk-customers).

## What to do with your number once you have it

Benchmarks are only useful if they change a decision. A rough decision tree:

- **You're under ~2–3% monthly (SMB product):** churn is not your bottleneck. Spend your energy on growth and product, and just keep payment recovery running so it stays that way.
- **You're in the 3–5% range:** normal, but the compounding table above means there's real money on the table. Fix the involuntary share first — it's the fastest win — then look at onboarding and activation for the voluntary share.
- **You're above 5%:** don't start with retention tactics. First figure out who is leaving and why. If it's failed payments, that's a dunning problem. If it's new customers leaving within 60 days, that's a product/onboarding problem. If it's a few big customers, that's a relationship problem. The fix depends entirely on the diagnosis.

The common mistake is treating "churn" as one number to grind down with one tactic. It's a symptom with multiple possible causes, and the benchmark ranges only tell you whether to worry — not what to do. The split is what tells you what to do.

> See your own numbers — [free churn audit](/audit). 2 minutes, no credit card.

*Last updated: August 2026*

---

## Related reading

- [SaaS Churn Rate Benchmarks 2026: What's Normal — and What Isn't](/blog/saas-churn-rate-benchmarks-2026)
- [How to Reduce SaaS Churn Rate: The 90-Day Playbook (2026)](/blog/reduce-saas-churn-rate)

## FAQ

**Is 5% monthly churn bad for a SaaS?**
For SMB-focused SaaS, 5% is at the high end of the typical 3–5% range. The bigger issue is compounding: at 5% monthly churn you lose roughly 46% of your customers over a year, so acquisition has to replace half your base annually just to keep you flat.

**What is a good churn rate for a small SaaS?**
Benchmarks founders commonly cite put SMB SaaS at roughly 3–5% monthly and consumer SaaS at 5–7%+. Under ~2–3% monthly is genuinely good at small scale. Very early-stage numbers are noisy, so use rolling averages rather than single months.

**What's the difference between logo churn and revenue churn?**
Logo churn is the percentage of customers who cancel; revenue churn is the percentage of MRR lost. They diverge when customers pay different amounts — losing many cheap customers hurts logo churn, losing one large customer hurts revenue churn. Track both.
