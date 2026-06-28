#!/usr/bin/env node
// Usage:
//   node generate.js configs/the-bible-recap-podcast.json
//   node generate.js configs/*.json          (generate all)

const fs = require('fs');
const path = require('path');

const configPaths = process.argv.slice(2);

if (configPaths.length === 0) {
  console.error('Usage: node generate.js <config.json> [config2.json ...]');
  process.exit(1);
}

const templatePath = path.join(__dirname, '_template.html');
const template = fs.readFileSync(templatePath, 'utf8');

for (const configPath of configPaths) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const services = config.thirdPartyServices
    .map(s => `<li><a href="${s.url}" target="_blank">${s.name}</a></li>`)
    .join('\n    ');

  const html = template
    .replace(/\{\{PAGE_TITLE\}\}/g, config.pageTitle)
    .replace(/\{\{APP_NAME\}\}/g, config.appName)
    .replace(/\{\{DEVELOPER_NAME\}\}/g, config.developerName)
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, config.effectiveDate)
    .replace(/\{\{CONTACT_EMAIL\}\}/g, config.contactEmail)
    .replace(/\{\{THIRD_PARTY_SERVICES\}\}/g, services);

  const outPath = path.join(__dirname, config.outputFile);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Generated: ${config.outputFile}`);
}
