import { collections } from '../database';
import { nowJson } from '../helpers/time';

export default class MetadataModel{

    static get collection(){
        return collections.metadata;
    }

    static setValue(key, value){
        return this.collection.upsert({
            key,
            value,
            updated_at: nowJson(),
        })
    }

    static async getValue(key, defaultValue){
        const item = await this.getItem(key).exec();
        if(item){
            return item.value;
        }else{
            if(defaultValue){
                await this.setValue(key, defaultValue);
                return defaultValue;
            }else{
                return null;
            }
        }
    }

    static async incValue(key, amount){
        const item = await this.getItem(key).exec();
        if(!item){
            return await this.setValue(key, amount);
        }
        await item.update({
            $inc: {
                value: amount,
            }
        })
    }

    static getItem(key){
        return this.collection.findOne({
            selector: {
                key,
            }
        });
    }

}