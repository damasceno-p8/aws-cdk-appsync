import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();

export async function getNoteById(noteId: string) {
    const params = {
        TableName: String(process.env.NOTES_TABLE),
        Key: { id: noteId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}