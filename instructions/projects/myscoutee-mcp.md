# MyScoutee MCP agent instructions

The product skill has one authoring source:
`myscoutee-skills/.agents/skills/myscoutee/SKILL.md`.
Read it when changing the plugin's MyScoutee workflow guidance. Plugin manifests,
MCP configuration, artwork and packaging remain in `myscoutee-mcp/plugins`.
The existing `plugins/build.py` includes the central skill in each generated ZIP;
do not restore a tracked copy under `plugins/myscoutee/skills`.

Clone `myscoutee-skills` beside the standalone MCP repository or its parent
application repository. The packager searches those ancestor locations and
reports missing skills before creating output. Run packaging from the existing
MCP repository and use `plugins/README.md` for its supported commands.
