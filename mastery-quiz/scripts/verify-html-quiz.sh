#!/usr/bin/env bash
# Deterministic mechanical audit for one HTML quiz page.
# Usage: bash verify-html-quiz.sh <quiz-path> [serve-root]
#   <quiz-path>  the quiz HTML file, in any directory tree
#   [serve-root] directory to serve so relative assets resolve;
#                defaults to the quiz directory's parent
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
target="${1:-}"
serve_root="${2:-}"

if [[ -z "$target" ]]; then
  printf 'Usage: %s <quiz-path> [serve-root]\n' "$0" >&2
  exit 2
fi
if [[ "$target" != /* ]]; then
  target="$PWD/$target"
fi
target_dir="$(cd "$(dirname "$target")" && pwd)"
target="$target_dir/$(basename "$target")"
if [[ ! -f "$target" ]]; then
  printf 'Quiz file not found: %s\n' "$target" >&2
  exit 2
fi
if [[ -z "$serve_root" ]]; then
  serve_root="$(dirname "$(dirname "$target")")"
fi
serve_root="$(cd "$serve_root" && pwd)"
if [[ "$target" != "$serve_root"/* ]]; then
  printf 'Quiz file %s is not inside serve root %s\n' "$target" "$serve_root" >&2
  exit 2
fi
if ! command -v playwright-cli >/dev/null 2>&1; then
  printf 'playwright-cli is required.\n' >&2
  exit 2
fi

mkdir -p "$serve_root/.playwright-cli"
relative_path="${target#$serve_root/}"
relative_path="${relative_path// /%20}"
port="${QUIZ_AUDIT_PORT:-$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')}"
session="mastery-quiz-audit-$$"
server_pid=""
cleanup() {
  playwright-cli -s="$session" close >/dev/null 2>&1 || true
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" >/dev/null 2>&1 || true
    wait "$server_pid" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "$serve_root"
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$serve_root" >/dev/null 2>&1 &
server_pid=$!
sleep 0.2
if ! kill -0 "$server_pid" >/dev/null 2>&1; then
  printf 'Could not start local quiz server on port %s.\n' "$port" >&2
  exit 1
fi

playwright-cli -s="$session" open "http://127.0.0.1:$port/$relative_path"
playwright-cli -s="$session" run-code --filename="$script_dir/verify-html-quiz.js"
