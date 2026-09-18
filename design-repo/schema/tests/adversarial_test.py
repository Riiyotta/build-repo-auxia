#!/usr/bin/env python3
"""
Adversarial test suite for the Auxia design-repo.

Two halves:
  (A) CONTROLS — every real template gets a minimal-but-valid synthetic
      PageSpec built directly from templates/templates.json's own node list,
      plus the bundled example.pagespec.json. All must validate with ZERO
      errors (schema + semantic). A validator that rejects everything is as
      broken as one that rejects nothing.
  (B) MUTATIONS — one deliberately-broken variant per rule category. Each
      MUST be rejected by schema validation, semantic validation, or both.

Run: python3 schema/tests/adversarial_test.py
"""
import copy
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.dirname(HERE)
REPO = os.path.dirname(SCHEMA_DIR)
sys.path.insert(0, SCHEMA_DIR)

from jsonschema import Draft7Validator  # noqa: E402
import semantic_validate as sv  # noqa: E402

PASS = "PASS"
FAIL = "FAIL"


def load_schema():
    return json.load(open(os.path.join(SCHEMA_DIR, "pagespec.schema.json"), encoding="utf-8"))


def load_example():
    return json.load(open(os.path.join(SCHEMA_DIR, "example.pagespec.json"), encoding="utf-8"))


def schema_errors(schema, instance):
    v = Draft7Validator(schema)
    return list(v.iter_errors(instance))


def semantic_errors(instance):
    templates = sv.get_templates()
    sections = sv.get_sections()
    graph = sv.get_graph()
    errors, warnings = [], []
    try:
        sv.validate_pagespec(instance, templates, sections, graph, errors, warnings)
    except Exception as e:  # a crash counts as "rejected" for adversarial purposes
        errors.append(str(e))
    return errors


def is_valid(schema, instance):
    return len(schema_errors(schema, instance)) == 0 and len(semantic_errors(instance)) == 0


def build_minimal_node(section_id, sections):
    """Build a minimally-valid content payload for a given section id by
    walking its own schema/pagespec.schema.json node definition."""
    schema = load_schema()
    node_defs = schema["definitions"]["nodes"]

    def resolve(s):
        if isinstance(s, dict) and "$ref" in s:
            ref = s["$ref"]
            assert ref.startswith("#/")
            node = schema
            for part in ref[2:].split("/"):
                node = node[part]
            return node
        return s

    def fill(s):
        s = resolve(s)
        if "const" in s:
            return s["const"]
        if s.get("type") == "string":
            if "enum" in s:
                return s["enum"][0]
            return "Example text"
        if s.get("type") == "integer":
            return s.get("enum", [3])[0]
        if s.get("type") == "boolean":
            return True
        if s.get("type") == "array":
            n = s.get("minItems", 1)
            return [fill(s["items"]) for _ in range(max(n, 1))]
        if s.get("type") == "object":
            out = {}
            for k in s.get("required", list(s.get("properties", {}).keys())):
                if k in s.get("properties", {}):
                    out[k] = fill(s["properties"][k])
            return out
        return "x"

    # find the node def(s) matching this section id
    matches = [d for key, d in node_defs.items() if key == section_id or key.startswith(section_id + ".")]
    if not matches:
        raise KeyError(section_id)
    node_schema = matches[0]
    content_schema = node_schema["properties"]["content"]
    content = fill(content_schema)
    return {
        "section": section_id,
        "required": True,
        "repeatable": False,
        "motion": {"pattern": "test", "reducedMotionFallback": "test-fallback"},
        "content": content,
    }


def build_control_for_template(tmpl, sections):
    nodes = []
    for n in tmpl["nodes"]:
        if tmpl["id"] == "product" and n["section"] in ("case-studies.rail", "cta.band"):
            continue  # optional agent-studio-only nodes; use example.pagespec.json for that combination instead
        node = build_minimal_node(n["section"], sections)
        if n["section"] == "hero.product":
            node["content"] = {
                "variant": "decisioning",
                "heading": "Example heading",
                "body": "Example body",
                "ctaLabel": "See it",
                "users": [{"name": "A", "tags": ["x"]}],
                "offers": [["x", "0.1"]],
            }
        nodes.append(node)
    return {"pageId": f"control-{tmpl['id']}", "route": tmpl["routes"][0], "template": tmpl["id"], "nodes": nodes}


