import { chromium, Browser, Page } from 'playwright';
import type { Computer } from '@openai/agents';

type Button = 'left' | 'right' | 'wheel' | 'back' | 'forward';

/**
 * BrowserComputer implements the OpenAI Agents `Computer` interface using
 * Playwright to drive a headless Chromium browser. The model can issue high
 * level actions like clicks or scrolling, which are translated into Playwright
 * operations. Each method returns a base64-encoded screenshot so the model can
 * observe the result of its actions.
 */
export class BrowserComputer implements Computer {
  private browser!: Browser;
  private page!: Page;
  private readonly width = 1024;
  private readonly height = 768;

  /** Launch a headless browser and open a default page. */
  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: [`--window-size=${this.width},${this.height}`]
    });
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: this.width, height: this.height });
    // Start at Bing so the agent can search immediately.
    await this.page.goto('https://www.bing.com/');
    return this;
  }

  get environment() {
    return 'browser' as const;
  }

  get dimensions(): [number, number] {
    return [this.width, this.height];
  }

  private async capture() {
    const buffer = await this.page.screenshot();
    return buffer.toString('base64');
  }

  async screenshot() {
    return this.capture();
  }

  async click(x: number, y: number, button: Button) {
    const map: Record<Button, 'left' | 'right' | 'middle'> = {
      left: 'left',
      right: 'right',
      wheel: 'middle',
      back: 'left',
      forward: 'left'
    };
    await this.page.mouse.click(x, y, { button: map[button] });
  }

  async doubleClick(x: number, y: number) {
    await this.page.mouse.dblclick(x, y);
  }

  async move(x: number, y: number) {
    await this.page.mouse.move(x, y);
  }

  async drag(path: [number, number][]) {
    if (path.length === 0) return;
    const [startX, startY] = path[0];
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    for (const [x, y] of path.slice(1)) {
      await this.page.mouse.move(x, y);
    }
    await this.page.mouse.up();
  }

  async scroll(x: number, y: number, scrollX: number, scrollY: number) {
    await this.page.mouse.move(x, y);
    await this.page.evaluate(({ scrollX, scrollY }) => {
      window.scrollBy(scrollX, scrollY);
    }, { scrollX, scrollY });
  }

  async type(text: string) {
    await this.page.keyboard.type(text);
  }

  async keypress(keys: string[]) {
    for (const key of keys) {
      await this.page.keyboard.press(key);
    }
  }

  async wait(ms = 1000) {
    await this.page.waitForTimeout(ms);
  }

  async dispose() {
    await this.browser.close();
  }
}
