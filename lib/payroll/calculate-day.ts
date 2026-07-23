export type DayCalculationInput={workedMinutes:number;dailyRate:number;standardDailyHours:number};
export const roundMoney=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function calculateDay({workedMinutes,dailyRate,standardDailyHours}:DayCalculationInput){const standardMinutes=standardDailyHours*60;const regularMinutes=Math.min(Math.max(0,workedMinutes),standardMinutes);return {regularMinutes,overtimeMinutes:Math.max(0,workedMinutes-standardMinutes),regularPay:roundMoney(dailyRate*regularMinutes/standardMinutes)};}
