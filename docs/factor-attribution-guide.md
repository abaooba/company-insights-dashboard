# Reading a Factor Attribution

A plain-English guide to everything the **Factor Attribution** page shows you, and how to use it.

---

## What this page actually does

You give it a ticker (or a portfolio of tickers + weights). It pulls daily price history, turns it into daily returns, and **regresses those returns against a set of well-known "factors"** — broad, repeatable drivers of stock returns. The output answers one question:

> *How much of this thing's return came from being exposed to known market factors, and how much is left over (alpha)?*

The model is the **Fama–French 5-Factor + Momentum** model — the academic standard for decomposing returns. The math behind every number on the page is one regression:

```
(portfolio return − risk-free rate)  =  alpha
                                      +  β_Mkt · Market
                                      +  β_SMB · Size
                                      +  β_HML · Value
                                      +  β_RMW · Profitability
                                      +  β_CMA · Investment
                                      +  β_Mom · Momentum
                                      +  error
```

- The **left side** is your *excess return* (return above cash).
- Each **β (beta)** is how strongly your returns move with that factor — your "tilt."
- **Alpha** is the intercept: the average return left over *after* the factors explain what they can.

Everything on the page is just a readable view of this one equation.

---

## The six factors

Each factor is itself a return series (a "long good / short bad" spread). Your **beta** to a factor says which side you behave like.

| Factor (label on screen) | Measures | A **positive** beta means you behave like… | A **negative** beta means… |
|---|---|---|---|
| **Market** (`Mkt-RF`) | The whole market's return over cash | …the market. β ≈ 1 moves 1:1; β > 1 amplifies it; β < 1 dampens it | …you move *against* the market |
| **Size** (`SMB`) | Small-cap minus large-cap | …small-cap stocks | …a large-cap tilt |
| **Value** (`HML`) | Value (cheap) minus growth (expensive) | …value stocks | …a growth tilt |
| **Profitability** (`RMW`) | Profitable firms minus weak ones | …high-quality, profitable firms | …weak/unprofitable firms |
| **Investment** (`CMA`) | Conservative investors minus aggressive | …firms that invest prudently | …aggressive, capital-hungry firms |
| **Momentum** (`Mom`) | Recent winners minus recent losers | …a momentum chaser (rides winners) | …a contrarian |

> **Market beta** is usually the biggest story. For most single stocks it's the dominant exposure; the other five tell you the *style* tilts layered on top.

---

## Walking through the screen, card by card

### 1. Portfolio

The setup for everything below it.

- **Holdings + weight %** — what was analyzed. For a single ticker it's one 100% row. Weights are renormalized to sum to 100%.
- **Dropped (no usable price history)** — tickers you asked for that had to be excluded (too new, bad symbol, no data). The analysis ran on the rest; weights were renormalized around them.
- **Window** — the date range actually used (`first → last`).
- **Observations** — the number of trading days in the regression. **More is better**: a 7-parameter model wants comfortably more than a few hundred days to be trustworthy.

### 2. Factor Exposures (the static picture)

This is the headline result: your **average tilts over the whole window**.

**The four tiles up top:**

| Tile | What it means | How to read it |
|---|---|---|
| **Alpha (ann.)** | Annualized return *not* explained by any factor | Positive = you beat what your factor exposures predict; negative = you lagged it. **Only trust it if it says "significant"** (see below) |
| **R²** | Share of your return *movement* the factors explain (0–1) | 0.90 = factors explain 90% of the wiggle; the rest is stock-specific. Single stocks are often 0.3–0.7; diversified portfolios run higher |
| **Adj. R²** | R² penalized for using 6 factors | Use this when comparing fairly; always ≤ R² |
| **Obs.** | Trading days used | Your sample size — bigger = more reliable estimates |

**The bar chart** shows each factor's beta. **Bars fade when the exposure is not statistically significant** (p ≥ 0.05) — a faded bar means "the data can't really tell this tilt apart from zero, don't over-read it."

**The table** gives the full statistics for each factor:

| Column | Meaning | Rule of thumb |
|---|---|---|
| **β** | The tilt / loading | Sign = direction, magnitude = strength |
| **t** | t-statistic = β ÷ its standard error | **\|t\| ≳ 2** ⇒ real, not noise |
| **p** | p-value: chance you'd see this β if the true tilt were 0 | **p < 0.05** ⇒ significant |
| **95% CI** | Plausible range for the true β | If it **straddles 0**, the tilt is unreliable |
| **Sig.** | ✓ when p < 0.05 | Quick "is this real?" flag |

