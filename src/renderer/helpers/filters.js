import { DateTime } from "luxon";

export function date(str){
    const d = DateTime.fromISO(str);
    if(!d.isValid) return '---';
    return d.setZone('UTC').toFormat('dd/MM/yyyy');
}

export function datetime(str){
    const d = DateTime.fromISO(str);
    if(!d.isValid) return '---';
    return d.setZone('UTC').toFormat('dd/MM/yyyy HH:mm:ss');
}

export function price(val){
    const amt = parseFloat(val) || 0;
    const negative = amt < 0;
    return (negative ? '- ' : '') + config.currency + amt.toFixed(2);
}

export function price_minimal(val){
    let amt = parseFloat(val) || 0;
    amt = parseFloat(amt.toFixed(2));
    const negative = amt < 0;
    return (negative ? '- ' : '') + config.currency + amt.toString();
}