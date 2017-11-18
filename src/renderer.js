'use strict';

const puppeteer = require('puppeteer');

class Renderer {
  constructor(browser) {
    this.browser = browser;
  }

  async createPage(url, width, height) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    page.setViewport({ width, height })
    return page;
  }

  async screenshot(url, width, height) {
    let page = null;
    try {
      page = await this.createPage(url, width, height);
      const buffer = await page.screenshot({ fullPage: true });
      return buffer;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async close() {
    await this.browser.close()
  }
}

async function create() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  return new Renderer(browser);
}

module.exports = create;