def main():
    schema = load_schema()
    example = load_example()
    templates = sv.get_templates()
    sections = sv.get_sections()

    results = []

    def record(name, expected_valid, instance):
        valid = is_valid(schema, instance)
        ok = valid == expected_valid
        results.append((name, ok, valid, expected_valid))

    # ---------------- CONTROLS ----------------
    record("control: bundled example.pagespec.json (home)", True, example)
    for tmpl_id, tmpl in templates.items():
        try:
            ctrl = build_control_for_template(tmpl, sections)
            record(f"control: synthetic minimal '{tmpl_id}'", True, ctrl)
        except KeyError as e:
            results.append((f"control: synthetic minimal '{tmpl_id}'", False, None, f"BUILD ERROR: missing node def {e}"))

    # ---------------- MUTATIONS ----------------

    # 1. Schema-layer: wrong enum value for template
    m = copy.deepcopy(example); m["template"] = "not-a-real-template"
    record("mutation: invalid template enum value", False, m)

    # 2. Schema-layer: missing required field (pageId)
    m = copy.deepcopy(example); del m["pageId"]
    record("mutation: missing required pageId", False, m)

    # 3. Schema-layer: invented type alias / unknown section id
    m = copy.deepcopy(example)
    m["nodes"][2] = {"section": "hero.invented-type", "required": True, "repeatable": False,
                      "motion": {"reducedMotionFallback": "x"}, "content": {}}
    record("mutation: invented section type alias", False, m)

    # 4. Schema-layer: missing reducedMotionFallback
    m = copy.deepcopy(example); del m["nodes"][2]["motion"]["reducedMotionFallback"]
    record("mutation: missing motion.reducedMotionFallback", False, m)

    # 5. Schema-layer: additionalProperties smuggled into motion object
    m = copy.deepcopy(example); m["nodes"][2]["motion"]["inventedAnimation"] = "spin"
    record("mutation: invented motion field smuggled in (additionalProperties closed)", False, m)

    # 6. Schema-layer: additionalProperties smuggled into a node's content
    m = copy.deepcopy(example); m["nodes"][2]["content"]["extraField"] = "nope"
    record("mutation: invented content field smuggled into hero.marketing", False, m)

    # 7. Structural: duplicate one-per-page section (shell.navbar twice)
    m = copy.deepcopy(example); m["nodes"].insert(2, copy.deepcopy(m["nodes"][1]))
    record("mutation: duplicate onePerPage section (shell.navbar x2, consecutive)", False, m)

    # 8. Structural: removed mandatory section (drop hero.marketing from home)
    m = copy.deepcopy(example); m["nodes"] = [n for n in m["nodes"] if n["section"] != "hero.marketing"]
    record("mutation: removed mandatory hero.marketing from 'home' template", False, m)

    # 9. Structural: reordered fixed-position section (footer not last)
    m = copy.deepcopy(example)
    footer = m["nodes"].pop()  # shell.footer
    m["nodes"].insert(1, footer)
    record("mutation: shell.footer reordered away from last position", False, m)

    # 10. Structural: template/node-sequence mismatch (declare 'about' but keep home's nodes)
    m = copy.deepcopy(example); m["template"] = "about"; m["route"] = "/about-us"
    record("mutation: template/node-sequence mismatch (declares 'about', ships home's nodes)", False, m)

    # 11. Runtime: maxWords overflow on a real field (hero.marketing.heading, max 14 words)
    m = copy.deepcopy(example)
    m["nodes"][2]["content"]["heading"] = " ".join(["word"] * 40)
    record("mutation: maxWords overflow on hero.marketing.heading", False, m)

    # 12. Runtime: maxWords overflow on nested field (about.values item body, max 55 words)
    about_ctrl = build_control_for_template(templates["about"], sections)
    m = copy.deepcopy(about_ctrl)
    for n in m["nodes"]:
        if n["section"] == "about.values":
            n["content"]["values"][0]["body"] = " ".join(["word"] * 120)
    record("mutation: maxWords overflow on nested about.values[0].body", False, m)

    # 13. Compatibility graph: ONE_HERO_PER_PAGE (two heroes on one page)
    m = copy.deepcopy(example)
    extra_hero = build_minimal_node("hero.about", sections)
    m["nodes"].insert(3, extra_hero)
    record("mutation: ONE_HERO_PER_PAGE violated (two hero sections)", False, m)

    # 14. Compatibility graph: CASE_STUDIES_RAIL_NOT_ON_DECISIONING
    product_ctrl = build_control_for_template(templates["product"], sections)
    m = copy.deepcopy(product_ctrl)
    cs_node = build_minimal_node("case-studies.rail", sections)
    footer_idx = next(i for i, n in enumerate(m["nodes"]) if n["section"] == "shell.footer")
    m["nodes"].insert(footer_idx, cs_node)
    record("mutation: case-studies.rail present on decisioning variant", False, m)

    # 15. Compatibility graph: ABOUT_HAS_NO_CONVERSION_CLOSER
    about_ctrl2 = build_control_for_template(templates["about"], sections)
    m = copy.deepcopy(about_ctrl2)
    cta_node = build_minimal_node("cta.band", sections)
    footer_idx = next(i for i, n in enumerate(m["nodes"]) if n["section"] == "shell.footer")
    m["nodes"].insert(footer_idx, cta_node)
    record("mutation: cta.band injected into 'about' template (banned closer)", False, m)

    # 16. Compatibility graph: SHELL_MUST_WRAP_EVERY_TEMPLATE (missing navbar)
    m = copy.deepcopy(example); m["nodes"] = [n for n in m["nodes"] if n["section"] != "shell.navbar"]
    record("mutation: shell.navbar missing entirely", False, m)

    # 17. Compatibility graph: NO_CONSECUTIVE_SAME_SECTION
    m = copy.deepcopy(example)
    dup = copy.deepcopy(m["nodes"][3])  # brands.marquee
    m["nodes"].insert(4, dup)
    record("mutation: consecutive duplicate section (brands.marquee x2 adjacent)", False, m)

    # 18. Compatibility graph: CTA_BAND_MUST_PRECEDE_FOOTER
    m = copy.deepcopy(example)
    cta_idx = next(i for i, n in enumerate(m["nodes"]) if n["section"] == "cta.band")
    cta_node2 = m["nodes"].pop(cta_idx)
    m["nodes"].insert(cta_idx - 1, cta_node2)  # move it one earlier, no longer right before footer
    record("mutation: cta.band no longer immediately precedes shell.footer", False, m)

    # 19. Legal compliance: missing placeholderNotice on legal.prose
    legal_ctrl = build_control_for_template(templates["legal"], sections)
    m = copy.deepcopy(legal_ctrl)
    for n in m["nodes"]:
        if n["section"] == "legal.prose":
            n["content"]["placeholderNotice"] = ""
    record("mutation: empty legal.prose.placeholderNotice (compliance regression)", False, m)

    # 20. Asset role: invented/unrecognized assetRole value on a logo field
    m = copy.deepcopy(example)
    m["nodes"][3]["content"]["logos"][0]["assetRole"] = "logo.real-third-party-scrape"
    record("mutation: invented/disallowed assetRole value", False, m)

    # 21. route<->template mismatch
    m = copy.deepcopy(example); m["route"] = "/this-route-does-not-exist"
    record("mutation: route not declared for its template", False, m)

    # 22. cols enum violation on use-case.grid
    product_ctrl2 = build_control_for_template(templates["product"], sections)
    m = copy.deepcopy(product_ctrl2)
    for n in m["nodes"]:
        if n["section"] == "use-case.grid":
            n["content"]["cols"] = 5
    record("mutation: use-case.grid.cols outside closed enum [3,4]", False, m)

    # ---------------- REPORT ----------------
    print(f"{'RESULT':<6}  TEST")
    n_pass = n_fail = 0
    for name, ok, got, expected in results:
        status = PASS if ok else FAIL
        if ok:
            n_pass += 1
        else:
            n_fail += 1
        print(f"{status:<6}  {name}  (valid={got}, expected_valid={expected})")

    print(f"\n{n_pass} passed, {n_fail} failed, {len(results)} total")
    sys.exit(1 if n_fail else 0)


if __name__ == "__main__":
    main()
