from __future__ import annotations

import hashlib
import json
from collections import Counter
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "preguntas-sin-resolver.json"
OUTPUT = ROOT / "Redes_Parcial_4K1_2026_SIN_RESOLVER.docx"
EXPECTED_COUNT = 132
FORBIDDEN_KEYS = {"answer", "answers", "correct", "iscorrect", "justification", "score"}


def walk_forbidden(value, path="root"):
    if isinstance(value, dict):
        for key, child in value.items():
            if key.casefold() in FORBIDDEN_KEYS:
                raise ValueError(f"Campo prohibido {key!r} en {path}")
            walk_forbidden(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            walk_forbidden(child, f"{path}[{index}]")


def set_run_font(run, size=10.5, bold=False, color="202A35", italic=False):
    run.font.name = "Arial"
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), "Arial")
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), "Arial")
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def add_page_field(paragraph):
    run = paragraph.add_run()
    set_run_font(run, size=8, color="657386")
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instruction = OxmlElement("w:instrText")
    instruction.set(qn("xml:space"), "preserve")
    instruction.text = " PAGE "
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    placeholder = OxmlElement("w:t")
    placeholder.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    for item in (begin, instruction, separate, placeholder, end):
        run._r.append(item)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    walk_forbidden(data)
    questions = data.get("questions", [])
    if len(questions) != EXPECTED_COUNT:
        raise ValueError(f"Se esperaban {EXPECTED_COUNT} preguntas; hay {len(questions)}")
    if len({question["contentId"] for question in questions}) != EXPECTED_COUNT:
        raise ValueError("Hay preguntas con identificadores de contenido repetidos")
    if data.get("extraction", {}).get("sourceValidation", {}).get("status") != "verified":
        raise ValueError("La extracci?n no cuenta con cotejo de fuente confirmado")

    multiple_count = 0
    image_references = 0
    unique_images = set()
    option_counts = Counter()
    for expected_position, question in enumerate(questions, 1):
        if question.get("extractionPosition") != expected_position:
            raise ValueError(f"La pregunta {expected_position} perdi? su orden de extracci?n")
        if question.get("extractionStatus") != "complete":
            raise ValueError(f"La pregunta {expected_position} no est? completa")
        if not question.get("prompt") or len(question.get("options", [])) < 2:
            raise ValueError(f"La pregunta {expected_position} no tiene texto u opciones suficientes")
        if question.get("tables"):
            raise ValueError(f"La pregunta {expected_position} incluye una tabla sin formato de Word implementado")
        if question["responseType"] not in {"single", "multiple"}:
            raise ValueError(f"Tipo de respuesta inesperado en pregunta {expected_position}")
        if question["responseType"] == "multiple":
            multiple_count += 1
        option_counts[len(question["options"])] += 1
        for field in [question["prompt"], *(option["text"] for option in question["options"])]:
            if any(ord(char) < 32 and char not in "\t\n\r" for char in field):
                raise ValueError(f"Car?cter de control en pregunta {expected_position}")
            if "\n" in field or "\r" in field:
                raise ValueError(f"Salto de l?nea dentro del texto en pregunta {expected_position}")
        for image in question.get("images", []):
            asset_path = ROOT / image["file"]
            if not asset_path.is_file():
                raise FileNotFoundError(f"Falta la imagen {image['file']}")
            if sha256(asset_path) != image["sha256"]:
                raise ValueError(f"Hash distinto para {image['file']}")
            if image.get("sourceKind") != "downloaded_original":
                raise ValueError(f"La imagen {image['file']} no es el original descargado")
            image_references += 1
            unique_images.add(image["file"])

    document = Document()
    section = document.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.98)
    section.bottom_margin = Inches(0.68)
    section.left_margin = Inches(0.76)
    section.right_margin = Inches(0.76)
    section.header_distance = Inches(0.30)
    section.different_first_page_header_footer = True
    section.footer_distance = Inches(0.32)

    normal = document.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string("202A35")
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.08

    title_style = document.styles["Title"]
    title_style_ppr = title_style._element.get_or_add_pPr()
    inherited_border = title_style_ppr.find(qn("w:pBdr"))
    if inherited_border is not None:
        title_style_ppr.remove(inherited_border)

    # Keep the title in the header so Mammoth's importer sees the first body line
    # as the first question instead of creating a false question from front matter.
    header = section.first_page_header
    title_paragraph = header.paragraphs[0]
    title_paragraph.style = document.styles["Title"]
    title_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    title_paragraph.paragraph_format.space_before = Pt(0)
    title_paragraph.paragraph_format.space_after = Pt(0)
    title_run = title_paragraph.add_run("Redes Parcial 4K1 2026")
    set_run_font(title_run, size=16, bold=True, color="17365D")
    title_ppr = title_paragraph._p.get_or_add_pPr()
    title_border = title_ppr.find(qn("w:pBdr"))
    if title_border is not None:
        title_ppr.remove(title_border)

    subtitle = header.add_paragraph()
    subtitle.paragraph_format.space_before = Pt(0)
    subtitle.paragraph_format.space_after = Pt(4)
    subtitle_run = subtitle.add_run("Banco sin resolver | 132 preguntas | cuestionario-redes.vercel.app")
    set_run_font(subtitle_run, size=8.5, color="657386")

    for footer_part in (section.first_page_footer, section.footer):
        footer = footer_part.paragraphs[0]
        footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_page_field(footer)

    props = document.core_properties
    props.title = "Redes Parcial 4K1 2026 Sin Resolver"
    props.subject = "Extracci?n literal del apartado Parcial 4K1"
    props.author = "JoyaCards"
    props.keywords = "Redes, 4K1, banco sin resolver"

    for question in questions:
        number = question["extractionPosition"]
        marker = "@@@" if question["responseType"] == "multiple" else "@@"
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_before = Pt(8)
        paragraph.paragraph_format.space_after = Pt(3)
        paragraph.paragraph_format.keep_with_next = True
        run = paragraph.add_run(f"{marker} {number}. ")
        set_run_font(run, size=7.2, bold=True, color="64748B")
        run = paragraph.add_run(question["prompt"])
        set_run_font(run, size=11.2, bold=True, color="182B45")

        if question["responseType"] == "multiple":
            unscored = document.add_paragraph()
            unscored.paragraph_format.left_indent = Inches(0.08)
            unscored.paragraph_format.space_after = Pt(2)
            unscored.paragraph_format.keep_with_next = True
            marker_run = unscored.add_run("[[SIN_PUNTUAR]]")
            set_run_font(marker_run, size=7.2, color="64748B")

        for image in question.get("images", []):
            image_marker = document.add_paragraph()
            image_marker.paragraph_format.space_before = Pt(2)
            image_marker.paragraph_format.space_after = Pt(2)
            image_marker.paragraph_format.keep_with_next = True
            image_marker_run = image_marker.add_run("[[IMAGEN]]")
            set_run_font(image_marker_run, size=7.2, color="64748B")

            image_paragraph = document.add_paragraph()
            image_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            image_paragraph.paragraph_format.space_after = Pt(4)
            image_paragraph.paragraph_format.keep_with_next = True
            inline = image_paragraph.add_run().add_picture(str(ROOT / image["file"]), width=Inches(6.72))
            inline._inline.docPr.set("descr", image.get("alt") or "Imagen asociada a la pregunta")
            inline._inline.docPr.set("title", image.get("alt") or "Imagen de la pregunta")

        for index, option in enumerate(question["options"]):
            letter = chr(ord("a") + index)
            option_paragraph = document.add_paragraph()
            option_paragraph.paragraph_format.left_indent = Inches(0.28)
            option_paragraph.paragraph_format.first_line_indent = Inches(-0.22)
            option_paragraph.paragraph_format.space_after = Pt(3)
            option_paragraph.paragraph_format.keep_together = True
            option_paragraph.paragraph_format.keep_with_next = index < len(question["options"]) - 1
            option_run = option_paragraph.add_run(f"{letter}) ")
            set_run_font(option_run, size=10.4, bold=True, color="214D80")
            option_run = option_paragraph.add_run(option["text"])
            set_run_font(option_run, size=10.4, color="202A35")

    document.save(OUTPUT)
    print(json.dumps({
        "output": str(OUTPUT),
        "questions": len(questions),
        "singleChoice": sum(q["responseType"] == "single" for q in questions),
        "multipleChoice": multiple_count,
        "imageReferences": image_references,
        "uniqueOriginalImages": len(unique_images),
        "optionCountDistribution": dict(sorted(option_counts.items())),
        "sourceValidation": data["extraction"]["sourceValidation"]["status"]
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
