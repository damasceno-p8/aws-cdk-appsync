import { DynamoDB } from 'aws-sdk';

import { Note } from './note';


const docClient = new DynamoDB.DocumentClient();
export default async function createNote(note: Note) {
    const params = {
        TableName: String(process.env.NOTES_TABLE),
        Item: note
    }
    try {
        await docClient.put(params).promise();
        return note;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}