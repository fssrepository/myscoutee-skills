# Higgsfield media handling

Load for a requested review, extraction, edit or assembly of downloaded film
assets. It does not start an assembly that the user paused or cancelled.

- Identify the requested original clip and accepted variant before working.
  Preserve originals; export changes separately. An analysis of P02 must not
  silently inspect P03, and a final build must not reuse a compressed preview.
- Extract the true last decoded frame from the accepted predecessor locally.
  Verify frame index, timestamp and dimensions and compare the saved image to
  that frame. A historical Higgsfield export selected an earlier frame, so its
  filename or "last frame" label is insufficient evidence. Extraction does not
  upload or attach an Element automatically.
- A still conveys composition and visible state, not prior motion or sound.
  Review the preceding video before describing velocity or camera continuity.
  Preserve the current opening instruction; do not globally relax it because
  one stricter experimental opening failed.
- For "just join", use stream copy when compatible. For a requested repair,
  modify the smallest necessary region. Inspect codec/GOP boundaries first:
  a short visual change can require a longer decodable block. Do not promise
  arbitrary frame cuts without re-encoding or encode the entire film by default.
- Make a requested clip fix independently uploadable; assemble it afterward.
  Keep fix and join operations separate in a reproducible script. Record source
  variants, trim indices, transition overlap, geometry, colour, audio changes,
  encoded region and copied region in the existing
  production README (`guides/story/london/cinema_studio_steps/03_film/production/README.md` in `myscoutee-backend`).
- Preserve source resolution, frame rate, bit depth and colour information.
  Report re-encoding and any quality tradeoff honestly. Equal bitrate is not
  lossless; a much larger lossless file is not evidence of better visual repair.
  Do not repeatedly encode already encoded previews or switch the deliverable
  to an unverified upload format merely for a codec preference.
- Separate spatial offset, scale, camera-direction mismatch, colour change,
  freeze and audio discontinuity. A prior seven-frame trim is not a general
  rule. Do not add rubber-like interpolation or ease an alignment back during
  visible motion without examining the resulting movement.
- Validate container timestamps, duration, decoded frames and audio; verify
  unchanged copied regions. When playback freezes, reproduce it in the reported
  player. Software decode success did not rule out a VLC HEVC profile/level
  switch at a stitched boundary in this project.
- Use the accepted transition recipe in the production README when assembly is
  requested. "The statue transition at 3–4 seconds" identifies the example's
  location, not a request for a three- or four-second dissolve.
- The current London production generates music/foley with video and one
  separate continuous narration for local mixing. Do not restore the older
  Flow instruction to discard all native audio. A mixed narration is not a
  separate removable stem; inspect streams and listen before claiming otherwise.
- Inspect actual motion for video reviews. If using sampled frames, disclose
  sampling and coverage; do not claim every frame or audio was reviewed. Score
  against the prompt used for that generation, not a later revision. Keep model
  behaviour separate from local title correction, grading and seam repair.
- Keep experiment comparisons controlled. If geometry, trimming and audio all
  changed, label them all; do not attribute improvement to only one variable.
  A technical pass does not override the user's report that the result looks
  wrong. Preserve the latest acceptance/rejection and stop when asked.
