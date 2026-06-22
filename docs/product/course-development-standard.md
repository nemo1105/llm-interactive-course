---
status: accepted
owner: human
last_reviewed: 2026-06-22
upstream_docs:
  - ../../AGENTS.md
next_action: Use this standard when drafting course catalogs, chapter contracts, animation specs, and concept explanation docs.
---

# Course Development Standard

## Core Thesis

This course explains LLM applications from the model inference interface outward.

The simplest starting point is one ordinary conversation with a large language model: a user provides input, the application constructs a request, the model receives messages and context, and the model produces output. Every later concept must be taught by showing how it changes, supports, constrains, extends, evaluates, or operationalizes that inference interface.

Most LLM applications are engineering work around the same basic interface: construct better input, supply more relevant context, constrain output shape and behavior, connect external capabilities, and evaluate whether the result reliably completes the intended goal.

## Course Ordering Rules

- Start from the simplest possible conversation and reveal implementation layers gradually.
- Earlier lessons must be understandable without relying on later lessons.
- Later lessons may depend on concepts that have already been taught.
- Each concept should be introduced only after the minimum prerequisite idea is already concrete.
- Course progression should feel like expanding a call path, not collecting disconnected terminology.
- A concept may be mentioned early as a preview, but its mechanism should not be required until the relevant lesson.

## Concept Explanation Contract

Every LLM concept, regardless of whether the concept is strong, weak, popular, or controversial, should be explained through the same questions:

- What does the concept mean?
- What problem is it trying to solve?
- Where does it intervene in the LLM inference flow?
- What mechanism does it use to solve the problem?
- What is the underlying principle?
- What changes can learners observe through interaction?
- What are the limits, tradeoffs, or failure modes?

The explanation should stay tied to the concrete path around an LLM conversation. Avoid teaching a term as a standalone slogan.

## Interactive Presentation Standard

For every approved concept, the interactive page should show both:

- Effect: what changes in the user-visible result or developer-visible trace.
- Mechanism: what changed in request construction, message structure, token use, context selection, output constraints, tool access, evaluation, or workflow state.

Visuals and interactions should make the invisible parts of the LLM call inspectable. Prefer concrete animations, state transitions, traces, and small experiments over long static prose.

## Scope

This standard applies to:

- Course catalog design.
- Chapter sequencing.
- Concept explanation docs.
- Animation and interaction specs.
- Evaluation criteria for whether a lesson is teachable.
- Later implementation decisions that affect educational clarity.

This standard does not approve:

- Final chapter titles.
- Lecture scripts.
- On-screen teaching copy.
- Example prompts or demo data.
- Specific animation storyboards.
- Any rendered page content under `app/`.

Those artifacts still require explicit confirmation before implementation.

## Assumptions

- The audience has basic AI or programming literacy but may not have built an LLM system before.
- The course should be precise enough for engineers and concrete enough for non-specialists.
- New LLM ecosystem terms should be evaluated by their relationship to the inference interface rather than by popularity.
- External concept research may be used to build candidate concept lists, but repository content and page content must still pass the confirmation gates in `AGENTS.md`.

## Review Notes

- This document records the course development principle confirmed by the user on 2026-06-22.
- If the core teaching thesis changes, downstream architecture, delivery, quality, and release documents must be re-reviewed.
