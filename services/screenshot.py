import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import os
import time

def take_screenshot(html_path, screenshot_path):
    os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        page.set_content(html_content, wait_until="networkidle")
        try:
            page.wait_for_selector('.fa-bar-chart', timeout=5000)
            page.click('.fa-bar-chart')
            time.sleep(1)
        except Exception as e:
            print(f"⚠️ Element not found or failed: {e}")

        page.set_viewport_size({"width": 1920, "height": 1080})
        page.screenshot(path=screenshot_path, full_page=True)
        print(f" Screenshot saved: {screenshot_path}")
        browser.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: screenshot.py <html_path> <screenshot_path>")
        sys.exit(1)
    take_screenshot(sys.argv[1], sys.argv[2])