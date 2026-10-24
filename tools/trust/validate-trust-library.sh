#!/usr/bin/env bash
# Validate the repository-local agent trust protocol and its canonical links.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
library_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${library_root}"

required=(
  instructions/projects/myscoutee-backend.md
  instructions/myscoutee-development.md
  instructions/manual-qa.md
  .agents/trust/kernel.md
  .agents/trust/manifest.md
  .agents/trust/constitution.md
  .agents/trust/routing.md
  .agents/trust/evidence-model.md
  .agents/trust/risk-model.md
  .agents/trust/system-map.md
  .agents/trust/sources.md
  .agents/trust/maintenance.md
  .agents/trust/habits/worktree-and-scope.md
  .agents/trust/habits/diagnosis-before-change.md
  .agents/trust/habits/change-discipline.md
  .agents/trust/habits/efficiency-scan.md
  .agents/trust/habits/search-before-create.md
  .agents/trust/habits/runtime-and-tests.md
  .agents/trust/habits/full-flow-evidence.md
  .agents/trust/habits/continuity-and-corrections.md
  .agents/trust/reviews/bugfix.md
  .agents/trust/reviews/frontend.md
  .agents/trust/reviews/java-backend.md
  .agents/trust/reviews/data-and-seeds.md
  .agents/trust/reviews/demo-e2e-production.md
  .agents/trust/reviews/derived-state.md
  .agents/trust/reviews/performance.md
  .agents/trust/reviews/testing.md
  .agents/trust/reviews/protocol-and-registry.md
  .agents/trust/reviews/security-and-privacy.md
  .agents/trust/reviews/packaging-and-release.md
  .agents/trust/reviews/cross-repository.md
  .agents/trust/reviews/docs-and-i18n.md
  .agents/trust/reviews/completion.md
  .agents/trust/patterns/catalog.md
  .agents/trust/patterns/frontend-vertical-slice.md
  .agents/trust/patterns/java-domain-slice.md
  .agents/trust/patterns/environment-isolation.md
  .agents/trust/patterns/write-time-derived-state.md
  .agents/trust/patterns/external-durable-work.md
  .agents/trust/patterns/ui-behavior-parity.md
  .agents/trust/patterns/smart-list-live-surface.md
  .agents/trust/learnings/accepted.md
  .agents/trust/learnings/candidates.md
  .agents/trust/learnings/rejected-patterns.md
  .agents/trust/learnings/provenance.md
  .agents/trust/learnings/working-context.md
  .agents/trust/templates/task-ledger.md
  .agents/trust/templates/trust-record.md
  .agents/trust/templates/learning-candidate.md
  tools/trust/README.md
  tools/trust/suite/README.md
  tools/trust/suite/case.schema.json
  tools/trust/suite/baselines/README.md
  tools/trust/suite/cases/T001-popup-live-list-options.json
  tools/trust/suite/cases/T002-smart-list-mutation.json
  tools/trust/suite/cases/T003-demo-bootstrap-efficiency.json
  tools/trust/suite/cases/T004-fixture-vs-product.json
  tools/trust/suite/cases/T005-history-not-authority.json
  tools/trust/suite/cases/T006-running-environment.json
  tools/trust/suite/cases/T007-persistence-proof.json
  tools/trust/run-trust-evals.mjs
  tools/trust/tests/trust-eval-runner-test.mjs
  tools/trust/trust-mode.sh
  tools/trust/validate-trust-library.sh
)

failed=0
for path in "${required[@]}"; do
  if [[ ! -f "${path}" ]]; then
    printf 'missing required file: %s\n' "${path}" >&2
    failed=1
  fi
done

if ! rg -q '\.agents/trust/kernel\.md' instructions/myscoutee-development.md; then
  printf 'shared development rules do not reference the trust kernel\n' >&2
  failed=1
fi

if ! rg -q '\.trust-mode\.local' instructions/myscoutee-development.md; then
  printf 'shared development rules do not document the local trust-mode override\n' >&2
  failed=1
fi

if ! git -C "${repo_root}" check-ignore -q --no-index .trust-mode.local; then
  printf '.trust-mode.local must remain gitignored\n' >&2
  failed=1
