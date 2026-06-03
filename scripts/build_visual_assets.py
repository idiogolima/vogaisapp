#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path
import shutil

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "imgs" / "generated"
GENERATED_ROOT = Path.home() / ".codex" / "generated_images" / "019e8ae8-3805-7803-938b-fd62bb46252a"

SOURCES = {
    "pt_vowels": GENERATED_ROOT / "ig_050b06582b7a047d016a1f78e91a188191be20b62e6dc8c6f6.png",
    "en_vowels": GENERATED_ROOT / "ig_050b06582b7a047d016a1f79107b6081919221117c0a9cd547.png",
    "numbers": GENERATED_ROOT / "ig_050b06582b7a047d016a1f7935fa1c819199a46f51e04545a2.png",
    "colors": GENERATED_ROOT / "ig_050b06582b7a047d016a1f79677b048191b8d38d9008684a9c.png",
    "numbers_7": GENERATED_ROOT / "ig_050b06582b7a047d016a1f79aaeecc81919e85411f89a7f4f0.png",
    "numbers_10": GENERATED_ROOT / "ig_050b06582b7a047d016a1f7a00249c8191b5d9f358bce0983d.png",
}


def detect_non_white_regions(image_path: Path, threshold: int = 245) -> list[tuple[int, int, int, int]]:
    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    visited = [[False] * width for _ in range(height)]
    regions: list[tuple[int, int, int, int]] = []

    def is_foreground(x: int, y: int) -> bool:
        r, g, b = pixels[x, y]
        return r < threshold or g < threshold or b < threshold

    for y in range(height):
        for x in range(width):
            if visited[y][x] or not is_foreground(x, y):
                visited[y][x] = True
                continue

            stack = [(x, y)]
            visited[y][x] = True
            min_x = max_x = x
            min_y = max_y = y

            while stack:
                cx, cy = stack.pop()
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and not visited[ny][nx]:
                        visited[ny][nx] = True
                        if is_foreground(nx, ny):
                            stack.append((nx, ny))

            if (max_x - min_x) > 120 and (max_y - min_y) > 120:
                regions.append((min_x, min_y, max_x + 1, max_y + 1))

    regions.sort(key=lambda box: (box[1], box[0]))
    return regions


def save_crop(source: Path, box: tuple[int, int, int, int], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(source).convert("RGB")
    cropped = image.crop(box).resize((768, 768), Image.Resampling.LANCZOS)
    cropped.save(output, "PNG")


def build_sheet_assets() -> None:
    pt_regions = detect_non_white_regions(SOURCES["pt_vowels"])
    en_regions = detect_non_white_regions(SOURCES["en_vowels"])
    number_regions = detect_non_white_regions(SOURCES["numbers"])
    color_regions = detect_non_white_regions(SOURCES["colors"])

    pt_outputs = [
        "pt_vogais_a.png",
        "pt_vogais_e.png",
        "pt_vogais_i.png",
        "pt_vogais_o.png",
        "pt_vogais_u.png",
    ]
    en_outputs = [
        "en_vogais_a.png",
        "en_vogais_e.png",
        "en_vogais_i.png",
        "en_vogais_o.png",
        "en_vogais_u.png",
    ]
    number_outputs = [
        "shared_numeros_1.png",
        "shared_numeros_2.png",
        "shared_numeros_3.png",
        "shared_numeros_4.png",
        "shared_numeros_5.png",
        "shared_numeros_6.png",
        "shared_numeros_8.png",
        "shared_numeros_9.png",
    ]
    color_outputs = [
        "shared_cores_red.png",
        "shared_cores_green.png",
        "shared_cores_blue.png",
        "shared_cores_yellow.png",
        "shared_cores_purple.png",
    ]

    if len(pt_regions) != 5 or len(en_regions) != 5 or len(color_regions) != 5 or len(number_regions) != 10:
        raise RuntimeError("Unexpected panel detection count while cropping generated sprite sheets.")

    for box, name in zip(pt_regions, pt_outputs):
        save_crop(SOURCES["pt_vowels"], box, OUT_DIR / name)
    for box, name in zip(en_regions, en_outputs):
        save_crop(SOURCES["en_vowels"], box, OUT_DIR / name)
    for box, name in zip(number_regions[:6] + number_regions[7:9], number_outputs):
        save_crop(SOURCES["numbers"], box, OUT_DIR / name)
    for box, name in zip(color_regions, color_outputs):
        save_crop(SOURCES["colors"], box, OUT_DIR / name)

    shutil.copy2(SOURCES["numbers_7"], OUT_DIR / "shared_numeros_7.png")
    shutil.copy2(SOURCES["numbers_10"], OUT_DIR / "shared_numeros_10.png")


if __name__ == "__main__":
    build_sheet_assets()
