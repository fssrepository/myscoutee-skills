# Habit: convert corrections into continuity

## Trigger

The user says a constraint was already established, an agent repeats a failure,
or a correction appears reusable across future tasks.

## Immediate response

- Apply the correction to the current task immediately.
- If the user says stop/no edit/no build/no restart, do not finish another
  planned action first.
- If the user asks for undo, identify only the agent-owned diff and reverse it
  without disturbing user work. Verify the exact resulting diff.
- Do not argue from prior plans after the current instruction changes them.

## Capture process

1. Record the concrete observed failure, not the emotional wording.
2. Record the requested correction and its scope.
3. Generalize only as far as independent evidence allows.
4. Place it in `learnings/candidates.md` using the template.
5. Promote it according to `maintenance.md`, or reject it with a reason.

## Anti-rubber-stamp questions

- Would this rule have prevented the actual failure?
- Does it identify a trigger and evidence, or merely say “be careful”?
- Could it block legitimate work outside the original context?
- Is it already covered by an accepted invariant or habit?
- Can a future agent act on it without reading the original conversation?

## Conversation privacy

Do not commit raw conversation transcripts, threats, private paths, or personal
data. Commit the engineering lesson and provenance date/category only.