fi

if [[ -f "${repo_root}/.trust-mode.local" ]]; then
  IFS= read -r local_mode < "${repo_root}/.trust-mode.local" || true
  case "${local_mode}" in
    off|light|standard|deep) ;;
    *)
      printf 'invalid local trust mode: %q\n' "${local_mode}" >&2
      failed=1
      ;;
  esac
fi

kernel_lines="$(wc -l < .agents/trust/kernel.md)"
if (( kernel_lines > 140 )); then
  printf 'trust kernel exceeds the 140-line loading budget: %s\n' \
    "${kernel_lines}" >&2
  failed=1
fi

# The compact trust entrypoint has a budget; independent repository safety and
# workflow instructions are not part of that loading gate.
mode_gate_lines="$(awk '
  /^## Trust mode gate$/ { in_gate = 1 }
  in_gate && /^## / && $0 != "## Trust mode gate" { exit }
  in_gate { count++ }
  END { print count + 0 }
' instructions/myscoutee-development.md)"
if (( mode_gate_lines == 0 || mode_gate_lines > 45 )); then
  printf 'shared trust mode gate must contain 1–45 lines: %s\n' \
    "${mode_gate_lines}" >&2
  failed=1
fi

if ! bash -n tools/trust/trust-mode.sh; then
  printf 'tools/trust/trust-mode.sh has invalid shell syntax\n' >&2
  failed=1
fi

if ! node tools/trust/run-trust-evals.mjs --validate >/dev/null; then
  printf 'trust eval case validation failed\n' >&2
  failed=1
fi

if ! node tools/trust/tests/trust-eval-runner-test.mjs >/dev/null; then
  printf 'trust eval runner self-test failed\n' >&2
  failed=1
fi

while IFS= read -r entry; do
  source_file="${entry%%:*}"
  markdown_link="${entry#*:}"
  target="${markdown_link#']('}"
  target="${target%')'}"
  target="${target%%#*}"
  [[ -z "${target}" ]] && continue
  [[ "${target}" == http://* || "${target}" == https://* ]] && continue
  resolved="$(realpath -m "$(dirname "${source_file}")/${target}")"
  if [[ ! -e "${resolved}" ]]; then
    printf 'broken Markdown link: %s -> %s\n' "${source_file}" "${target}" >&2
    failed=1
  fi
done < <(rg --no-heading --with-filename -o '\]\([^)]*\.md(?:#[^)]*)?\)' \
  .agents/trust instructions -g '*.md' || true)

references=(
  frontend/src/app/shared/core/base/services/operator/operator-registry.service.ts
  frontend/src/app/shared/core/http/services/operator/operator-registry.service.ts
  frontend/src/app/shared/core/local/source/services/operator/operator-registry.service.ts
  frontend/src/app/shared/ui/context/stores/operator/operator-registry.store.ts
  frontend/src/app/shared/core/base/services/platform/route-delay.service.ts
  frontend/src/app/shared/core/local/seed/services/platform/demo-bootstrap.service.ts
  frontend/components/src/lib/ui/components/core/smart-list/smart-list.component.ts
  frontend/components/src/lib/ui/components/core/smart-list/smart-list.types.ts
  frontend/components/src/lib/ui/scheduler/ui-task-scheduler.ts
  frontend/src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts
  frontend/src/app/asset/components/asset-popup/asset-popup.component.ts
  frontend/src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts
  frontend/src/app/operator/components/operator-page/operator-page.component.ts
  server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/controller/OperatorRegistryController.java
  server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRegistryService.java
  server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryOperatorNetworkService.java
  guides/plans/roadmap/PROJECT_CONTEXT.md
  guides/plans/roadmap/PRODUCTION_QUALIFICATION.md
  e2e/README.md
)

for path in "${references[@]}"; do
  if [[ "${repo_root}" != "${library_root}" && ! -e "${repo_root}/${path}" ]]; then
    printf 'missing catalog/canonical reference: %s\n' "${path}" >&2
    failed=1
  fi
done

if (( failed != 0 )); then
  exit 1
fi

printf 'MyScoutee trust library validation passed (%d required files).\n' \
  "${#required[@]}"
