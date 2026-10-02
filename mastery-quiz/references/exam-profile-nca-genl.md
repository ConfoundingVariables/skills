# Exam profile: NCA-GENL (NVIDIA Generative AI LLM Associate)

Disclosed profile for quizzes on the NCA-GENL certification. The generic skill applies unchanged; this file adds only the exam-specific anchors.

## Scope anchor

- Anchor scope to the official NVIDIA certification page for "Generative AI LLM Associate" (NCA-GENL): exam format (50–60 multiple-choice questions, 60 minutes, remotely proctored), the objective domains with their weights, and the linked preparation material. Reverify these when writing — NVIDIA updates them.
- Core ML/AI knowledge, experimentation, and data analysis carry large domain weights, and the NVIDIA software stack carries much of the rest: NeMo, TensorRT / TensorRT-LLM, Dynamo-Triton, RAPIDS (cuDF, cuML, cuGraph), ONNX, NIM, NGC, DGX.

## Vocabulary and freshness

- Current terminology: Triton Inference Server is now NVIDIA Dynamo-Triton, and NIM may select TensorRT-LLM, vLLM, or SGLang as its serving backend. Reverify product naming before writing items; NVIDIA renames and recombines products often.
- Prefer the phrasing used in current official NVIDIA documentation over blog-post phrasing.

## Difficulty calibration (Associate level)

- Calibrate to recognition and one-step application, not engineering interviews: short stems (one to three sentences), one decisive constraint per item, professionally plausible distractors.
- Test method choice, pipeline placement, tool choice, and one-step diagnosis. Skip derivations, API configuration trivia, and version archaeology.
- For Hard items, combine two taught concepts on one decisive constraint — for example, a batching policy judged against per-model execution boundaries, or a memory budget judged against context admission.

## Honesty rule

Practice material only: present generated questions as original practice items, never as real or closely replicated exam questions.

## Research anchors

- The official certification page (scope anchor above).
- NVIDIA's product documentation for whatever the topic names: NeMo microservices docs, TensorRT-LLM, Dynamo-Triton batching and model-configuration docs, RAPIDS, NCCL collectives, NGC catalog and NIM.
- Firsthand exam-taker reports are acceptable calibration sources; question-dump and practice-question vendors are not.
