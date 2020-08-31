import { collections } from '../database';

export default class EntriesCategoriesModel{

    static get collection(){
        return collections.entriesCategories;
    }

    static getClientCategories(client_id){
        return this.collection.findOne({
            selector: {
                client_id
            }
        })
    }

    static async addCategory(client_id, category){
        const doc = await this.getClientCategories(client_id).exec();
        if(doc){
            await doc.update({
                $push: {
                    items: category,
                }
            })
        }else{
            await this.collection.insert({
                client_id,
                items: [
                    category
                ]
            })
        }
    }

    static async removeCategory(client_id, category){
        const doc = await this.getClientCategories(client_id).exec();
        await doc.atomicUpdate(data => {
            const index = data.items.findIndex(item => item.value == category.value);
            data.items.splice(index, 1);
            return data;
        })
    }

}