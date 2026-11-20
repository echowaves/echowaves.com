# Sign-off pack — ten items that need your word

Dmitry — nothing here fails `npm run verify`. Every claim already carries a self-sourced line, which is what the rule mechanically requires. What these ten still lack is **your confirmation**, which is the one thing I cannot fabricate. Answer each with `KEEP`, `SOURCE <what>`, `REWRITE <words>` or `DELETE`; if you say "do your recommendations" I'll apply column four and clear the flags in one commit.

Where things render: the three headline claims appear as the stat block on the home page ([Hero.astro](../../../src/components/site/Hero.astro)); all five claims appear in full on the Results section ([Results.astro](../../../src/components/site/Results.astro)). `needsReview` also puts each item in verify's "N claims pending sign-off" count — that number is what this pack exists to take to zero.

## A · The five metric claims (`src/data/site.ts`, `claims`)

All five say `source: 'My professional summary. Internal measurement.'`. None can be externally verified, because none were ever externally published — they are internal numbers from C1 and CSL. So the honest choice for each is: accept your attestation as the source, or remove/soften it.

| # | On the site | What a reader believes | My recommendation |
|---|---|---|---|
| A1 | **20 → 10 days** · Release cycle, halved (home + Results) | You personally halved release cadence at scale | KEEP if you'd defend "halved release cadence" in an interview. The detail line also asserts "while velocity doubled", so A5 is load-bearing here — if A5 goes, this sentence must change too |
| A2 | **89%** · Employee Net Promoter Score (home + Results) | An engagement survey you commissioned produced 89% against a 2–25% industry band | KEEP only if the survey exists and you can name it (tool, year, population). This is the most checkable-sounding number on the site and the worst one to have to qualify later. If the population or tool is fuzzy, DELETE rather than soften — a vague eNPS is worse than none |
| A3 | **3 months → 2 weeks** · Lead time for changes (Results) | You took lead time from a quarter to a fortnight | KEEP if "quarterly releases became on-demand" matches what you'd say out loud. Otherwise REWRITE to the mechanism without the endpoints ("releases moved from quarterly to on-demand") — that is defensible from the CI/CD work alone |
| A4 | **<1%** · Annual production defect rate (home + Results) | Production defects stayed under 1% a year | SOURCE if you have the quality report; otherwise DELETE. It is the weakest of the five as a headline because "defect rate" has no shared definition, and a reader who knows that will discount the other two home-page numbers with it |
| A5 | **×2** · Engineering velocity (Results) | You doubled throughput without headcount | REWRITE to the mechanism, or DELETE. Velocity is team-relative and non-portable; nobody can audit ×2, and claiming it invites exactly the "says who" reaction the whole verifiable approach exists to avoid |

Note on A4 + A5: they are the two I'd drop even if you told me they were true, because they are the two easiest to attack and the two that add least. A1 and A3 describe cadence, which is concrete; A2 describes people, which is rare and human. That combination (cadence ×2 items + eNPS) is a stronger home page than five numbers of mixed reliability.

## B · One story note (`src/data/site.ts`, `notes`)

| # | On the site | Question |
|---|---|---|
| B1 | **"One thing I got wrong"** — "An early gate counted pull requests merged. Two quarters later we had more changes, each smaller and harder to review. The measurement did exactly what I asked and not what I wanted." | Is this a real episode, and is it yours to tell publicly? It is the most credible paragraph on the site *if* it happened; it reads as invented if it didn't. KEEP / REWRITE with the true version / DELETE. If it happened at C1 or CSL, also confirm you're comfortable telling it against an employer |

## C · Four figures inside prose (no `needsReview` flag today)

These are not claims, so verify doesn't count them — but they are numbers in sentences, and the rule about non-verifiable specifics applies to them just as much. Each needs a source or removal.

| # | Sentence | Where | Recommendation |
|---|---|---|---|
| C1 | "…and **285 tests** run headless over an in-memory network." (succinctcoin.ai) | Products / succinctcoin | SOURCE it and the spine goes quiet: `cd succinctcoin && pytest --collect-only -q \| tail -1`. If the real count differs, that's what should be on the site. Alternatively delete the number — "the core is deterministic by construction… written with agents against that suite" carries the point without a countable claim |
| C2 | "It began as a seven-day experiment; **nine years** later it has been rebuilt four times…" (WiSaw) | WiSaw story intro | **This one is wrong, and I found it while writing this pack.** The story dates the first version to 2018 (`wisawStory.phases[0].when === '2018'`) and the site's own `asOf` is 2026-10-17 — that is *eight* years, not nine. Either the first version was actually mid-2017 (the LinkedIn post date settles it), or the sentence should read "eight years". Tell me which and I'll fix both places together. "Rebuilt four times" does check out: `wisawStory.phases` has exactly four entries, and verify now enforces that link |
| C3 | "…version **7.x** ships on iOS, Android and the web." (WiSaw install note) | WiSaw page | SOURCE from the store listing or App Store Connect. If 7 is right but you'd rather not tie the copy to a version that changes, REWRITE to "ships on iOS, Android and the web" — the version earns nothing here and dates the page |
| C4 | "**seven-day** app was rebuilt four times" (title + meta description) and "The first version took seven days" | WiSaw page `<title>`, meta description, story body | KEEP — this one is already sourced: the 2018 LinkedIn post you confirmed ("Minimalistic Social App in few days"). Nothing to do unless you dispute the seven days yourself |

## What I'll do with your answers

1. Apply each decision to `src/data/site.ts` (and the WiSaw page for C3/C4).
2. Remove `needsReview: true` only for items you explicitly confirm; delete the whole object otherwise — and if a headline claim is deleted, pick its replacement from the remaining claims so the home page still shows three stats.
3. Re-run `npm run check`; the expected end state is "N claims pending sign-off" gone entirely, with every displayed figure either sourced or self-attested by you in writing.

One thing I will not do: leave a number on the site that you haven't confirmed. That is the entire difference between this portfolio and the one you were reacting against at the start.

— BMad

---

## Decisions (2026-10-25, applied in `8eb0d71`)

Answered through the form rather than inline; recorded here so the pack is self-contained.

- **A1–A5** — every claim stays exactly as written, including eNPS 89%, `<1%` and `×2`. My recommendation to drop three of them was overruled: these are Dmitry's numbers and he will defend them. `needsReview` cleared on all five; the home-page stat block is unchanged.
- **B1** — real, kept.
- **C1 · 285 tests** — confirmed against the suite. Kept.
- **C2 · year count** — dropped rather than corrected: "It began as a seven-day experiment, has been rebuilt four times since, and is still shipping." No number to rot.
- **C3 · version 7.x** — confirmed against the store listing. Kept.
- **C4 · seven days** — untouched, already sourced.

`npm run verify` now ends with `SIGN-OFF: nothing pending — every claim, note and store link confirmed by Dmitry.` instead of a list. The `needsReview` field stays in the model so the next claim has somewhere honest to wait.
