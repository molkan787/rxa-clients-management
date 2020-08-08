Object.patch = function (obj, patch, props){
    if(props){
        for(let prop of props){
            obj[prop] = patch[prop];
        }
    }else{
        for(let prop in patch){
            if(!patch.hasOwnProperty(prop)) continue;
            obj[prop] = patch[prop];
        }
    }
    return obj;
}

Object.clone = obj => JSON.parse(JSON.stringify(obj));

String.isAlphanumericOnly = str => /^[a-zA-Z\d]+$/.test(str);
String.isAlphaOnly = str => /^[a-zA-Z]+$/.test(str);
String.isNoSpecialChars = str => /^[a-zA-Z\d\ ]+$/.test(str);

Object.encodepaths = function encodepaths(src){
    const result = {};
    const props = getValuesPaths(src);
    for(let i = 0; i < props.length; i++){
        const prop = props[i];
        result[prop.path] = prop.value;
    }
    return result;
}

function getValuesPaths(obj, prefix){
    const _prefix = prefix ? prefix + '.' : '';
    const result = [];
    for(let prop in obj){
        if(!obj.hasOwnProperty(prop)) continue;
        const value = obj[prop];
        if(typeof value == 'object' && !Array.isArray(value)){
            const paths = getValuesPaths(value, _prefix + prop);
            result.push(...paths);
        }else{
            result.push({
                path: _prefix + prop,
                value,
            })
        }
    }
    return result;
}

Object.decodepaths = function decodepaths(src){
    const result = {};
    for(let prop in src){
        if(!src.hasOwnProperty(prop)) continue;
        setPathedValue(result, prop, src[prop]);
    }
    return result;
}

function setPathedValue(obj, path, value){
    const names = path.split('.');
    let _obj = obj;
    for(let i = 0; i < names.length - 1; i++){
        const n = names[i];
        if(typeof _obj[n] != 'object'){
            _obj[n] = new Object();
        }
        _obj = _obj[n];
    }
    const lastName = names[names.length - 1];
    _obj[lastName] = value;
}

Object.getPathedValue = function getPathedValue(obj, path){
    const names = path.split('.');
    let _v = obj;
    for(let n of names){
        _v = _v[n];
        if(typeof _v == 'undefined') break;
    }
    return _v;
}