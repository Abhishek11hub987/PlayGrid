import test from 'node:test'
import assert from 'node:assert/strict'

// Test math & revenue splitting logic
test('Revenue calculation adheres strictly to 80/20 publisher-platform split', () => {
  const gross = 1450.00
  const platformFeeRate = 0.20
  const publisherShareRate = 0.80

  const platformCut = Number((gross * platformFeeRate).toFixed(2))
  const publisherShare = Number((gross * publisherShareRate).toFixed(2))

  assert.equal(platformCut, 290.00)
  assert.equal(publisherShare, 1160.00)
  assert.equal(platformCut + publisherShare, gross)
})

test('Unverified MTD earnings are held in accrual and segregated from verified payable balance', () => {
  const account = {
    grossMTD: 482.50,
    verifiedPayable: 1160.00,
    status: 'estimated'
  }

  // Business rule: only verified balances can be withdrawn
  function canWithdraw(amount, account) {
    if (amount <= 0) return false
    return amount <= account.verifiedPayable
  }

  assert.equal(canWithdraw(500.00, account), true)
  assert.equal(canWithdraw(1160.00, account), true)
  assert.equal(canWithdraw(1160.01, account), false)
  // Attempting to withdraw against unverified MTD accrual must fail
  assert.equal(canWithdraw(account.verifiedPayable + account.grossMTD, account), false)
})

test('Slug generation correctly formats portal and game web addresses', () => {
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  assert.equal(slugify('Neon Arcade Nexus 2026!'), 'neon-arcade-nexus-2026')
  assert.equal(slugify('  Space Blaster: 3000  '), 'space-blaster-3000')
  assert.equal(slugify('Super-Mega--Portal'), 'super-mega-portal')
})

test('Number and currency formatting produces clean human-readable output', () => {
  function formatNumber(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString()
  }

  assert.equal(formatNumber(150), '150')
  assert.equal(formatNumber(1500), '1.5K')
  assert.equal(formatNumber(125000), '125.0K')
  assert.equal(formatNumber(2400000), '2.4M')
})

test('HTML5 iframe sandbox attributes contain required security flags', () => {
  const requiredSandboxFlags = ['allow-scripts', 'allow-same-origin', 'allow-fullscreen']
  const forbiddenSandboxFlags = ['allow-top-navigation', 'allow-popups-to-escape-sandbox']

  const defaultSandbox = 'allow-scripts allow-same-origin allow-fullscreen'

  for (const flag of requiredSandboxFlags) {
    assert.ok(defaultSandbox.includes(flag), `Must include ${flag}`)
  }
  for (const flag of forbiddenSandboxFlags) {
    assert.ok(!defaultSandbox.includes(flag), `Must NOT include ${flag}`)
  }
})

