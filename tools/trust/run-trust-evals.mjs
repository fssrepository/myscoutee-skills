#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  access,
  mkdir,
  readFile,
  readdir,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const libraryRoot = path.resolve(scriptDirectory, '../..');
// Run from the application checkout; shared instructions and cases stay here.
const repositoryRoot = process.cwd();
const evalRoot = path.join(scriptDirectory, 'suite');
const casesDirectory = path.join(evalRoot, 'cases');
const defaultArtifactRoot = path.join(repositoryRoot, '.e2e-artifacts/trust-evals');
const allowedCaseKeys = new Set([
  '$schema',
  'schemaVersion',
  'id',
  'title',
  'tags',
  'prompt',
  'assertions',
  'reviewQuestions'
]);
const allowedAssertionKeys = new Set(['id', 'kind', 'description', 'patterns']);
const allowedAssertionKinds = new Set(['required', 'required_question', 'forbidden']);

function usage() {
  process.stdout.write(`Usage:
  node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --validate
  node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --list
  node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --model <model> [options]

Options:
  --model <model>       Explicit Codex model for a live/dry run.
  --case <Tnnn>         Select one case; repeat the flag for more cases.
  --repeat <n>          Runs per case (default: 1, maximum: 10).
  --baseline <file>     Compare with an accepted report JSON.
  --codex <path>        Codex executable (default: codex from PATH).
  --timeout-ms <n>      Per-run timeout (default: 600000).
  --dry-run             Print selected cases and commands without model calls.
  --validate            Validate all case files without model calls.
  --list                List all cases without model calls.
  --help                Show this help.
`);
}

