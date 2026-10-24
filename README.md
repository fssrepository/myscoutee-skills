# MyScoutee Skills

Shared agent instructions, skills and trust guidance for MyScoutee projects.
The library covers development resource rules, focused testing, manual QA and
Higgsfield production and MCP product workflows, with separate instructions for
each project.

- `.agents/`: reusable skills and the trust library.
- `instructions/`: shared rules and project-specific entrypoints.
- `tools/`: the shared local trust-mode manager.

Keep this checkout beside the application repositories. Their static `AGENTS.md` files
point directly here and explain how to clone it when missing. No symlinks or
submodules are used.
Project code, manuals, fixtures and live campaign records stay in their owners.

The MCP packager reads its skill directly from this library; only generated
distribution packages contain a copy.
