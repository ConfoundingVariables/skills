async page => {
  // Deterministic mechanical audit for HTML quizzes. It never judges the
  // answer-length cue itself: that is a visual property. Instead it verifies
  // structure, flow, page-load shuffling, and displayed-letter reporting, then
  // emits several short contact sheets the agent vision-assesses and discards.
  const targetUrl = page.url().split('#')[0].split('?')[0];
  const context = page.context();

  await context.addInitScript(() => {
    const seedMatch = window.location.search.match(/[?&]__quizAuditSeed=(\d+)/);
    if (!seedMatch) return;
    let state = (Number(seedMatch[1]) >>> 0) || 1;
    Math.random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  });

  const configurations = [
    { name: 'narrow desktop', width: 1100, height: 900, seed: 1337, capture: true },
    { name: 'wide desktop', width: 1440, height: 1000, seed: 7331, capture: false }
  ];

  async function auditRun(configuration) {
    await page.setViewportSize({ width: configuration.width, height: configuration.height });
    await page.goto(`${targetUrl}?__quizAuditSeed=${configuration.seed}`);
    await page.locator('#options button').first().waitFor();

    const countText = await page.locator('#question-count').textContent();
    const countMatch = countText && countText.match(/of\s+(\d+)/i);
    if (!countMatch) throw new Error('Expected #question-count text in the form “Question 1 of N”.');
    const questionTotal = Number(countMatch[1]);
    if (!Number.isInteger(questionTotal) || questionTotal < 1) throw new Error('Quiz question count is invalid.');

    const items = [];
    const optionImages = [];
    for (let questionIndex = 0; questionIndex < questionTotal; questionIndex += 1) {
      const buttons = page.locator('#options button');
      const buttonCount = await buttons.count();
      if (buttonCount !== 4) throw new Error(`Question ${questionIndex + 1}: expected four options, found ${buttonCount}.`);

      const labels = await page.locator('#options .choice-key').allTextContents();
      if (labels.join('') !== 'ABCD') throw new Error(`Question ${questionIndex + 1}: displayed labels must be A, B, C, D.`);

      const optionOrder = await buttons.evaluateAll(nodes => nodes.map(node => node.innerText.replace(/^[A-D]\s*/, '').trim()));
      await buttons.first().click();

      const feedbackText = (await page.locator('#feedback').textContent() || '').trim();
      if (!feedbackText) throw new Error(`Question ${questionIndex + 1}: selecting an option produced no feedback.`);

      const correctCount = await buttons.evaluateAll(nodes => nodes.filter(node => node.classList.contains('is-correct')).length);
      if (correctCount !== 1) throw new Error(`Question ${questionIndex + 1}: expected exactly one .is-correct option, found ${correctCount}.`);
      const correctIndex = await buttons.evaluateAll(nodes => nodes.findIndex(node => node.classList.contains('is-correct')));

      if (configuration.capture) {
        const image = await page.locator('#options').screenshot();
        optionImages.push(image.toString('base64'));
      }

      items.push({ question: questionIndex + 1, correct: 'ABCD'[correctIndex], optionOrder });

      const nextButton = page.locator('#next-button');
      if (await nextButton.isDisabled()) throw new Error(`Question ${questionIndex + 1}: #next-button stayed disabled after answering.`);
      await nextButton.click();
    }

    if (!await page.locator('#results').isVisible()) throw new Error('Completing the final question did not reveal #results.');
    const summary = (await page.locator('#result-summary').textContent() || '').trim();
    const answerLine = summary.split('\n').find(line => line.startsWith('Answers:')) || '';
    const expectedAnswerLine = `Answers: ${items.map(item => `${item.question}A`).join(', ')}`;
    if (answerLine !== expectedAnswerLine) {
      throw new Error('Result summary must report displayed letters. The audit always picked displayed option A, so the summary must read 1A, 2A, ….');
    }
    if (!summary.includes('Missed dimensions:')) throw new Error('Result summary is missing “Missed dimensions:”.');

    return { ...configuration, questionTotal, items, optionImages, summary };
  }

  const runs = [];
  for (const configuration of configurations) runs.push(await auditRun(configuration));

  const firstOrders = runs[0].items.map(item => item.optionOrder.join('\u0000'));
  const secondOrders = runs[1].items.map(item => item.optionOrder.join('\u0000'));
  const changedOrders = firstOrders.filter((order, index) => order !== secondOrders[index]).length;
  if (changedOrders === 0) throw new Error('Two deterministic seeds produced identical option orders; page-load shuffling is missing.');

  const captureRun = runs.find(run => run.capture);
  const slug = targetUrl.split('/').pop().replace(/\.html?$/i, '') || 'quiz';

  // One long sheet gets downscaled and vision quality collapses, so emit a few
  // short, single-column images kept near native resolution instead.
  const batchSize = 4;
  const batches = [];
  for (let start = 0; start < captureRun.items.length; start += batchSize) {
    batches.push(captureRun.items.slice(start, start + batchSize));
  }

  const auditPage = await context.newPage();
  await auditPage.setViewportSize({ width: 820, height: 900 });
  const contactSheets = [];
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    const cards = batch.map(item => `
      <figure>
        <figcaption>Q${item.question} · correct = ${item.correct} (green)</figcaption>
        <img src="data:image/png;base64,${captureRun.optionImages[item.question - 1]}" alt="Rendered options for question ${item.question}">
      </figure>`).join('');
    await auditPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      *{box-sizing:border-box} body{margin:0;padding:20px;background:#101010;color:#fff;font-family:Inter,Arial,sans-serif}
      h1{margin:0 0 4px;font-size:20px} p{margin:0 0 16px;color:#9a9a9a;font-size:12px}
      figure{margin:0 0 16px;border:1px solid #5e5e5e;background:#000;padding:10px}
      figcaption{margin:0 0 6px;color:#8fd400;font:700 13px ui-monospace,monospace}
      img{display:block;max-width:100%;height:auto;image-rendering:crisp-edges}
    </style></head><body>
      <h1>Option audit ${batchIndex + 1}/${batches.length} · Q${batch[0].question}-${batch[batch.length - 1].question} of ${captureRun.questionTotal}</h1>
      <p>No correct (green) option should read as conspicuously longer or more detailed than its distractors, and “longest = correct” should not recur. Discard after assessment.</p>
      ${cards}</body></html>`);
    const contactSheet = `.playwright-cli/${slug}-visual-audit-${batchIndex + 1}.png`;
    await auditPage.screenshot({ path: contactSheet, fullPage: true });
    contactSheets.push(contactSheet);
  }
  await auditPage.close();

  return {
    status: 'MECHANICAL_PASS',
    questions: runs[0].questionTotal,
    deterministicSeeds: configurations.map(item => item.seed),
    optionOrdersChanged: changedOrders,
    viewports: configurations.map(item => `${item.width}x${item.height}`),
    contactSheets,
    nextStep: 'Vision-assess each contact sheet for answer-length cues, then delete them.'
  };
}
