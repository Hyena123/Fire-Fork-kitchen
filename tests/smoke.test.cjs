'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1]).filter(x => x.trim());

test('inline application JavaScript parses', () => {
  assert.ok(scripts.length > 0, 'Expected inline application script');
  scripts.forEach((script) => assert.doesNotThrow(() => new vm.Script(script)));
});

test('core cooking, recovery, privacy, and layout entry points are retained', () => {
  const required = [
    'function parseRecipeLines(', 'function renderCookingSteps(',
    'function renderIngredients(', 'function repairCookSnapshot(',
    'function loadGoogleIndex(', 'function renderRecipeTiming('
  ];
  for (const name of required) assert.ok(html.includes(name), 'Missing: '+name);
  assert.match(html, /privacy\.html/);
  assert.match(html, /https:\/\/accounts\.google\.com\/gsi\/client/);
});

const start = html.indexOf('function timingMinutes(');
const end = html.indexOf('function renderIngredients(', start);
const segment = start >= 0 && end > start ? html.slice(start, end) : '';
const sandbox = { Number, Array, Math, esc: (s) => String(s) };
if (segment) vm.runInNewContext(segment, sandbox);

test('timing parser accepts single minutes and ranges without guessing', () => {
  assert.ok(segment, 'Timing helpers missing');
  assert.equal(sandbox.parseRecipeTime('45'), 45);
  assert.equal(sandbox.parseRecipeTime('0'), 0);
  assert.deepEqual(Array.from(sandbox.parseRecipeTime('45–60')), [45, 60]);
  assert.equal(sandbox.parseRecipeTime('45-60').join(','), '45,60');
  assert.equal(sandbox.parseRecipeTime('unknown'), null);
  assert.equal(sandbox.parseRecipeTime('60-45'), null);
  assert.equal(sandbox.parseRecipeTime('1.5'), null);
});

test('timing display labels missing values and preserves ranges', () => {
  assert.equal(sandbox.formatRecipeMinutes(90), '1 hr 30 min');
  assert.equal(sandbox.formatRecipeMinutes(null), 'Not specified');
  assert.equal(sandbox.formatRecipeMinutes([30,45]), '30–45 min');
  const rendered = sandbox.renderRecipeTiming({timing:{prep:15,cook:[30,45],total:[45,60]}});
  assert.match(rendered, /Prep/);
  assert.match(rendered, /Cook/);
  assert.match(rendered, /45–60 min/);
  assert.doesNotMatch(rendered, /Rest \/ Wait/);
});
