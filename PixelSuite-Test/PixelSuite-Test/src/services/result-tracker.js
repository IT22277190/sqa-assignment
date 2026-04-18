function createResultTracker() {
  let passed = 0;
  let failed = 0;
  const results = [];

  function log(label, status, detail = '') {
    const icon = status === 'PASS' ? '✅' : '❌';
    const line = `${icon} [${status}] ${label}${detail ? ' → ' + detail : ''}`;
    console.log(line);
    results.push({ label, status, detail });
    if (status === 'PASS') {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  function getSummary() {
    return { passed, failed, results: [...results] };
  }

  return {
    log,
    getSummary,
  };
}

module.exports = {
  createResultTracker,
};
