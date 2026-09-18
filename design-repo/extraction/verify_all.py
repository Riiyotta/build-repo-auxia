#!/usr/bin/env python3
"""
verify_all.py — one-shot verification for the Auxia design-repo: JSON parse,
schema validation, semantic validation, allowlist parity, citation validity
(graceful degradation with no sibling source), a manifest/reality drift check,
version parity, and an absolute-path scan.

Path portability: REPO is derived from this file's own location, never a
hardcoded absolute path — copy design-repo/ to any directory (including a bare
/tmp checkout with no sibling folders) and this script still finds every file
it needs relative to itself. That is exactly what the self-containment test in
MASTER-GUIDE.md's pre-ship checklist requires.

Checks run:
  1. Every *.json file under this repo parses as valid JSON.
  2. schema/pagespec.schema.json is a valid Draft-07 schema.
  3. schema/example.pagespec.json validates against it with zero errors.
  4. Every section referenced by templates/templates.json has a matching
     sections/<id>.json file, and vice versa (no orphans either direction).
  5. schema/semantic_validate.py accepts the bundled example.
  6. ALLOWLIST PARITY. tokens/llm/component-allowlist.json's ids for
     primitives/components/sections match the real files on disk AND the
     schema's own section enum, in all three directions — not a one-time
     manual audit, re-run on every invocation.
  7. CITATION VALIDITY. Every `<path>:<line>` / `<path>:<start>-<end>` citation
     in any JSON file in this repo is resolved against the real sibling source
     file. SKIPS with a loud warning (not a failure) when no sibling src/ is
     present, e.g. this design-repo copied standalone with no project around
     it — skipping keeps self-containment true; failing would make it false.
  8. MANIFEST / REALITY DRIFT (MASTER-GUIDE.md section 3.16 — mandatory, not
     optional). Every entry in registry.manifest.json's `counts` block is
     recomputed directly from disk right now and compared; any mismatch fails
     loudly by name. A manifest is not self-verifying just because it looks
     internally coherent — it has to be checked against the files it
     summarizes, every run, not trusted from a prior hand-edit.
  9. VERSION PARITY. tokens/llm/component-allowlist.json's `allowlistVersion`
     must equal registry.manifest.json's `allowlistVersion`, and
     assets/asset-roles.json's `version` must equal registry.manifest.json's
     `assetRolesVersion`.
  10. ABSOLUTE-PATH SCAN. Scan this whole repo for a user-home-style absolute
      filesystem path and fail if anything is found — a design-repo that
      leaks the machine it was built on isn't portable.

Usage: python3 verify_all.py
Exit code 0 = everything passed. Exit code 1 = at least one check failed.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)  # design-repo/
sys.path.insert(0, os.path.join(REPO, "schema"))

RESULTS = []


def check(name, ok, detail=""):
    RESULTS.append((name, ok, detail))
    mark = "PASS" if ok else "FAIL"
    print(f"[{mark}] {name}" + (f" — {detail}" if detail and not ok else ""))


def all_json_files():
    for root, dirs, files in os.walk(REPO):
        for fn in files:
            if fn.endswith(".json"):
                yield os.path.join(root, fn)


# ---------------------------------------------------------------------------
# Check 7 — citation validity (graceful degradation, no sibling source)
# ---------------------------------------------------------------------------
CITATION_RE = re.compile(
    r"((?:\.\./)?(?:src|public|dist)/[A-Za-z0-9_\-./]+\.[A-Za-z0-9]+):(\d+)(?:-(\d+))?"
)

# The source project is design-repo/'s parent when this folder sits alongside
# it. Derived from __file__, like REPO itself — never hardcoded.
SOURCE_ROOT = os.path.dirname(REPO)


def _iter_strings(obj, path=""):
    if isinstance(obj, str):
        yield path, obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from _iter_strings(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from _iter_strings(v, f"{path}[{i}]")


def check_citations():
    """Resolve every file:line citation in every JSON file against real source."""
    probe = os.path.join(SOURCE_ROOT, "src")
    if not os.path.isdir(probe):
        print("[SKIP] citation validity — sibling source project not present "
              f"(expected 'src/' at {probe}). This is EXPECTED for a standalone "
              "design-repo/ copy (a /tmp self-containment run, or a consumer who "
              "received only the zip): citations point outside this folder by "
              "design and cannot be checked without the sibling project. "
              "Re-run this script next to the real Auxia checkout to exercise "
              "the check for real.")
        RESULTS.append(("citation validity (SKIPPED — no sibling source project)",
                        True, "skipped, not failed — see console note above"))
        return

    line_counts = {}

    def nlines(rel):
        rel = rel[3:] if rel.startswith("../") else rel
        if rel not in line_counts:
            fp = os.path.join(SOURCE_ROOT, rel)
            if not os.path.isfile(fp):
                line_counts[rel] = None
            else:
                with open(fp, encoding="utf-8", errors="replace") as fh:
                    line_counts[rel] = sum(1 for _ in fh)
        return line_counts[rel]

    total = 0
    bad = []
    for path in all_json_files():
        try:
            data = json.load(open(path, encoding="utf-8"))
        except Exception:
            continue  # already reported by check 1
        rel_json = os.path.relpath(path, REPO)
        for jpath, s in _iter_strings(data):
            for m in CITATION_RE.finditer(s):
                rel_src, start = m.group(1), int(m.group(2))
                end = int(m.group(3)) if m.group(3) else start
                total += 1
                n = nlines(rel_src)
                if n is None:
                    bad.append(f"{rel_json}{jpath}: '{m.group(0)}' — file does not exist")
                elif start < 1 or end < start:
                    bad.append(f"{rel_json}{jpath}: '{m.group(0)}' — malformed range")
                elif end > n:
                    bad.append(f"{rel_json}{jpath}: '{m.group(0)}' — file has only {n} lines")

    check(f"all {total} file:line citations resolve to a real range in the sibling source project",
          len(bad) == 0, " | ".join(bad[:20]) + (f" (+{len(bad) - 20} more)" if len(bad) > 20 else ""))


# ---------------------------------------------------------------------------
# Check 10 — absolute-path scan
# ---------------------------------------------------------------------------
_HOME_SEGMENT = "".join(["/", "U", "s", "e", "r", "s", "/"])
_NIX_HOME_SEGMENT = "".join(["/", "h", "o", "m", "e", "/"])
ABS_PATH_RE = re.compile(
    re.escape(_HOME_SEGMENT) + r"[A-Za-z0-9_.\-]+"
    r"|" + re.escape(_NIX_HOME_SEGMENT) + r"[A-Za-z0-9_.\-]+"
    r"|C:\\\\Users\\\\"
)


def check_absolute_paths():
    hits = []
    for root, dirs, files in os.walk(REPO):
        for fn in files:
            fp = os.path.join(root, fn)
            try:
                with open(fp, encoding="utf-8", errors="ignore") as fh:
                    for i, line in enumerate(fh, 1):
                        if ABS_PATH_RE.search(line):
                            hits.append(f"{os.path.relpath(fp, REPO)}:{i}: {line.strip()[:120]}")
            except Exception:
                continue
    check("no absolute local machine paths anywhere in the repo", len(hits) == 0,
          " | ".join(hits[:20]) + (f" (+{len(hits) - 20} more)" if len(hits) > 20 else ""))


def main():
    print(f"REPO root (derived, not hardcoded): {REPO}\n")

    # 1. every JSON file parses
    bad_json = []
    total_json = 0
    for path in all_json_files():
        total_json += 1
        try:
            json.load(open(path, encoding="utf-8"))
        except Exception as e:
            bad_json.append((path, str(e)))
    check(f"all {total_json} *.json files parse", len(bad_json) == 0,
          "; ".join(f"{p}: {e}" for p, e in bad_json))

    # 2 + 3. schema valid + example validates
    try:
        from jsonschema import Draft7Validator
        schema = json.load(open(os.path.join(REPO, "schema", "pagespec.schema.json")))
        Draft7Validator.check_schema(schema)
        check("schema/pagespec.schema.json is valid Draft-07", True)
        instance = json.load(open(os.path.join(REPO, "schema", "example.pagespec.json")))
        errors = list(Draft7Validator(schema).iter_errors(instance))
        check("schema/example.pagespec.json validates with zero Draft7Validator errors",
              len(errors) == 0, "; ".join(e.message for e in errors))
    except Exception as e:
        check("schema validation step", False, str(e))

    # 4. section <-> template cross-reference, both directions
    section_ids = set()
    templates = []
    try:
        sections_dir = os.path.join(REPO, "sections")
        section_ids = {fn[:-5] for fn in os.listdir(sections_dir) if fn.endswith(".json")}
        templates = json.load(open(os.path.join(REPO, "templates", "templates.json")))["templates"]
        used_ids = set()
        for t in templates:
            for n in t["nodes"]:
                used_ids.add(n["section"])
        missing = used_ids - section_ids
        orphaned = section_ids - used_ids
        check("every template node references an existing sections/*.json file",
              len(missing) == 0, f"missing: {missing}")
        check("every sections/*.json file is referenced by at least one template",
              len(orphaned) == 0, f"orphaned: {orphaned}")
    except Exception as e:
        check("section/template cross-reference", False, str(e))

    # 5. semantic validator accepts the example
    try:
        import semantic_validate as sv
        instance = json.load(open(os.path.join(REPO, "schema", "example.pagespec.json")))
        sv_templates = sv.get_templates()
        sv_sections = sv.get_sections()
        sv_graph = sv.get_graph()
        sv_errors = []
        sv_warnings = []
        sv.validate_pagespec(instance, sv_templates, sv_sections, sv_graph, sv_errors, sv_warnings)
        check("semantic_validate.py: example has zero errors (warnings allowed)",
              len(sv_errors) == 0, "; ".join(sv_errors))
    except Exception as e:
        check("semantic_validate.py import/run", False, str(e))

    # 6. allowlist parity — component-allowlist ids vs real files vs schema enum
    allowlist = None
    try:
        allowlist = json.load(open(os.path.join(REPO, "tokens", "llm", "component-allowlist.json")))

        primitives_dir = os.path.join(REPO, "primitives")
        components_dir = os.path.join(REPO, "components")
        real_primitive_ids = {fn[:-5] for fn in os.listdir(primitives_dir) if fn.endswith(".json")}
        real_component_ids = {fn[:-5] for fn in os.listdir(components_dir) if fn.endswith(".json")}

        allow_primitive_ids = {e["id"] for e in allowlist.get("primitives", [])}
        allow_component_ids = {e["id"] for e in allowlist.get("components", [])}
        allow_section_ids = {e["id"] for e in allowlist.get("sections", [])}

        mismatches = {}
        if allow_primitive_ids != real_primitive_ids:
            mismatches["primitives"] = {
                "allowlist_only": sorted(allow_primitive_ids - real_primitive_ids),
                "disk_only": sorted(real_primitive_ids - allow_primitive_ids),
            }
        if allow_component_ids != real_component_ids:
            mismatches["components"] = {
                "allowlist_only": sorted(allow_component_ids - real_component_ids),
                "disk_only": sorted(real_component_ids - allow_component_ids),
            }
        if allow_section_ids != section_ids:
            mismatches["sections_vs_disk"] = {
                "allowlist_only": sorted(allow_section_ids - section_ids),
                "disk_only": sorted(section_ids - allow_section_ids),
            }

        # cross-check allowlist sections against the schema's own section-node enum
        schema = json.load(open(os.path.join(REPO, "schema", "pagespec.schema.json")))
        schema_text = json.dumps(schema)
        schema_section_consts = set(re.findall(r'"const"\s*:\s*"([a-z0-9.\-]+)"', schema_text))
        # the schema's node "const" values include section ids (some sections have
        # variant-specific $refs, e.g. hero.product.agent-studio) — normalize to the
        # base section id (strip a variant suffix beyond the first two dot segments
        # when it doesn't correspond to a real sections/*.json file).
        normalized_schema_sections = set()
        for c in schema_section_consts:
            if c in allow_section_ids:
                normalized_schema_sections.add(c)
            else:
                parts = c.split(".")
                base = ".".join(parts[:2])
                if base in allow_section_ids:
                    normalized_schema_sections.add(base)
        missing_from_schema = allow_section_ids - normalized_schema_sections
        if missing_from_schema:
            mismatches["sections_vs_schema_enum"] = {"allowlist_ids_not_found_as_schema_const": sorted(missing_from_schema)}

        check("allowlist parity: component-allowlist.json ids == real files on disk == schema enum",
              len(mismatches) == 0, json.dumps(mismatches))
    except Exception as e:
        check("allowlist parity check", False, str(e))

    # 8. manifest / reality drift — MASTER-GUIDE.md 3.16, mandatory
    manifest = None
    try:
        manifest = json.load(open(os.path.join(REPO, "registry.manifest.json")))
        tok_count = 0
        for root, _, files in os.walk(os.path.join(REPO, "tokens")):
            tok_count += len([f for f in files if f.endswith(".json")])
        graph = json.load(open(os.path.join(REPO, "compatibility", "graph.json")))
        real_counts = {
            "tokens": tok_count,
            "primitives": len([f for f in os.listdir(os.path.join(REPO, "primitives")) if f.endswith(".json")]),
            "components": len([f for f in os.listdir(os.path.join(REPO, "components")) if f.endswith(".json")]),
            "sections": len(section_ids),
            "templates": len(templates),
            "routes": sum(len(t["routes"]) for t in templates),
            "compatibilityRules": len(graph["rules"]),
        }
        mismatches = {}
        for key, real_val in real_counts.items():
            manifest_val = manifest.get("counts", {}).get(key)
            if manifest_val != real_val:
                mismatches[key] = {"manifest": manifest_val, "real": real_val}
        check("registry.manifest.json counts match disk (recomputed every run, not trusted)",
              len(mismatches) == 0, f"mismatches: {json.dumps(mismatches)}")
    except Exception as e:
        check("registry.manifest.json count check", False, str(e))

    # 9. version parity
    try:
        drift = {}
        if allowlist is not None and manifest is not None:
            if allowlist.get("allowlistVersion") != manifest.get("allowlistVersion"):
                drift["allowlistVersion"] = {"allowlist_file": allowlist.get("allowlistVersion"),
                                              "manifest": manifest.get("allowlistVersion")}
        asset_roles = json.load(open(os.path.join(REPO, "assets", "asset-roles.json")))
        if manifest is not None and asset_roles.get("version") != manifest.get("assetRolesVersion"):
            drift["assetRolesVersion"] = {"asset_roles_file": asset_roles.get("version"),
                                           "manifest": manifest.get("assetRolesVersion")}
        check("versioned LLM-facing files match their registry.manifest.json version fields",
              len(drift) == 0, json.dumps(drift))

        missing_entry = []
        if manifest is not None:
            for name, target in manifest.get("entryPoints", {}).items():
                for part in [t.strip() for t in target.split(",")]:
                    if not part:
                        continue
                    if not os.path.exists(os.path.join(REPO, part.rstrip("/"))):
                        missing_entry.append(f"{name} -> {part}")
        check("every registry.manifest.json entryPoints path exists on disk (no ../ paths)",
              len(missing_entry) == 0, "; ".join(missing_entry))

        outside_entry = [f"{name} -> {t}" for name, t in manifest.get("entryPoints", {}).items() if "../" in t] if manifest else []
        check("no registry.manifest.json entryPoints path points outside design-repo/",
              len(outside_entry) == 0, "; ".join(outside_entry))
    except Exception as e:
        check("manifest version-parity / entryPoints check", False, str(e))

    # 7. citation validity (graceful degradation)
    check_citations()

    # 10. absolute-path scan
    check_absolute_paths()

    failed = [r for r in RESULTS if not r[1]]
    print(f"\n{len(RESULTS) - len(failed)}/{len(RESULTS)} checks passed.")
    if failed:
        print("FAILED:")
        for name, ok, detail in failed:
            print(f"  - {name}: {detail}")
        sys.exit(1)
    print("verify_all.py: ALL CHECKS PASSED")
    sys.exit(0)


if __name__ == "__main__":
    main()
