import { sampleCalc } from '@/scripts/plugins/_sampleCalc'

const calcA = sampleCalc(1, 2)
const calcB = sampleCalc(2, 3)
const result = calcA + calcB

console.log('#log result', result)
