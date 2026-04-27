const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: 'https://flik.co.id/', filename: '01-flik-homepage.pdf' },
  { url: 'https://flik.co.id/en/fast-checkout', filename: '02-fast-checkout.pdf' },
  { url: 'https://flik.co.id/checkout-invoice', filename: '03-checkout-invoice.pdf' },
  { url: 'https://flik.co.id/en/smart-qris', filename: '04-smart-qris.pdf' },
  { url: 'https://flik.co.id/en/pengiriman-kilat', filename: '05-pengiriman-kilat.pdf' },
  { url: 'https://flik.co.id/en/order-form', filename: '06-order-form.pdf' },
  { url: 'https://flik.co.id/en/power-buy', filename: '07-power-buy.pdf' },
  { url: 'https://flik.co.id/en/promo', filename: '08-promo.pdf' },
  { url: 'https://flik.co.id/en/blog', filename: '09-blog.pdf' }
];

// Create output directory
const outputDir = path.join(__dirname, 'flik-pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  const browser = await puppeteer.launch();
  
  for (const page of pages) {
    try {
      console.log(`Capturing: ${page.filename}...`);
      const browserPage = await browser.newPage();
      await browserPage.goto(page.url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      const filePath = path.join(outputDir, page.filename);
      await browserPage.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      console.log(`✓ Saved: ${page.filename}`);
      await browserPage.close();
    } catch (error) {
      console.error(`✗ Error capturing ${page.filename}:`, error.message);
    }
  }
  
  await browser.close();
  console.log(`\nAll PDFs saved to: ${outputDir}`);
})();
