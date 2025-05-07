#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api');

// расширения файлов для обработки
const exts = ['.js', '.jsx', '.ts', '.tsx'];
// директории для игнорирования
const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build']);

// функция для перевода комментариев в одном файле
async function translateCommentsInFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let modified = code;

  // перевод однострочных комментариев
  for (const match of modified.matchAll(/\/\/(.*)/g)) {
    const original = match[0];
    const text = match[1].trim();
    if (!text) continue;
    const res = await translate(text, { to: 'ru' });
    const translated = res.text.toLowerCase();
    modified = modified.replace(original, `// ${translated}`);
  }

  // перевод блочных комментариев
  for (const match of modified.matchAll(/\/\*([\s\S]*?)\*\//g)) {
    const original = match[0];
    const text = match[1].trim();
    if (!text) continue;
    const res = await translate(text, { to: 'ru' });
    const translated = res.text.toLowerCase();
    modified = modified.replace(original, `/* ${translated} */`);
  }

  if (modified !== code) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log(`обновлены комментарии в ${filePath}`);
  }
}

// рекурсивный обход файловой системы
async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (exts.includes(path.extname(entry.name))) {
      await translateCommentsInFile(fullPath);
    }
  }
}

// запуск скрипта
(async () => {
  const root = process.cwd();
  console.log('начинаем перевод комментариев...');
  await walk(root);
  console.log('перевод комментариев завершён');
})(); 