import { sampleCalc } from '@/scripts/plugins/_sampleCalc';

test('1 + 2 = 3', () => {
  expect(sampleCalc(1, 2)).toBe(3);
});