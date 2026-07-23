import {roundMoney} from './calculate-day';
export function calculateOvertime(dailyRate:number,standardDailyHours:number,minutes:number,multiplier:number,status:'pending'|'approved'|'rejected') { if(status!=='approved') return 0; return roundMoney((dailyRate/standardDailyHours)*(minutes/60)*multiplier); }
