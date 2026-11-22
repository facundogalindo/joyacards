from pathlib import Path
from hashlib import sha256

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

REPO_ROOT = Path(__file__).resolve().parents[2]
ASSET_DIRECTORY = REPO_ROOT / "content" / "redes-parcial-3-2026" / "assets"
OUTPUT_DIRECTORY = ASSET_DIRECTORY / "mejoradas"

# Cada captura se evalua por separado. Los parametros son deliberadamente suaves.
ENHANCEMENTS = {
    "foto-02-tftp-recorte-31.jfif": {
        "contrast": 1.12,
        "saturation": 0.90,
        "radius": 1.0,
        "amount": 65,
        "threshold": 3,
    },
    "foto-11-firewall-telnet-origen-22.jfif": {
        "contrast": 1.10,
        "saturation": 0.88,
        "radius": 0.8,
        "amount": 60,
        "threshold": 4,
    },
}


def enhance(source: Path, target: Path, settings: dict[str, float]) -> None:
    image = Image.open(source).convert("RGB")
    image = ImageOps.autocontrast(image, cutoff=0.3)
    image = ImageEnhance.Contrast(image).enhance(settings["contrast"])
    image = ImageEnhance.Color(image).enhance(settings["saturation"])
    image = image.filter(
        ImageFilter.UnsharpMask(
            radius=settings["radius"],
            percent=settings["amount"],
            threshold=settings["threshold"],
        )
    )
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, format="JPEG", quality=96, subsampling=0, optimize=True)
    digest = sha256(target.read_bytes()).hexdigest()
    print(f"{source.name}\t{image.width}x{image.height}\t{target.as_posix()}\t{digest}")


if __name__ == "__main__":
    for filename, settings in ENHANCEMENTS.items():
        source = ASSET_DIRECTORY / filename
        target = OUTPUT_DIRECTORY / f"{source.stem}-mejorada.jpg"
        enhance(source, target, settings)