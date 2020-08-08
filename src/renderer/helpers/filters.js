export function date(str){
    return new Date(str).toLocaleDateString();
}

export function datetime(str){
    return new Date(str).toLocaleString();
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