export function date(str){
    const date = new Date(str);
    if(isNaN(date.getTime())) return str;
    return date.toLocaleDateString();
}

export function datetime(str){
    const date = new Date(str);
    if(isNaN(date.getTime())) return str;
    return date.toLocaleString();
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