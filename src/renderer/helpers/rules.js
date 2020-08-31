export function createRules({ name, maxLength, minLength, min, max, chars, required, charsErrorText }){
    const rules = [];

    if(required || (typeof required == 'undefined' && minLength)){
        rules.push(val => !!val || `${name} is required`);
    }

    if(minLength){
        rules.push(val => !val || val.length >= minLength || `${name} must be at least ${minLength} characters long`);
    }

    if(maxLength){
        rules.push(val => val.length <= maxLength || `${name} must be less than ${maxLength} characters long`);
    }

    if(chars){
        const errText = charsErrorText || getCharsErrorMessage(chars);
        rules.push(val => !val || chars.test(val) || errText);
    }

    if(min){
        rules.push(val => !val.length || parseFloat(val) >= min || `Minimum value of ${name} is ${min}`);
    }

    if(max){
        rules.push(val => !val.length || parseFloat(val) <= max || `Maximum value of ${name} is ${max}`);
    }

    return rules;
}

function getCharsErrorMessage(chars){
    if(chars === ALPHA_ONLY){
        return 'Only alphabetical characters are allowed (without spaces)';
    }else if(chars === ALPHANUMERIC_ONLY){
        return 'Only alpha-numerical characters are allowed (without spaces)';
    }else if(chars){
        return 'Special characters are not allowed';
    }
}

export const ALPHA_ONLY = /^[a-zA-Z]+$/;
export const ALPHANUMERIC_ONLY = /^[a-zA-Z\d]+$/;
export const NO_SPECIAL_CHARS = /^[a-zA-Z\d\ ]+$/;