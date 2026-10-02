# Item quality rules

The distractors determine whether the quiz tests mastery or pattern matching.

## The near-miss rule

Every wrong option should be a strategy a competent engineer might actually choose in a neighboring scenario.

Aim for this standard:
- The distractor would become correct or strongly defensible if one stated constraint changed.
- It loses here because of one precise nuance in the stem.

Prefer near-misses such as:
- Correct method, wrong sequencing.
- Good method, wrong evaluation split.
- Valid adaptation, but it forgets the source domain.
- Useful extra complexity, but unjustified given abundant clean labels.
- Appropriate metric, but misaligned with the production decision region.
- Reasonable pseudo-labeling, but unsafe because teacher quality differs by class.
- Valid clustering metric, but weaker than downstream business usefulness.
- Correct preprocessing method, but fitted across evaluation data.

## Avoid strawmen

Rewrite any option that is wrong merely because it:
- Ignores obviously valuable data without a reason.
- Claims one technique "always" or "never" works.
- Solves a completely different task.
- Violates a basic constraint so visibly that no informed learner would select it.
- Uses absurd language such as "permanently", "automatically", or "regardless" only to make itself false.

Such options test reading speed, not understanding.

## Option parity

Keep all four options parallel in:
- Length.
- Specificity.
- Technical depth.
- Tone.
- Number of clauses.

Do not make the correct answer conspicuously longer because it includes every caveat.

Do not pad options to an exact word count. Rewrite naturally until no option visually stands out.

## Correct-answer position

Vary the keyed answer across the 10 questions. Avoid visible patterns or repeated positions. If the quiz UI shuffles options automatically, still avoid relying on a fixed source ordering.
For HTML quizzes, shuffle options on every page load and report displayed answer letters, not their pre-shuffle source positions.

## Central-strategy uniqueness

Track the semantic answer, not just the wording.

These count as the same answer pattern even if the scenario nouns differ:
- "Use unlabeled data for self-supervised pretraining, then supervised fine-tune."
- "Domain-adapt on raw text, then fine-tune on labels."

Do not let several questions collapse to the same recipe. Each item should test a different decision.

## The skim test

Before finalizing each item, read only the four options without deeply analyzing the scenario.

If one answer looks safer, more nuanced, more professional, more detailed, or obviously more complete than the others, rewrite the set.

Then read the stem and ask whether at least two options remain genuinely tempting to an informed learner.

## The uniqueness test

Substitute every option into the full scenario.

If two options could reasonably be defended under the stated facts, strengthen the stem with the missing decisive constraint. Do not rely on the explanation to invent a restriction that the stem never stated.

## Feedback

For the correct option, explain the decisive alignment with the scenario.

For each distractor, explain the exact nuance that makes it second-best here. Prefer language like:
"This would be reasonable if X were the main constraint, but here Y makes it weaker."

Keep feedback concise. The point is to expose the boundary between two plausible choices.

## Novelty audit

For follow-up quizzes, scan prior questions in the conversation.

Treat a question as reused if it keeps the same:
- Decision structure.
- Correct strategy.
- Failure mode.
- Evaluation issue.

Changing only the industry, model type, or dataset size does not make it new.
