#!/usr/bin/env python3

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOUNDS_DIR = ROOT / "sounds"

VOICE_CONFIG = {
    "pt": {"voice": "Flo (Português (Brasil))", "rate": "136"},
    "en": {"voice": "Flo (Inglês (EUA))", "rate": "142"},
}

LINES = {
    "pt_vogais_a.mp3": ("pt", "A, de abelha"),
    "pt_vogais_e.mp3": ("pt", "E, de elefante"),
    "pt_vogais_i.mp3": ("pt", "I, de iguana"),
    "pt_vogais_o.mp3": ("pt", "O, de ovelha"),
    "pt_vogais_u.mp3": ("pt", "U, de urso"),
    "en_vogais_a.mp3": ("en", "A, for apple"),
    "en_vogais_e.mp3": ("en", "E, for elephant"),
    "en_vogais_i.mp3": ("en", "I, for iguana"),
    "en_vogais_o.mp3": ("en", "O, for octopus"),
    "en_vogais_u.mp3": ("en", "U, for unicorn"),
    "pt_numeros_1.mp3": ("pt", "Uma maçã"),
    "pt_numeros_2.mp3": ("pt", "Duas bananas"),
    "pt_numeros_3.mp3": ("pt", "Três peixes"),
    "pt_numeros_4.mp3": ("pt", "Quatro estrelas"),
    "pt_numeros_5.mp3": ("pt", "Cinco flores"),
    "pt_numeros_6.mp3": ("pt", "Seis borboletas"),
    "pt_numeros_7.mp3": ("pt", "Sete bolas"),
    "pt_numeros_8.mp3": ("pt", "Oito balões"),
    "pt_numeros_9.mp3": ("pt", "Nove carros"),
    "pt_numeros_10.mp3": ("pt", "Dez doces"),
    "en_numeros_1.mp3": ("en", "One apple"),
    "en_numeros_2.mp3": ("en", "Two bananas"),
    "en_numeros_3.mp3": ("en", "Three fish"),
    "en_numeros_4.mp3": ("en", "Four stars"),
    "en_numeros_5.mp3": ("en", "Five flowers"),
    "en_numeros_6.mp3": ("en", "Six butterflies"),
    "en_numeros_7.mp3": ("en", "Seven balls"),
    "en_numeros_8.mp3": ("en", "Eight balloons"),
    "en_numeros_9.mp3": ("en", "Nine cars"),
    "en_numeros_10.mp3": ("en", "Ten candies"),
    "pt_cores_vermelho.mp3": ("pt", "O coração é vermelho"),
    "pt_cores_verde.mp3": ("pt", "A folha é verde"),
    "pt_cores_azul.mp3": ("pt", "A nuvem é azul"),
    "pt_cores_amarelo.mp3": ("pt", "O sol é amarelo"),
    "pt_cores_roxo.mp3": ("pt", "A uva é roxa"),
    "en_cores_red.mp3": ("en", "The heart is red"),
    "en_cores_green.mp3": ("en", "The leaf is green"),
    "en_cores_blue.mp3": ("en", "The cloud is blue"),
    "en_cores_yellow.mp3": ("en", "The sun is yellow"),
    "en_cores_purple.mp3": ("en", "The grape is purple"),
}


def render_mp3(output_name: str, language: str, text: str) -> None:
    config = VOICE_CONFIG[language]
    out_path = SOUNDS_DIR / output_name

    with tempfile.TemporaryDirectory() as temp_dir:
        aiff_path = Path(temp_dir) / "voice.aiff"
        subprocess.run(
            [
                "say",
                "-v",
                config["voice"],
                "-r",
                config["rate"],
                "-o",
                str(aiff_path),
                text,
            ],
            check=True,
        )
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(aiff_path),
                "-af",
                "loudnorm=I=-16:TP=-1.5:LRA=11",
                "-ar",
                "44100",
                "-ac",
                "1",
                "-b:a",
                "128k",
                str(out_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


if __name__ == "__main__":
    for filename, (language, text) in LINES.items():
        render_mp3(filename, language, text)
