import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();

export async function listNotes() {
    const params = {
        TableName: String(process.env.NOTES_TABLE),
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}