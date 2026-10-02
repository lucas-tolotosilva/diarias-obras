"""Automação Playwright para gerar as capturas de tela em /screenshots.

Pré-requisito: `npm run dev -- --port 5174` rodando.
"""

import time
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5174"
SCREENSHOTS_DIR = Path(__file__).parent.parent / "screenshots"

DESKTOP = {"width": 1440, "height": 900}
MOBILE = {"width": 390, "height": 844}


def esperar(segundos=1.0):
    time.sleep(segundos)


def screenshot_pagina_inteira(page, caminho):
    """Full-page screenshot sem o artefato de duplicação da nav fixa no rodapé."""
    page.add_style_tag(content=".nav-inferior { position: static !important; }")
    esperar(0.3)
    page.screenshot(path=str(caminho), full_page=True)


def run():
    SCREENSHOTS_DIR.mkdir(exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()

        # ---------- MOBILE ----------
        context = browser.new_context(viewport=MOBILE, device_scale_factor=2, is_mobile=True)
        page = context.new_page()
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        esperar(1)

        # Mostrar um dia já marcado (dentro do período semeado) para ilustrar os estados coloridos
        page.locator('input[type="date"]').fill("2026-09-15")
        esperar(0.6)
        page.screenshot(path=str(SCREENSHOTS_DIR / "01_marcacao_mobile.png"))
        print("01 ok")

        page.goto(f"{BASE_URL}/vales")
        page.wait_for_load_state("networkidle")
        esperar(1)
        screenshot_pagina_inteira(page, SCREENSHOTS_DIR / "02_vales_mobile.png")
        print("02 ok")

        page.goto(f"{BASE_URL}/fechamento")
        page.wait_for_load_state("networkidle")
        esperar(1.2)
        screenshot_pagina_inteira(page, SCREENSHOTS_DIR / "03_fechamento_mobile.png")
        print("03 ok")

        context.close()

        # ---------- DESKTOP ----------
        context_d = browser.new_context(viewport=DESKTOP, device_scale_factor=2)
        page_d = context_d.new_page()

        page_d.goto(BASE_URL)
        page_d.wait_for_load_state("networkidle")
        esperar(1)
        page_d.locator('input[type="date"]').fill("2026-09-15")
        esperar(0.6)
        page_d.screenshot(path=str(SCREENSHOTS_DIR / "04_marcacao_desktop.png"))
        print("04 ok")

        page_d.goto(f"{BASE_URL}/fechamento")
        page_d.wait_for_load_state("networkidle")
        esperar(1.2)
        page_d.screenshot(path=str(SCREENSHOTS_DIR / "05_fechamento_desktop.png"))
        print("05 ok")

        page_d.goto(f"{BASE_URL}/cadastros")
        page_d.wait_for_load_state("networkidle")
        esperar(0.8)
        page_d.get_by_role("button", name="Ajudantes").click()
        esperar(0.8)
        page_d.screenshot(path=str(SCREENSHOTS_DIR / "06_cadastros_desktop.png"))
        print("06 ok")

        context_d.close()
        browser.close()


if __name__ == "__main__":
    run()
