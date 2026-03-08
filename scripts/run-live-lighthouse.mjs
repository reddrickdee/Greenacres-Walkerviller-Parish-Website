import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const baseUrl = (
    process.env.LIGHTHOUSE_BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    'https://www.gwparish.org.au'
).replace(/\/$/, '');

const outputDir = 'output/lighthouse';
const targets = [
    { path: '/', file: 'home.html' },
    { path: '/contact', file: 'contact.html' },
    { path: '/giving', file: 'giving.html' },
];

mkdirSync(outputDir, { recursive: true });

let hasFailure = false;

for (const target of targets) {
    const url = `${baseUrl}${target.path}`;
    const outputPath = `${outputDir}/${target.file}`;

    console.log(`Running Lighthouse for ${url}`);

    const result = spawnSync(
        'npx',
        [
            '--yes',
            'lighthouse',
            url,
            '--quiet',
            '--chrome-flags=--headless=new',
            '--output=html',
            `--output-path=${outputPath}`,
        ],
        { stdio: 'inherit' },
    );

    if (result.status !== 0) {
        hasFailure = true;
        console.error(`Lighthouse failed for ${url}`);
    }
}

if (hasFailure) {
    process.exit(1);
}
