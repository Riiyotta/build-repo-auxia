#!/usr/bin/env python3
"""
Semantic validator for Auxia PageSpecs — everything JSON Schema structurally
cannot express: template<->node cross-reference, compatibility/graph.json
rhythm rules, per-field maxWords budgets (pulled from sections/*.json, not
re-typed here), reducedMotionFallback presence, and route restrictions.

Path portability: repo root is derived from this file's own location, never
hardcoded — this script must work identically when design-repo/ is copied
anywhere else on disk (self-containment requirement).
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)  # design-repo/


def load(*parts):
    with open(os.path.join(REPO, *parts), encoding="utf-8") as f:
        return json.load(f)


def word_count(s):
    if s is None:
        return 0
    return len(str(s).split())


class ValidationError(Exception):
    pass


def get_templates():
    return {t["id"]: t for t in load("templates", "templates.json")["templates"]}


def get_sections():
    sections = {}
    sdir = os.path.join(REPO, "sections")
    for fn in os.listdir(sdir):
        if fn.endswith(".json"):
            data = json.load(open(os.path.join(sdir, fn), encoding="utf-8"))
            sections[data["id"]] = data
    return sections


def get_graph():
    return load("compatibility", "graph.json")["rules"]


# --------------------------------------------------------------------------
# maxWords enforcement — walks a section's own content contract and the
# instance's content in lockstep, checking every field that declares maxWords.
# --------------------------------------------------------------------------
def check_max_words(section_id, schema_node, instance, path, errors):
    if isinstance(schema_node, dict) and "maxWords" in schema_node and isinstance(instance, str):
        wc = word_count(instance)
        if wc > schema_node["maxWords"]:
            errors.append(
                f"[{section_id}] {path}: {wc} words exceeds maxWords={schema_node['maxWords']} "
                f"(value: {instance[:60]!r}...)"
            )
        return

    if isinstance(schema_node, dict) and schema_node.get("type") == "array" and "items" in schema_node:
        if isinstance(instance, list):
            for i, item in enumerate(instance):
                check_max_words(section_id, schema_node["items"], item, f"{path}[{i}]", errors)
        return

    if isinstance(schema_node, dict) and schema_node.get("type") == "object" and "properties" in schema_node:
        if isinstance(instance, dict):
            for key, sub_schema in schema_node["properties"].items():
                if key in instance:
                    check_max_words(section_id, sub_schema, instance[key], f"{path}.{key}", errors)
        return

    # oneOf (hero.product) — check word limits against whichever branch matches variant
    if isinstance(schema_node, dict) and "oneOf" in schema_node:
        if isinstance(instance, dict):
            for branch in schema_node["oneOf"]:
                props = branch.get("properties", {})
                variant_const = props.get("variant", {}).get("const")
                if variant_const is None or instance.get("variant") == variant_const:
                    check_max_words(section_id, branch, instance, path, errors)
                    return


def validate_pagespec(instance, templates, sections, graph, errors, warnings):
    pid = instance.get("pageId", "<unknown>")

    # --- 1. template <-> route consistency ---------------------------------
    tmpl_id = instance.get("template")
    if tmpl_id not in templates:
        errors.append(f"[{pid}] unknown template '{tmpl_id}'")
        return
    tmpl = templates[tmpl_id]
    if instance.get("route") not in tmpl["routes"]:
        errors.append(
            f"[{pid}] route '{instance.get('route')}' is not declared for template "
            f"'{tmpl_id}' (declared routes: {tmpl['routes']})"
        )

    # --- 2. node sequence cross-referenced against the DECLARED TEMPLATE ----
    # This is the "single most repeated bug class": checking nodes[] in
    # isolation without cross-referencing the template field's own node list.
    instance_sections = [n["section"] for n in instance["nodes"]]
    template_required = [n["section"] for n in tmpl["nodes"] if n["required"]]
    template_all_allowed = {n["section"] for n in tmpl["nodes"]}

    for req in template_required:
        if req not in instance_sections:
            errors.append(f"[{pid}] template '{tmpl_id}' requires section '{req}' but it is missing from nodes[]")

    for sec in instance_sections:
        if sec not in template_all_allowed:
            errors.append(f"[{pid}] section '{sec}' appears in nodes[] but is not part of template '{tmpl_id}'s node list")

    # Order check: the instance's nodes, filtered to only sections the template
    # declares, must appear in the same relative order as templates.json.
    template_order = [n["section"] for n in tmpl["nodes"]]
    filtered_instance_order = [s for s in instance_sections if s in template_order]
    filtered_template_order = [s for s in template_order if s in instance_sections]
    if filtered_instance_order != filtered_template_order:
        errors.append(
            f"[{pid}] node order {filtered_instance_order} does not match template "
            f"'{tmpl_id}''s declared order {filtered_template_order}"
        )

    # --- 3. per-node checks: motion.reducedMotionFallback, maxWords --------
    for node in instance["nodes"]:
        sid = node["section"]
        motion = node.get("motion", {})
        if not motion.get("reducedMotionFallback"):
            errors.append(f"[{pid}] node '{sid}' is missing a non-empty motion.reducedMotionFallback")

        section_def = sections.get(sid)
        if section_def is None:
            errors.append(f"[{pid}] node '{sid}' has no matching sections/*.json contract")
            continue

        content_schema = section_def.get("content", {})
        check_max_words(sid, content_schema, node.get("content"), f"{sid}.content", errors)

        # legal.prose placeholder-notice compliance rule (mirrors graph rule)
        if sid == "legal.prose":
            notice = node.get("content", {}).get("placeholderNotice", "")
            if not notice.strip():
                errors.append(f"[{pid}] legal.prose.content.placeholderNotice must be a non-empty, visibly-rendered string")

    # --- 4. compatibility graph rules ---------------------------------------
    hero_nodes = [s for s in instance_sections if s.startswith("hero.")]
    if len(hero_nodes) > 1:
        errors.append(f"[{pid}] ONE_HERO_PER_PAGE violated: multiple hero sections {hero_nodes}")

    if instance_sections[:2] != ["shell.banner", "shell.navbar"]:
        errors.append(f"[{pid}] SHELL_MUST_WRAP_EVERY_TEMPLATE violated: first two nodes must be shell.banner, shell.navbar")
    if not instance_sections or instance_sections[-1] != "shell.footer":
        errors.append(f"[{pid}] SHELL_MUST_WRAP_EVERY_TEMPLATE violated: last node must be shell.footer")

    if "cta.band" in instance_sections:
        idx = instance_sections.index("cta.band")
        if instance_sections[idx + 1] != "shell.footer":
            errors.append(f"[{pid}] CTA_BAND_MUST_PRECEDE_FOOTER violated")

    if tmpl_id == "product":
        # determine variant from hero.product node
        hero_node = next((n for n in instance["nodes"] if n["section"] == "hero.product"), None)
        variant = hero_node["content"].get("variant") if hero_node else None
        if variant == "decisioning" and "case-studies.rail" in instance_sections:
            errors.append(f"[{pid}] CASE_STUDIES_RAIL_NOT_ON_DECISIONING violated")
        if variant == "decisioning" and "cta.band" in instance_sections:
            warnings.append(f"[{pid}] decisioning variant unexpectedly includes cta.band (prefooter should close the page)")

    if tmpl_id == "about":
        banned = {"brands.marquee", "case-studies.rail", "prefooter.crosssell", "cta.band"}
        found = banned.intersection(instance_sections)
        if found:
            errors.append(f"[{pid}] ABOUT_HAS_NO_CONVERSION_CLOSER violated: found {found}")

    for i in range(len(instance_sections) - 1):
        if instance_sections[i] == instance_sections[i + 1]:
            errors.append(f"[{pid}] NO_CONSECUTIVE_SAME_SECTION violated at index {i}: '{instance_sections[i]}' repeated")


def main():
    errors = []
    warnings = []
    templates = get_templates()
    sections = get_sections()
    graph = get_graph()

    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join("schema", "example.pagespec.json")
    target_path = target if os.path.isabs(target) else os.path.join(REPO, target)
    instance = json.load(open(target_path, encoding="utf-8"))

    validate_pagespec(instance, templates, sections, graph, errors, warnings)

    for w in warnings:
        print("WARN:", w)
    if errors:
        print(f"FAIL: {len(errors)} semantic error(s)")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("PASS: semantic validation clean (0 errors)")


if __name__ == "__main__":
    main()
