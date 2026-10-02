---
name: mastery-quiz
description: "Create research-grounded, interactive mastery quizzes for any supplied topic. Use when the user asks to be quizzed or tested on a topic, wants a harder tier or a fresh set at the same tier, or wants scenario-style multiple-choice practice. Ten questions per quiz with plausible near-miss distractors, one question at a time."
---

# Mastery Quiz

Create quizzes that test whether the learner can use a concept, not merely recognize its definition.

A topic is not mastered merely because the learner recognizes terminology. Treat mastery as the ability to:
1. Explain the topic without notes.
2. Distinguish it from adjacent concepts.
3. Place it correctly in an end-to-end pipeline.
4. Survive a realistic scenario question where several options look defensible.

When the topic names a certification, follow its disclosed exam profile for scope, vocabulary, and difficulty calibration — for example [references/exam-profile-nca-genl.md](references/exam-profile-nca-genl.md). The core workflow below applies unchanged.

## Input

Require only the topic.

Infer the difficulty from the request or conversation state:
- If only a new topic is given, start at Easy.
- If the user says "move to Medium", "Hard", "Expert", or equivalent, use that tier.
- If the user asks for another quiz at the same tier, keep the tier and generate completely unseen questions.

Do not ask clarifying questions when the topic and tier are already clear.

## Workflow

1. Research the topic before writing questions. Follow [references/research-protocol.md](references/research-protocol.md).
2. Scan the current conversation for previous quiz questions on the topic. Build a private ledger of used domains, reasoning dimensions, correct-strategy patterns, and scenario structures. Avoid reusing them.
3. Choose the tier rules from [references/difficulty-ladder.md](references/difficulty-ladder.md).
4. Plan all 10 questions before writing any option. Give every question a distinct primary reasoning dimension; the 10 dimensions are all distinct before any option is written.
5. Write four single-select options per question. Apply the distractor rules in [references/item-quality.md](references/item-quality.md) until every item passes the plausibility, uniqueness, and skim tests.
6. Audit the complete quiz before rendering it. Rewrite any item that fails.
7. For HTML: run the audit below, read its contact-sheet images directly, fix cues, rerun, delete the sheets, then open. Use direct tools; no clever substitutes.
8. Present the quiz interactively: one question at a time in any host UI that supports it. Without such a UI, present one question in chat, wait for the answer, give concise feedback, then continue.

## HTML quiz audit contract

Every HTML quiz must expose:
- `#question-count` containing `Question X of N`.
- Four buttons inside `#options`, with `.choice-key` labels A–D.
- `#feedback`, `#next-button`, `#results`, and `#result-summary`.
- `.is-correct` on the correct option after any selection.
- Page-load option shuffling through `Math.random()`.
- Displayed answer letters and `Missed dimensions:` in the result summary.

Before delivery, run (from the skill directory):

```bash
bash scripts/verify-html-quiz.sh <quiz-path> [serve-root]
```

Both paths are caller-side: `<quiz-path>` is the quiz wherever it lives, and `[serve-root]` is the directory to serve so relative assets resolve — the quiz directory's parent by default, which fits quiz pages stored in a subdirectory of a project. The wrapper starts a temporary Python local server so Playwright can load the quiz, then deterministically audits two viewport widths and two seeded flows: it checks the contract elements, that exactly one option is keyed correct, that page-load shuffling changes option order across seeds, and that the result summary reports displayed letters. It cannot judge the answer-length cue — that is visual — so it writes several short, single-column contact sheets (about five questions each, correct marked green) to `.playwright-cli/` in the serve root, then shuts the server down. Short sheets stay near native resolution; one long sheet downscales and degrades vision quality. The mechanical audit must pass. Afterward, vision-assess each contact sheet, rewrite any flagged item, and delete the sheets.

## Research requirement

Research is part of question construction, not decoration. Use it to find:
- The topic's current authoritative scope and vocabulary.
- Authoritative technical mechanics and edge cases.
- Interview and system-design question patterns that expose practical judgment.

Extract the reasoning pattern from reference questions, then create a new scenario on it.

If external research tools are unavailable, do not pretend research occurred. Use established knowledge available in context and keep claims within that boundary.

## Quiz construction

Create exactly 10 questions per tier unless the user explicitly requests a different count.

Every question must:
- Have exactly one best answer under the stated constraints.
- Test the requested topic directly.
- Be self-contained.
- Use four plausible options from the same solution space.
- Explain the decisive nuance after the learner answers.
- Reveal nothing through wording, length, tone, specificity, or grammar.
- Use clear university-level language and the domain's standard terminology. Skip derivations and API configuration trivia; keep the technical terms practitioners expect, and test the underlying idea instead.

For Hard and Expert, prefer decision questions — "what would you do?", "which design is strongest?", "which evaluation is valid?", "what should you change first?" — over classification questions like "what type of learning is this?".

## Diversity requirement

Do not create ten versions of the same distinction.

Before finalizing, verify that the 10 questions do not repeat the same central answer pattern. For example, a sequence such as "self-supervised pretrain → supervised fine-tune" should not be the correct strategy for multiple questions just because different industries were substituted.

Vary the reasoning dimension, not merely the nouns. Depending on the topic, dimensions can include:
- Architecture or methodology selection.
- Label quantity versus label quality.
- Weak, noisy, delayed, or conflicting supervision.
- Evaluation metric aligned to the production decision.
- Temporal, group, duplicate, or preprocessing leakage.
- Domain adaptation and retention of the source domain.
- Production latency, memory, compute, or retraining cost.
- Clustering quality versus downstream usefulness.
- Active learning or annotation-budget allocation.
- Pseudo-label confidence and error propagation.
- Multi-stage pipeline ordering.
- Whether additional complexity is justified at all.

Choose dimensions that genuinely fit the topic rather than forcing this list mechanically.

## Interaction and feedback

Show one multiple-choice question at a time.

After an answer:
- State whether it is correct.
- Explain only the decisive reason.
- For a near-miss, explain why that option would be reasonable in a neighboring scenario and which stated constraint makes it lose here.

At the end, report the score and the specific reasoning dimensions missed. Score alone does not declare mastery; the four criteria at the top remain the standard.

When generating a follow-up quiz, target weak dimensions with new scenarios while preserving overall breadth.
