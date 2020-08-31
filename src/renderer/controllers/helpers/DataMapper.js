const Fuse = require('fuse.js');

export default class DataMapper{

    constructor(templates){
        this.templatesFuse = new Fuse(templates, {
            keys: [
                "title",
            ]
        });
        this.propsFuse = new Fuse([], {
            threshold: 0.5,
            keys: [
                'text',
            ]
        })
    }

    mapSheetsData(sheets){
        const data = {};
        for(let sheet of sheets){
            const template = this.templatesFuse.search(sheet.name)[0].item;
            data[template.name] = this.mapSheet(sheet.data, template);
        }
        return data;
    }

    mapSheet(rows, template){
        const data = [];
        const headerMap = this.buildHeaderMap(rows, template);
        const start = Math.max(...template.excel.headerLines) + 1;
        const len = rows.length;
        for(let i = start; i < len; i++){
            const row = rows[i];
            const item = this.craftRowObject(row, headerMap);
            if(item.filledCount > 0){
                data.push(item.obj);
            }
        }
        return data;
    }

    craftRowObject(values, headerMap){
        const obj = {};
        let filledCount = 0;
        for(let i = 0; i < values.length; i++){
            const val = values[i];
            const prop = headerMap[i];
            if(val && prop){
                obj[prop.value] = this.formatPropValue(val, prop);
                filledCount++;
            }
        }
        return {
            obj,
            filledCount,
        };
    }

    formatPropValue(val, prop){
        const { type } = prop;
        if(type == 'date'){
            const date = new Date('1900');
            date.setUTCDate(parseInt(val) - 1)
            return date.toJSON();
        }else{
            return val;
        }
    }

    buildHeaderMap(rows, template){
        const map = [];
        const { props, excel } = template;
        const headerLines = this._getArrayItems(rows, excel.headerLines);
        const headers = this._joinStringArrays(' ', ...headerLines);
        this.propsFuse.setCollection(props);
        for(let header of headers){
            const _header = header.replace(/\s\s+/g, ' ');
            const prop = (this.propsFuse.search(_header)[0] || {}).item;
            if(prop){
                map.push(prop);
            }else{
                map.push(null);
            }
        }
        return map;
    }

    _getArrayItems(arr, indexes){
        const result = [];
        for(let index of indexes){
            result.push(arr[index])
        }
        return result;
    }

    _joinStringArrays(glue, ...arrays){
        const result = [];
        const lengths = arrays.map(arr => arr.length);
        const len = Math.max(...lengths);
        for(let i = 0; i < len; i++){
            const items = arrays.map(arr => arr[i]);
            const joined = items.join(glue || '');
            result.push(joined.trim());
        }
        return result;
    }

}