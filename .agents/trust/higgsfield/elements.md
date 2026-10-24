# Higgsfield Elements and reference checks

Load for imports, replacements, attachments or eligibility checks.

## Element imports and replacements

1. An import contains exactly the requested elements: name, type and one short
   identifying description each. Image-generation detail belongs in its own
   prompt, not the import. Do not embed character IDs, nested prop descriptions,
   old/new UUID tables, deletion instructions or a production diary in it.
2. Use additions or replacements only, not a full-library reimport. If asked
   what to delete, give the exact old handles for that requested set. Listing
   deletion targets does not itself delete them.
3. Inspect the importer preview when available. Two Markdown sections do not
   prove two extracted elements: the P06 preview extracted five because it also
   interpreted the described characters and fingerprint props as elements.
4. After "imported" or "attached", use the available Higgsfield MCP read tools
   to resolve actual names, UUIDs and media attachments. Names can keep `s0_v1`,
   change to `s1_v1`/`s2_v1`, or lose a prefix. Never manufacture the new handle.
5. Compare the live handle with the specified clip. Update only changed
   references. A new UUID with the same handle can leave the text correct;
   explain that result rather than making an unrelated edit to show activity.
6. Inspect every attachment of the affected element, including its description.
   Adding a replacement may leave the rejected image attached alongside it.
   When asked to inspect the image, view the actual new media; an attachment ID
   or an old thumbnail is not a visual review.

## Evidence for a reference check

Keep these distinct: local prompt handle; live Element identity; attached image;
project membership; composer selection; eligibility result; completed output.
The evidence for one does not automatically establish the next.

- Start a known-problem review with the local
  Face/IP tracker (`guides/story/london/cinema_studio_steps/04_tracking/FACE_IP_ELIGIBILITY_REVIEW.md` in `myscoutee-backend`)
  and the active clip. Use MCP for the requested live check, with pagination as
  needed. Filter results to relevant fields instead of dumping the whole library.
- `completed` on an Element does not prove an attached image exists or that
  video eligibility passed. `ip_checking`, a slow check, Face/IP rejection,
  NSFW rejection and a generic Failed generation are different observations.
- Cinema Studio's observed `@` autoload avoids manual handle transcription.
  Do not assume Extend has the same control. If the user already attached the
  replacement, do not instruct them to attach it again without contrary evidence.
- For a screenshot check, inspect all supplied views, reference count, warning
  icons, duration, resolution, aspect ratio, audio, outputs and displayed price.
  The hover `×` is a removal control. No visible warning means no visible warning;
  it neither invents a blocker nor guarantees the next generation's acceptance.
- State what MCP actually exposes. Missing browser access does not prevent an
  available MCP check; a local file check is not a live composer inspection.
  Ask for missing evidence only if it blocks the requested conclusion.

