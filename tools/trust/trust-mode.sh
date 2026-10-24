#!/usr/bin/env bash
# Manage the repository-local trust loading mode.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
mode_file="${repo_root}/.trust-mode.local"
requested_mode="${1:-status}"

usage() {
  printf 'Usage: %s {status|off|light|standard|deep|default}\n' "$0" >&2
}

case "${requested_mode}" in
  status)
    if [[ -f "${mode_file}" ]]; then
      IFS= read -r current_mode < "${mode_file}" || true
      mode_source="local override"
    else
      current_mode="standard"
      mode_source="default"
    fi
    case "${current_mode}" in
      off|light|standard|deep)
        printf 'trust mode: %s (%s)\n' "${current_mode}" "${mode_source}"
        ;;
      *)
        printf 'trust mode: invalid local value %q (effective fallback: standard)\n' \
          "${current_mode}" >&2
        exit 1
        ;;
    esac
    ;;
  off|light|standard|deep)
    printf '%s\n' "${requested_mode}" > "${mode_file}"
    printf 'trust mode set to %s (gitignored local override)\n' \
      "${requested_mode}"
    ;;
  default)
    rm -f -- "${mode_file}"
    printf 'trust mode reset to standard (repository default)\n'
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    exit 2
    ;;
esac
