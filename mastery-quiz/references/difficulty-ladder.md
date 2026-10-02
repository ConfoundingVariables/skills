# Difficulty ladder

Difficulty must increase through reasoning depth, not obscure terminology.

## Easy

Goal: establish mechanics and clean distinctions.

Create 10 questions:
- 5 concept questions.
- 5 short scenarios.

Use one decisive clue per item. Distractors should be adjacent concepts, not nonsense.

Test:
- Core definition and mechanism.
- Input, target, output, and objective.
- Basic pipeline placement.
- Simple contrast with neighboring concepts.
- Straightforward use-case selection.

## Medium

Goal: test boundaries and pipeline awareness.

Create 10 questions:
- 5 concept/application questions.
- 5 scenario questions.

Each item should require at least two reasoning steps. Do not repeat one distinction in different wording.

Test:
- Adjacent concepts that share mechanics but differ in one important property.
- Multi-stage pipelines where different stages use different methods.
- Objective versus methodology.
- Training versus evaluation.
- Data availability versus target availability.
- Simple tradeoffs and failure modes.

## Hard

Goal: test engineering judgment.

Create 10 scenario-based questions.

Each scenario should contain 2-4 relevant constraints. Ask for the strongest design, next step, evaluation plan, or methodology choice.

Across the set, cover distinct reasoning dimensions such as:
- Architecture selection.
- Label scarcity or quality.
- Evaluation design.
- Group-aware or temporal validation.
- Domain shift.
- Production constraints.
- Clustering evaluation.
- Active learning or weak supervision.
- Multi-stage pipelines.
- Complexity versus operational value.

A learner should need to read every constraint. Skimming should not be enough.

## Expert

Goal: test system-design judgment under ambiguity.

Create 10 scenario-based questions.

Use scenarios where multiple options are professionally defensible in isolation, but exactly one is best under the full constraint set.

Require combinations of:
- Competing objectives.
- Data quality and distribution assumptions.
- Training/evaluation separation.
- Production and cost constraints.
- Monitoring and delayed feedback.
- Pipeline sequencing.
- Failure-mode diagnosis.
- Preservation of existing capabilities during adaptation.
- Tradeoffs between simplicity, robustness, and marginal model quality.

Expert difficulty should come from choosing the right compromise, not from trivia or hidden facts.
