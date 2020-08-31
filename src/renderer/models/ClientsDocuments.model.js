import { collections } from '../database';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
const fsp = fs.promises;

export default class ClientsDocumentsModel{

    static get collection(){
        return collections.clientsDocuments;
    }

    static getClientDocuments(client_id){
        return this.collection.find({
            selector: {
                client_id,
                created_at: { $gte: 0 }
            },
            sort: [
                { created_at: 'desc' }
            ]
        })
    }

    static async openDocument(doc){
        const filename = await this.saveAttachementToDisk(doc);
        console.log('Doc filename:', filename);
        electron.shell.openItem(filename)
    }

    static async saveAttachementToDisk(doc){
        const attachement = doc.allAttachments()[0];
        const data = await attachement.getData();
        const subdir = doc.created_at.split('T')[0];
        const fnPrefix = new Date().getTime();
        const newFn = fnPrefix + ' ' + doc.name;
        const docsDir = electron.remote.app.getPath('documents');
        const saveDir = path.join(docsDir, 'Rxa Documents', subdir);
        const filename = path.join(saveDir, newFn);
        await mkdirp(saveDir);
        await fsp.writeFile(filename, data);
        return filename;
    }

}