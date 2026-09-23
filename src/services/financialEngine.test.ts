import { describe, it, expect } from 'vitest';
import { FinancialEngine } from './financialEngine';

describe('FinancialEngine', () => {
  it('generates well-formatted transaction references with prefixes', () => {
    const depRef = FinancialEngine.generateReference('FN-DEP');
    expect(depRef).toMatch(/^FN-DEP-\d{6}$/);

    const invRef = FinancialEngine.generateReference('FN-INV');
    expect(invRef).toMatch(/^FN-INV-\d{6}$/);

    const wthRef = FinancialEngine.generateReference('FN-WTH');
    expect(wthRef).toMatch(/^FN-WTH-\d{6}$/);
  });

  it('generates standard ISO formatted timestamps', () => {
    const timestamp = FinancialEngine.getIsoNow();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('rejects deposits under the statutory threshold', async () => {
    await expect(
      FinancialEngine.submitDeposit({
        userId: 'user_test',
        userName: 'Test User',
        userEmail: 'test@example.com',
        amount: 20, // Less than minimum 50
        method: 'Mobile Money',
        provider: 'MTN',
        accountDetails: '0244000000',
      })
    ).rejects.toThrow('Minimum deposit amount is GH₵50.00.');
  });
});