> A β with a huge magnitude but **no ✓** (wide CI, small t) is weak evidence — treat it as "maybe," not a fact.

### 3. Rolling Exposures

The static betas are *averages over the whole window* — but tilts drift. This chart re-runs the regression over a **moving window** (default **126 trading days ≈ 6 months**) and plots each beta through time.

Use it to see **stability**:

- A market beta that holds steady near 1.0 → consistent exposure.
- A value beta that climbs from −0.2 to +0.4 → the style genuinely changed (a rotation, a strategy shift, or the company maturing).
- Wildly swinging lines → the static averages hide a lot; don't lean on them.

If there isn't enough history for even one full window, the card says so instead of drawing a misleading line.

### 4. Return Attribution

This converts tilts into **actual return contributions** — the "where did my return come from?" view. Everything here is an **annualized return** (shown as %).

**The reconciliation tiles:**

- **Total excess (ann.)** — your annualized return above cash.
- **Explained by factors** — the part your tilts account for.
- **Alpha** — the leftover, idiosyncratic part.

These add up: **Total ≈ Explained by factors + Alpha** (a tiny **Residual** line appears if rounding leaves a gap).

**The table** breaks "Explained by factors" into one row per factor, plus an alpha row:

| Column | Meaning |
|---|---|
| **β** | The same tilt from the exposures card (blank for the alpha row) |
| **Factor ret (ann.)** | How that factor itself performed over the window |
| **Contribution** | **β × factor return** — what that tilt *added or subtracted* from your return |
| **% of total** | That contribution's share of total excess return |

> Contribution = *how much you were tilted* × *how that tilt paid that period*. A big tilt toward a factor that went nowhere contributes ~0; a modest tilt toward a factor that ran hard can dominate.

---

## How to actually use it — three worked reads

**"It's basically the market."** Market β ≈ 1.1, R² = 0.92, all other factors faded, alpha ≈ 0 and not significant. → The position is essentially leveraged market exposure. You're not getting a distinct style or skill; you're getting beta.

**"It's a large-cap value play with real edge."** Negative significant **Size**, positive significant **Value**, and a **positive, significant alpha** that's *stable in the rolling chart*. → A genuine large-cap value tilt, plus outperformance the factors don't explain. The stability check matters — a significant-but-jumpy alpha is less convincing.

**"The return came from momentum, not skill."** Alpha small/insignificant, but the **Momentum** row in attribution is a large positive **% of total**. → The good year was a *factor* doing the work (riding winners), not idiosyncratic edge. If momentum reverses, so does the return.

---

## Key terms, in one place

- **Excess return** — return above the risk-free (cash) rate. The thing being explained.
- **Beta (β)** — sensitivity/tilt to a factor. The regression slopes.
- **Alpha** — the intercept; average return unexplained by factor exposure. Read as idiosyncratic edge (or fees/drag if negative) — *if* it's significant.
- **Annualized** — a daily figure scaled to a yearly rate (× 252 trading days) so it reads in familiar "% per year" terms.
- **t-statistic** — estimate ÷ standard error; how many "standard errors away from zero." |t| ≳ 2 is the usual bar.
- **p-value** — probability of a result this big by chance if the true value were 0. < 0.05 = significant.
- **95% confidence interval** — the range the true value most likely sits in. Straddling 0 = unreliable.
- **R² / Adj. R²** — fraction of return variation the factors explain; adjusted version penalizes extra factors.

---

## Caveats — don't over-read it

- **It's historical.** Every number is estimated on the chosen window. Past tilts and alpha don't guarantee future ones — that's exactly why the rolling chart exists.
- **Association, not causation.** A factor loading describes co-movement, not a mechanism.
- **Alpha isn't automatically skill.** It can be luck, fees (negative), or exposure to a factor this model doesn't include.
- **Significance depends on sample size.** Short windows produce wide confidence intervals and small t-stats — more "maybe" than "yes." Watch the **Observations** count.
- **Dropped tickers change the portfolio.** If holdings were dropped for lack of data, you analyzed a *different* basket than you typed — check the **Dropped** line.
- **Numbers are percentages here.** The API returns decimals (0.12); the page presents them as percentages (12%) for you.
