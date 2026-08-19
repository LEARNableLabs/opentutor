#!/usr/bin/env python3
"""Eval script for OpenTutor (JavaScript + Markdown project).

Dimensions:
  - syntax_check (0.3): validate JS files parse with `node --check`
  - observability (0.3): scan JS files for logging/tracing patterns
  - architecture (0.4): verify required files exist and JSON files parse

Output format:
    {"results": [{"name": str, "score": float, "weight": float, "passed": bool, "details": str}, ...]}
"""

import json
import re
import subprocess
import sys
from pathlib import Path

SKIP_DIRS = {
    "tests", "test", ".venv", "venv", "node_modules", "__pycache__",
    ".git", ".factory", "eval", "dist", "build",
}


def _js_files(root: str = "scripts") -> list[Path]:
    return [
        f for f in Path(root).rglob("*.js")
        if not any(p in f.parts for p in SKIP_DIRS)
    ]


def eval_syntax_check() -> dict:
    """Run `node --check` on every .js file under scripts/."""
    files = _js_files()
    if not files:
        return {
            "name": "syntax_check",
            "score": 0.0,
            "weight": 0.3,
            "passed": False,
            "details": "No .js files found under scripts/",
        }

    passed_count = 0
    errors = []
    for f in files:
        try:
            result = subprocess.run(
                ["node", "--check", str(f)],
                capture_output=True,
                text=True,
                timeout=30,
            )
            if result.returncode == 0:
                passed_count += 1
            else:
                errors.append(f"{f}: {(result.stderr or '').strip()[:120]}")
        except subprocess.TimeoutExpired:
            errors.append(f"{f}: timed out")

    score = passed_count / len(files)
    detail_parts = [f"{passed_count}/{len(files)} files parsed OK"]
    if errors:
        detail_parts.append("; ".join(errors[:5]))

    return {
        "name": "syntax_check",
        "score": round(score, 3),
        "weight": 0.3,
        "passed": score == 1.0,
        "details": " | ".join(detail_parts)[:500],
    }


def eval_observability() -> dict:
    """Scan .js files for logging and tracing patterns."""
    log_pats = [
        r"\bconsole\.(log|warn|error|info|debug)\s*\(",
        r"\blogger\.\w+\s*\(",
        r"\blog\.\w+\s*\(",
    ]
    struct_pats = [
        r"\bpino\b",
        r"\bwinston\b",
        r"\bbunyan\b",
        r"\bstructuredLog\b",
    ]
    trace_pats = [
        r"request\.id|req\.id|trace\.id|traceId|correlationId",
        r"\bopentelemetry\b",
        r"trace\.context|TraceContext|span",
    ]

    files = _js_files()
    if not files:
        return {
            "name": "observability",
            "score": 0.0,
            "weight": 0.3,
            "passed": False,
            "details": "No .js files found under scripts/",
        }

    files_with_logging = 0
    total_log_calls = 0
    has_struct = False
    has_trace = False

    for f in files:
        try:
            code = f.read_text(errors="replace")
        except OSError:
            continue

        file_has_log = False
        for pat in log_pats:
            matches = re.findall(pat, code)
            total_log_calls += len(matches)
            if matches:
                file_has_log = True

        if file_has_log:
            files_with_logging += 1

        for pat in struct_pats:
            if re.search(pat, code):
                has_struct = True

        for pat in trace_pats:
            if re.search(pat, code, re.IGNORECASE):
                has_trace = True

    coverage = files_with_logging / len(files)
    density = min(1.0, total_log_calls / max(len(files), 1))

    score = (
        0.40 * coverage
        + 0.25 * float(has_struct)
        + 0.20 * float(has_trace)
        + 0.15 * density
    )

    details = (
        f"coverage={coverage:.0%} ({files_with_logging}/{len(files)}), "
        f"structured={'yes' if has_struct else 'no'}, "
        f"tracing={'yes' if has_trace else 'no'}, "
        f"density={density:.0%}"
    )

    return {
        "name": "observability",
        "score": round(score, 3),
        "weight": 0.3,
        "passed": score >= 0.3,
        "details": details,
    }


def eval_architecture() -> dict:
    """Check structural integrity: required files exist, JSON parses, setup script present."""
    checks = []

    required_files = [
        "skills/tutor/SKILL.md",
        "workspace/AGENTS.md",
        "workspace/IDENTITY.md",
        "workspace/SOUL.md",
        "workspace/USER.md",
        "scripts/setup.js",
    ]
    for rf in required_files:
        exists = Path(rf).is_file()
        checks.append((f"{rf} exists", exists))

    json_files = [
        "package.json",
        "workspace/tutor/progress.json",
    ]
    for jf in json_files:
        p = Path(jf)
        if not p.is_file():
            checks.append((f"{jf} exists+parses", False))
            continue
        try:
            json.loads(p.read_text(errors="replace"))
            checks.append((f"{jf} parses", True))
        except (json.JSONDecodeError, OSError):
            checks.append((f"{jf} parses", False))

    passed = [c for c in checks if c[1]]
    score = len(passed) / len(checks) if checks else 0.0

    failed_names = [c[0] for c in checks if not c[1]]
    detail = f"{len(passed)}/{len(checks)} checks passed"
    if failed_names:
        detail += f" | failed: {', '.join(failed_names[:5])}"

    return {
        "name": "architecture",
        "score": round(score, 3),
        "weight": 0.4,
        "passed": score >= 0.8,
        "details": detail[:500],
    }


EVALS = [eval_syntax_check, eval_observability, eval_architecture]


def main() -> None:
    results = [fn() for fn in EVALS]
    output = {"results": results}
    json.dump(output, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
