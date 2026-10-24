#!/usr/bin/env node

import assert from 'node:assert/strict';

import {
  compareBaseline,
  gradeResponse,
  loadCases,
  parseUsage,
  parseArguments,
  questionSegments,
  selectCases
} from '../run-trust-evals.mjs';

const sampleCase = {
  id: 'T999',
  assertions: [
    {
      id: 'asks-polling',
      kind: 'required_question',
      description: 'asks about polling',
      patterns: ['poll(?:ing)?']
    },
    {
      id: 'uses-smart-list',
      kind: 'required',
      description: 'mentions SmartList',
      patterns: ['SmartList']
    },
    {
      id: 'avoids-custom-timer',
      kind: 'forbidden',
      description: 'does not select a custom timer',
      patterns: ['I will use setInterval']
    }
  ]
};

const passingResponse = [
  'I would use the shared SmartList.',
  'Would you like scheduled polling for this list?'
].join('\n');
const passingGrade = gradeResponse(sampleCase, passingResponse);
assert.equal(passingGrade.passed, true);
assert.equal(passingGrade.score, 1);
assert.equal(passingGrade.assertions.length, 3);

const nonQuestionGrade = gradeResponse(
  sampleCase,
  'I would use the shared SmartList. Scheduled polling will be enabled.'
);
assert.equal(nonQuestionGrade.passed, false);
assert.equal(
  nonQuestionGrade.assertions.find(assertion => assertion.id === 'asks-polling')?.passed,
  false
);

const explicitChoiceGrade = gradeResponse(
  sampleCase,
  [
    'I would use the shared SmartList.',
    'Please choose either:',
    '- scheduled polling with visible progress; or',
    '- a static list with manual refresh.'
  ].join('\n')
);
assert.equal(explicitChoiceGrade.passed, true);

const forbiddenGrade = gradeResponse(
  sampleCase,
  'I would use the shared SmartList. Would you like polling? I will use setInterval.'
);
assert.equal(forbiddenGrade.passed, false);
assert.equal(
  forbiddenGrade.assertions.find(assertion => assertion.id === 'avoids-custom-timer')?.passed,
  false
);

assert.equal(questionSegments('First? Second question?').length, 2);

const parsed = parseArguments([
  '--model',
  'candidate-model',
  '--case',
  'T001',
  '--repeat',
  '3',
  '--dry-run'
]);
assert.equal(parsed.model, 'candidate-model');
assert.equal(parsed.repeat, 3);
assert.deepEqual(parsed.caseIds, ['T001']);
assert.equal(parsed.dryRun, true);

assert.deepEqual(
  parseUsage([
    JSON.stringify({ type: 'thread.started' }),
    'malformed event kept in raw artifacts',
    JSON.stringify({
      type: 'turn.completed',
      usage: {
        input_tokens: 100,
        cached_input_tokens: 50,
        output_tokens: 40
      }
    })
  ].join('\n')),
  {
    input_tokens: 100,
    cached_input_tokens: 50,
    output_tokens: 40
  }
);

const cases = await loadCases();
assert.equal(cases.length, 7);
assert.deepEqual(selectCases(cases, ['T003']).map(definition => definition.id), ['T003']);
assert.throws(() => selectCases(cases, ['T404']), /unknown case/u);

const baselineComparison = compareBaseline(
  [
    { id: 'T001', passed: false },
    { id: 'T002', passed: true },
    { id: 'T003', passed: true }
  ],
  {
    path: 'tools/trust/suite/baselines/example.report.json',
    report: {
      cases: [
        { id: 'T001', passed: true },
        { id: 'T002', passed: false }
      ]
    }
  }
);
assert.deepEqual(baselineComparison.regressions, ['T001']);
assert.deepEqual(baselineComparison.improvements, ['T002']);
assert.deepEqual(baselineComparison.missingFromBaseline, ['T003']);
assert.equal(baselineComparison.compatible, true);

const incompatibleComparison = compareBaseline(
  [{ id: 'T001', passed: true, definitionFingerprint: 'current-case' }],
  {
    path: 'tools/trust/suite/baselines/example.report.json',
    report: {
      repository: {
        commit: 'old-commit',
        dirty: false,
        comparableDirty: false,
        inputFingerprint: 'old-repository'
      },
      repeat: 1,
      trustFingerprint: 'old-trust',
      evalHarnessFingerprint: 'same-harness',
      cases: [
        { id: 'T001', passed: true, definitionFingerprint: 'old-case' }
      ]
    }
  },
  {
    repository: {
      commit: 'new-commit',
      dirty: false,
      comparableDirty: false,
      inputFingerprint: 'new-repository'
    },
    repeat: 1,
    trustFingerprint: 'new-trust',
    evalHarnessFingerprint: 'same-harness'
  }
);
assert.equal(incompatibleComparison.compatible, false);
assert.deepEqual(incompatibleComparison.compatibilityIssues, [
  'repository input fingerprint differs',
  'trust input fingerprint differs',
  'T001 case definition differs'
]);
assert.deepEqual(incompatibleComparison.warnings, ['repository commit differs']);

process.stdout.write(`Trust eval runner self-test passed (${cases.length} cases).\n`);
