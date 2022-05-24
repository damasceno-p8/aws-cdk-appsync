import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();

export default async function deleteNote(noteId: string) {
    const params = {
        TableName: String(process.env.NOTES_TABLE),
        Key: {
            id: noteId
        }
    }
    try {
        await docClient.delete(params).promise()
        return noteId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}