function requiredValue(argumentsList, index, optionName) {
  const value = argumentsList[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${optionName} requires a value`);
  }
  return value;
}

function parseArguments(argumentsList) {
  const options = {
    baseline: null,
    caseIds: [],
    codex: 'codex',
    dryRun: false,
    help: false,
    list: false,
    model: null,
    repeat: 1,
    timeoutMs: 600_000,
    validate: false
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    switch (argument) {
      case '--baseline':
        options.baseline = requiredValue(argumentsList, index, argument);
        index += 1;
        break;
      case '--case':
        options.caseIds.push(requiredValue(argumentsList, index, argument));
        index += 1;
        break;
      case '--codex':
        options.codex = requiredValue(argumentsList, index, argument);
        index += 1;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--list':
        options.list = true;
        break;
      case '--model':
        options.model = requiredValue(argumentsList, index, argument);
        index += 1;
        break;
      case '--repeat':
        options.repeat = Number(requiredValue(argumentsList, index, argument));
        index += 1;
        break;
      case '--timeout-ms':
        options.timeoutMs = Number(requiredValue(argumentsList, index, argument));
        index += 1;
        break;
      case '--validate':
        options.validate = true;
        break;
      default:
        throw new Error(`unknown argument: ${argument}`);
    }
  }

  if (!Number.isInteger(options.repeat) || options.repeat < 1 || options.repeat > 10) {
    throw new Error('--repeat must be an integer between 1 and 10');
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1_000) {
    throw new Error('--timeout-ms must be an integer of at least 1000');
  }
  const controlActions = [options.help, options.list, options.validate].filter(Boolean).length;
  if (controlActions > 1) {
    throw new Error('--help, --list, and --validate are mutually exclusive');
  }
  if (!options.help && !options.list && !options.validate && !options.model) {
    throw new Error('--model is required for live and dry runs');
  }
  if (options.baseline && (options.help || options.list || options.validate || options.dryRun)) {
    throw new Error('--baseline is supported only for a live run');
  }
  return options;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function sha256(parts) {
  const hash = createHash('sha256');
  for (const part of parts) {
    hash.update(part);
    hash.update('\0');
  }
  return hash.digest('hex');
}

function unexpectedKeys(value, allowedKeys) {
  return Object.keys(value).filter(key => !allowedKeys.has(key));
}

function validateCase(caseDefinition, fileName) {
  const errors = [];
  if (!caseDefinition || typeof caseDefinition !== 'object' || Array.isArray(caseDefinition)) {
    return [`${fileName}: root must be an object`];
  }
  const extraCaseKeys = unexpectedKeys(caseDefinition, allowedCaseKeys);
  if (extraCaseKeys.length > 0) {
    errors.push(`${fileName}: unexpected keys: ${extraCaseKeys.join(', ')}`);
  }
  if (caseDefinition.schemaVersion !== 1) {
    errors.push(`${fileName}: schemaVersion must be 1`);
  }
  if (caseDefinition.$schema !== '../case.schema.json') {
    errors.push(`${fileName}: $schema must be ../case.schema.json`);
  }
  if (typeof caseDefinition.id !== 'string' || !/^T\d{3}$/.test(caseDefinition.id)) {
    errors.push(`${fileName}: id must match Tnnn`);
  } else if (!fileName.startsWith(`${caseDefinition.id}-`)) {
    errors.push(`${fileName}: filename must start with ${caseDefinition.id}-`);
  }
  if (!isNonEmptyString(caseDefinition.title)) {
    errors.push(`${fileName}: title must be a non-empty string`);
  }
  if (!isNonEmptyString(caseDefinition.prompt) || caseDefinition.prompt.trim().length < 20) {
    errors.push(`${fileName}: prompt must contain at least 20 characters`);
  }
  if (!Array.isArray(caseDefinition.tags) || caseDefinition.tags.length === 0) {
    errors.push(`${fileName}: tags must be a non-empty array`);
  } else {
    const uniqueTags = new Set();
    for (const tag of caseDefinition.tags) {
      if (typeof tag !== 'string' || !/^[a-z0-9-]+$/.test(tag)) {
        errors.push(`${fileName}: invalid tag ${JSON.stringify(tag)}`);
      }
      if (uniqueTags.has(tag)) {
        errors.push(`${fileName}: duplicate tag ${tag}`);
      }
      uniqueTags.add(tag);
    }
  }
  if (!Array.isArray(caseDefinition.assertions) || caseDefinition.assertions.length === 0) {
    errors.push(`${fileName}: assertions must be a non-empty array`);
  } else {
    const assertionIds = new Set();
    for (const [assertionIndex, assertion] of caseDefinition.assertions.entries()) {
      const prefix = `${fileName}: assertion ${assertionIndex + 1}`;
      if (!assertion || typeof assertion !== 'object' || Array.isArray(assertion)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      const extraAssertionKeys = unexpectedKeys(assertion, allowedAssertionKeys);
      if (extraAssertionKeys.length > 0) {
        errors.push(`${prefix} has unexpected keys: ${extraAssertionKeys.join(', ')}`);
      }
      if (typeof assertion.id !== 'string' || !/^[a-z0-9-]+$/.test(assertion.id)) {
        errors.push(`${prefix} id must use lowercase letters, digits, and hyphens`);
      } else if (assertionIds.has(assertion.id)) {
        errors.push(`${prefix} duplicates assertion id ${assertion.id}`);
      } else {
        assertionIds.add(assertion.id);
      }
      if (!allowedAssertionKinds.has(assertion.kind)) {
        errors.push(`${prefix} has invalid kind ${JSON.stringify(assertion.kind)}`);
      }
      if (!isNonEmptyString(assertion.description)) {
        errors.push(`${prefix} description must be a non-empty string`);
      }
      if (!Array.isArray(assertion.patterns) || assertion.patterns.length === 0) {
        errors.push(`${prefix} patterns must be a non-empty array`);
      } else {
        for (const pattern of assertion.patterns) {
          if (!isNonEmptyString(pattern)) {
            errors.push(`${prefix} contains an empty pattern`);
            continue;
          }
          try {
            new RegExp(pattern, 'iu');
          } catch (error) {
            errors.push(`${prefix} has invalid regex ${JSON.stringify(pattern)}: ${error.message}`);
          }
        }
      }
    }
  }
  if (!Array.isArray(caseDefinition.reviewQuestions) || caseDefinition.reviewQuestions.length === 0) {
    errors.push(`${fileName}: reviewQuestions must be a non-empty array`);
  } else if (caseDefinition.reviewQuestions.some(question => !isNonEmptyString(question))) {
    errors.push(`${fileName}: every review question must be a non-empty string`);
  }
  return errors;
}

async function loadCases() {
  const fileNames = (await readdir(casesDirectory))
    .filter(fileName => fileName.endsWith('.json'))
    .sort();
  if (fileNames.length === 0) {
    throw new Error(`no trust eval cases found in ${casesDirectory}`);
  }
  const definitions = [];
  const errors = [];
  const ids = new Set();
  for (const fileName of fileNames) {
    const filePath = path.join(casesDirectory, fileName);
    let definition;
    let rawDefinition;
    try {
      rawDefinition = await readFile(filePath, 'utf8');
      definition = JSON.parse(rawDefinition);
    } catch (error) {
      errors.push(`${fileName}: invalid JSON: ${error.message}`);
      continue;
    }
    errors.push(...validateCase(definition, fileName));
    if (isNonEmptyString(definition.id)) {
      if (ids.has(definition.id)) {
        errors.push(`${fileName}: duplicate case id ${definition.id}`);
      }
      ids.add(definition.id);
    }
    definitions.push({
      ...definition,
      fileName,
      definitionFingerprint: sha256([fileName, rawDefinition])
    });
  }
  if (errors.length > 0) {
    throw new Error(`trust eval validation failed:\n- ${errors.join('\n- ')}`);
  }
  return definitions;
}

function selectCases(allCases, selectedIds) {
  if (selectedIds.length === 0) {
    return allCases;
  }
  const requestedIds = new Set(selectedIds);
  const knownIds = new Set(allCases.map(definition => definition.id));
  const unknownIds = [...requestedIds].filter(id => !knownIds.has(id));
  if (unknownIds.length > 0) {
    throw new Error(`unknown case id(s): ${unknownIds.join(', ')}`);
  }
  return allCases.filter(definition => requestedIds.has(definition.id));
}

function buildPrompt(caseDefinition) {
  return [
    'Use trust standard for this repository.',
    'This is a read-only planning turn. Do not modify files, start or restart processes, or run tests.',
    'Respond as you normally would before implementation. Ask any question required by repository guidance.',
    'Do not mention evaluations, assertions, graders, or hidden expected answers.',
    '',
    'User request:',
    caseDefinition.prompt
  ].join('\n');
}

function questionSegments(response) {
  const segments = [];
  let segmentStart = 0;
  for (let index = 0; index < response.length; index += 1) {
    if (response[index] !== '?') {
      continue;
    }
    segments.push(response.slice(Math.max(segmentStart, index - 800), index + 1));
    segmentStart = index + 1;
  }
  const explicitChoice = /\b(?:(?:please|also)\s+)?(?:choose|select|pick|tell me|let me know)\b/giu;
  for (const match of response.matchAll(explicitChoice)) {
    const blockEnd = response.indexOf('\n\n', match.index);
    segments.push(response.slice(
      Math.max(0, match.index - 120),
      Math.min(
        response.length,
        match.index + 800,
        blockEnd === -1 ? response.length : blockEnd
      )
    ));
  }
  return segments;
}

function gradeResponse(caseDefinition, response) {
  const questions = questionSegments(response);
  const assertions = caseDefinition.assertions.map(assertion => {
    const compiledPatterns = assertion.patterns.map(pattern => new RegExp(pattern, 'iu'));
    let matchedPattern = null;
    let passed;
    if (assertion.kind === 'required') {
      matchedPattern = assertion.patterns.find((pattern, index) => compiledPatterns[index].test(response)) ?? null;
      passed = matchedPattern !== null;
    } else if (assertion.kind === 'required_question') {
      for (let patternIndex = 0; patternIndex < compiledPatterns.length && matchedPattern === null; patternIndex += 1) {
        if (questions.some(question => compiledPatterns[patternIndex].test(question))) {
          matchedPattern = assertion.patterns[patternIndex];
        }
      }
      passed = matchedPattern !== null;
    } else {
      matchedPattern = assertion.patterns.find((pattern, index) => compiledPatterns[index].test(response)) ?? null;
      passed = matchedPattern === null;
    }
    return {
      id: assertion.id,
      kind: assertion.kind,
      description: assertion.description,
      passed,
      matchedPattern
    };
  });
  const passedCount = assertions.filter(assertion => assertion.passed).length;
  return {
    passed: passedCount === assertions.length,
    score: assertions.length === 0 ? 0 : passedCount / assertions.length,
    assertions
  };
}

function spawnCapture(executable, argumentsList, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, argumentsList, {
      cwd: options.cwd ?? repositoryRoot,
      env: options.env ?? process.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    let timedOut = false;
    let killTimer = null;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), 5_000);
    }, options.timeoutMs ?? 600_000);
    child.stdout.on('data', chunk => stdoutChunks.push(chunk));
    child.stderr.on('data', chunk => stderrChunks.push(chunk));
    child.on('error', error => {
      clearTimeout(timeout);
      if (killTimer) {
        clearTimeout(killTimer);
      }
      reject(error);
    });
    child.on('close', (exitCode, signal) => {
      clearTimeout(timeout);
      if (killTimer) {
        clearTimeout(killTimer);
      }
      resolve({
        exitCode,
        signal,
        timedOut,
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8')
      });
    });
  });
}

function parseUsage(eventsJsonl) {
  let usage = null;
  for (const line of eventsJsonl.split(/\r?\n/u)) {
    if (!line.trim()) {
      continue;
    }
    try {
      const event = JSON.parse(line);
      if (event.type === 'turn.completed' && event.usage) {
        usage = event.usage;
      }
    } catch {
      // Preserve malformed/raw events in the artifact and leave usage unknown.
    }
  }
  return usage;
}

function safePathSegment(value) {
  const normalized = `${value}`.trim().replace(/[^a-zA-Z0-9._-]+/gu, '-');
  return normalized.replace(/^-+|-+$/gu, '') || 'model';
}

async function listFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFilesRecursively(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

async function fingerprintFiles(filePaths) {
  const parts = [];
  for (const filePath of [...filePaths].sort()) {
    parts.push(relativeArtifactPath(filePath));
    parts.push(await readFile(filePath));
  }
  return sha256(parts);
}

async function inputFingerprints() {
  const trustFiles = [
    path.join(repositoryRoot, 'AGENTS.md'),
    path.join(libraryRoot, 'instructions/projects/myscoutee-backend.md'),
    path.join(libraryRoot, 'instructions/myscoutee-development.md'),
    path.join(libraryRoot, 'instructions/manual-qa.md'),
    ...await listFilesRecursively(path.join(libraryRoot, '.agents/trust'))
  ];
  const harnessFiles = [
    path.join(evalRoot, 'case.schema.json'),
    fileURLToPath(import.meta.url)
  ];
  return {
    trust: await fingerprintFiles(trustFiles),
    harness: await fingerprintFiles(harnessFiles)
  };
}

function runTimestamp() {
  return new Date().toISOString().replace(/[-:]/gu, '').replace(/\.\d{3}Z$/u, 'Z');
}

function relativeArtifactPath(filePath) {
  return path.relative(repositoryRoot, filePath).split(path.sep).join('/');
}

async function assertPathAbsent(targetPath) {
  try {
    await access(targetPath);
    throw new Error(`refusing to overwrite existing eval output: ${targetPath}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function readBaseline(filePath) {
  const absolutePath = path.resolve(repositoryRoot, filePath);
  const baseline = JSON.parse(await readFile(absolutePath, 'utf8'));
  if (!baseline || typeof baseline !== 'object' || !Array.isArray(baseline.cases)) {
    throw new Error(`invalid baseline report: ${filePath}`);
  }
  return {
    path: relativeArtifactPath(absolutePath),
    report: baseline
  };
}

function compareBaseline(currentCases, baselineData, context = null) {
  if (!baselineData) {
    return null;
  }
  const baselineById = new Map(baselineData.report.cases.map(result => [result.id, result]));
  const regressions = [];
  const improvements = [];
  const missingFromBaseline = [];
  const compatibilityIssues = [];
  const warnings = [];
  const baselineReport = baselineData.report;
  if (context) {
    if (baselineReport.repository?.commit !== context.repository.commit) {
      warnings.push('repository commit differs');
    }
    if (
      baselineReport.repository?.inputFingerprint !== context.repository.inputFingerprint
    ) {
      compatibilityIssues.push('repository input fingerprint differs');
    }
    if (
      baselineReport.repository?.comparableDirty === true
      || context.repository.comparableDirty === true
    ) {
      compatibilityIssues.push('baseline comparison has non-baseline worktree changes');
    }
    if (baselineReport.repeat !== context.repeat) {
      compatibilityIssues.push('repeat count differs');
    }
    if (baselineReport.trustFingerprint !== context.trustFingerprint) {
      compatibilityIssues.push('trust input fingerprint differs');
    }
    if (baselineReport.evalHarnessFingerprint !== context.evalHarnessFingerprint) {
      compatibilityIssues.push('eval harness fingerprint differs');
    }
  }
  for (const current of currentCases) {
    const baseline = baselineById.get(current.id);
    if (!baseline) {
      missingFromBaseline.push(current.id);
      continue;
    }
    if (context && baseline.definitionFingerprint !== current.definitionFingerprint) {
      compatibilityIssues.push(`${current.id} case definition differs`);
    }
    if (baseline.passed === true && current.passed !== true) {
      regressions.push(current.id);
    } else if (baseline.passed !== true && current.passed === true) {
      improvements.push(current.id);
    }
  }
  return {
    baselinePath: baselineData.path,
    compatible: compatibilityIssues.length === 0,
    compatibilityIssues,
    warnings,
    regressions,
    improvements,
    missingFromBaseline
  };
}

function renderMarkdownReport(report) {
  const lines = [
    '# Trust eval report',
    '',
    `- Model: \`${report.model}\``,
    `- Codex CLI: \`${report.codexVersion}\``,
    `- Repository commit: \`${report.repository.commit}\``,
    `- Repository dirty: \`${report.repository.dirty}\``,
    `- Repeat count: \`${report.repeat}\``,
    `- Result: **${report.passed ? 'PASS' : 'FAIL'}**`,
    '',
    '| Case | Runs passed | Score | Result |',
    '| --- | ---: | ---: | --- |'
  ];
  for (const caseResult of report.cases) {
    lines.push(`| ${caseResult.id} — ${caseResult.title} | ${caseResult.passedRuns}/${caseResult.runs.length} | ${(caseResult.score * 100).toFixed(1)}% | ${caseResult.passed ? 'PASS' : 'FAIL'} |`);
  }
  if (report.baseline) {
    lines.push(
      '',
      '## Baseline comparison',
      '',
      `- Baseline: \`${report.baseline.baselinePath}\``,
      `- Compatible inputs: ${report.baseline.compatible ? 'yes' : 'no'}`,
      `- Compatibility issues: ${report.baseline.compatibilityIssues.join('; ') || 'none'}`,
      `- Warnings: ${report.baseline.warnings.join('; ') || 'none'}`,
      `- Regressions: ${report.baseline.regressions.join(', ') || 'none'}`,
      `- Improvements: ${report.baseline.improvements.join(', ') || 'none'}`,
      `- Missing from baseline: ${report.baseline.missingFromBaseline.join(', ') || 'none'}`
    );
  }
  const failures = [];
  for (const caseResult of report.cases) {
    for (const run of caseResult.runs) {
      const failedAssertions = run.assertions.filter(assertion => !assertion.passed);
      if (run.executionError || failedAssertions.length > 0) {
        failures.push({ caseResult, run, failedAssertions });
      }
    }
  }
  if (failures.length > 0) {
    lines.push('', '## Failures', '');
    for (const failure of failures) {
      lines.push(`### ${failure.caseResult.id}, run ${failure.run.run}`);
      if (failure.run.executionError) {
        lines.push('', `Execution: ${failure.run.executionError}`);
      }
      for (const assertion of failure.failedAssertions) {
        lines.push('', `- \`${assertion.id}\`: ${assertion.description}`);
      }
      lines.push('', `Response: \`${failure.run.responsePath}\``);
    }
  }
  lines.push('', '## Human review questions', '');
  for (const caseResult of report.cases) {
    lines.push(`### ${caseResult.id}`);
    for (const question of caseResult.reviewQuestions) {
      lines.push(`- ${question}`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

async function repositoryMetadata(timeoutMs) {
  const [commitResult, statusResult, indexResult] = await Promise.all([
    spawnCapture('git', ['rev-parse', 'HEAD'], { timeoutMs }),
    spawnCapture('git', ['status', '--short', '--untracked-files=all'], { timeoutMs }),
    spawnCapture('git', [
      'ls-files',
      '--stage',
      '--',
      '.',
      ':(exclude)tools/trust/suite/baselines/*.report.json'
    ], { timeoutMs })
  ]);
  const statusLines = statusResult.exitCode === 0
    ? statusResult.stdout.split(/\r?\n/u).filter(Boolean)
    : [];
  const nonBaselineStatusLines = statusLines.filter(line => {
    const changedPath = line.slice(3);
    return !(
      changedPath.startsWith('tools/trust/suite/baselines/')
      && changedPath.endsWith('.report.json')
    );
  });
  return {
    commit: commitResult.exitCode === 0 ? commitResult.stdout.trim() : 'unknown',
    dirty: statusResult.exitCode !== 0 ? null : statusLines.length > 0,
    comparableDirty: statusResult.exitCode !== 0 ? null : nonBaselineStatusLines.length > 0,
    inputFingerprint: indexResult.exitCode === 0
      ? sha256([indexResult.stdout])
      : null
  };
}

async function codexVersion(codexExecutable, timeoutMs) {
  const result = await spawnCapture(codexExecutable, ['--version'], { timeoutMs });
  if (result.exitCode !== 0) {
    throw new Error(`failed to execute ${codexExecutable} --version: ${result.stderr.trim()}`);
  }
  return result.stdout.trim() || result.stderr.trim();
}

function dryRunCommand(options, caseDefinition) {
  return [
    options.codex,
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--sandbox',
    'read-only',
    '--json',
    '--color',
    'never',
    '--model',
    options.model,
    '--cd',
    repositoryRoot,
    '--output-last-message',
    `<artifact>/${caseDefinition.id}/response.md`,
    '<case-prompt>'
  ];
}

async function executeCaseRun(options, caseDefinition, runNumber, runDirectory) {
  await mkdir(runDirectory, { recursive: true });
  const responsePath = path.join(runDirectory, 'response.md');
  const eventsPath = path.join(runDirectory, 'events.jsonl');
  const stderrPath = path.join(runDirectory, 'stderr.log');
  const promptPath = path.join(runDirectory, 'prompt.txt');
  const resultPath = path.join(runDirectory, 'result.json');
  const prompt = buildPrompt(caseDefinition);
  await writeFile(promptPath, `${prompt}\n`, 'utf8');
  const argumentsList = [
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--ignore-rules',
    '--sandbox',
    'read-only',
    '--json',
    '--color',
    'never',
    '--model',
    options.model,
    '--cd',
    repositoryRoot,
    '--output-last-message',
    responsePath,
    prompt
  ];
  const startedAtMs = Date.now();
  let processResult;
  try {
    processResult = await spawnCapture(options.codex, argumentsList, {
      cwd: repositoryRoot,
      timeoutMs: options.timeoutMs
    });
  } catch (error) {
    processResult = {
      exitCode: null,
      signal: null,
      timedOut: false,
      stdout: '',
      stderr: `${error.stack ?? error}`
    };
  }
  await Promise.all([
    writeFile(eventsPath, processResult.stdout, 'utf8'),
    writeFile(stderrPath, processResult.stderr, 'utf8')
  ]);
  let response = '';
  try {
    response = await readFile(responsePath, 'utf8');
  } catch {
    // Execution failure below records the missing final response.
  }
  const executionError = processResult.timedOut
    ? `timed out after ${options.timeoutMs} ms`
    : processResult.exitCode !== 0
      ? `codex exited with ${processResult.exitCode ?? processResult.signal ?? 'unknown status'}`
      : !response.trim()
        ? 'codex produced no final response'
        : null;
  const grade = response.trim()
    ? gradeResponse(caseDefinition, response)
    : {
        passed: false,
        score: 0,
        assertions: caseDefinition.assertions.map(assertion => ({
          id: assertion.id,
          kind: assertion.kind,
          description: assertion.description,
          passed: false,
          matchedPattern: null
        }))
      };
  const result = {
    run: runNumber,
    passed: executionError === null && grade.passed,
    score: executionError === null ? grade.score : 0,
    elapsedMs: Date.now() - startedAtMs,
    usage: parseUsage(processResult.stdout),
    executionError,
    exitCode: processResult.exitCode,
    signal: processResult.signal,
    assertions: grade.assertions,
    promptPath: relativeArtifactPath(promptPath),
    responsePath: relativeArtifactPath(responsePath),
    eventsPath: relativeArtifactPath(eventsPath),
    stderrPath: relativeArtifactPath(stderrPath)
  };
  await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function runLive(options, selectedCases) {
  const timestamp = runTimestamp();
  const outputDirectory = path.join(defaultArtifactRoot, `${timestamp}-${safePathSegment(options.model)}`);
  await assertPathAbsent(outputDirectory);
  await mkdir(outputDirectory, { recursive: true });
  const [version, repository, baselineData, fingerprints] = await Promise.all([
    codexVersion(options.codex, options.timeoutMs),
    repositoryMetadata(options.timeoutMs),
    options.baseline ? readBaseline(options.baseline) : Promise.resolve(null),
    inputFingerprints()
  ]);
  const caseResults = [];
  for (const caseDefinition of selectedCases) {
    const runs = [];
    process.stdout.write(`${caseDefinition.id} ${caseDefinition.title}\n`);
    for (let runNumber = 1; runNumber <= options.repeat; runNumber += 1) {
      const runDirectory = path.join(outputDirectory, caseDefinition.id, `run-${runNumber}`);
      process.stdout.write(`  run ${runNumber}/${options.repeat} ... `);
      const result = await executeCaseRun(options, caseDefinition, runNumber, runDirectory);
      process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'}\n`);
      runs.push(result);
    }
    const passedRuns = runs.filter(run => run.passed).length;
    caseResults.push({
      id: caseDefinition.id,
      title: caseDefinition.title,
      tags: caseDefinition.tags,
      definitionFingerprint: caseDefinition.definitionFingerprint,
      passed: passedRuns === runs.length,
      passedRuns,
      score: runs.reduce((sum, run) => sum + run.score, 0) / runs.length,
      runs,
      reviewQuestions: caseDefinition.reviewQuestions
    });
  }
  const baseline = compareBaseline(caseResults, baselineData, {
    repository,
    repeat: options.repeat,
    trustFingerprint: fingerprints.trust,
    evalHarnessFingerprint: fingerprints.harness
  });
  const allCasesPassed = caseResults.every(result => result.passed);
  const report = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    model: options.model,
    codexVersion: version,
    trustMode: 'standard',
    sandbox: 'read-only',
    ephemeral: true,
    repeat: options.repeat,
    repository,
    trustFingerprint: fingerprints.trust,
    evalHarnessFingerprint: fingerprints.harness,
    passed: allCasesPassed && (!baseline || (
      baseline.compatible && baseline.regressions.length === 0
    )),
    summary: {
      caseCount: caseResults.length,
      passedCases: caseResults.filter(result => result.passed).length,
      failedCases: caseResults.filter(result => !result.passed).length,
      runCount: caseResults.length * options.repeat,
      averageScore: caseResults.reduce((sum, result) => sum + result.score, 0) / caseResults.length
    },
    baseline,
    cases: caseResults
  };
  const reportJsonPath = path.join(outputDirectory, 'report.json');
  const reportMarkdownPath = path.join(outputDirectory, 'report.md');
  await Promise.all([
    writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    writeFile(reportMarkdownPath, renderMarkdownReport(report), 'utf8')
  ]);
  process.stdout.write(`\n${report.passed ? 'PASS' : 'FAIL'}: ${report.summary.passedCases}/${report.summary.caseCount} cases passed\n`);
  process.stdout.write(`Report: ${relativeArtifactPath(reportMarkdownPath)}\n`);
  return report.passed;
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n\n`);
    usage();
    process.exitCode = 2;
    return;
  }
  if (options.help) {
    usage();
    return;
  }
  let allCases;
  try {
    allCases = await loadCases();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  if (options.validate) {
    process.stdout.write(`Trust eval validation passed (${allCases.length} cases).\n`);
    return;
  }
  if (options.list) {
    for (const definition of allCases) {
      process.stdout.write(`${definition.id}\t${definition.title}\t${definition.tags.join(',')}\n`);
    }
    return;
  }
  let selectedCases;
  try {
    selectedCases = selectCases(allCases, options.caseIds);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  if (options.dryRun) {
    for (const definition of selectedCases) {
      process.stdout.write(`${definition.id}: ${dryRunCommand(options, definition).join(' ')}\n`);
    }
    process.stdout.write(`Dry run: ${selectedCases.length} case(s), ${options.repeat} repetition(s), no model calls.\n`);
    return;
  }
  try {
    const passed = await runLive(options, selectedCases);
    if (!passed) {
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`${error.stack ?? error}\n`);
    process.exitCode = 2;
  }
}

const invokedAsScript = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (invokedAsScript) {
  await main();
}

export {
  compareBaseline,
  gradeResponse,
  loadCases,
  parseUsage,
  parseArguments,
  questionSegments,
  selectCases,
  validateCase
};
