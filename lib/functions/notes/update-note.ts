/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDB } from 'aws-sdk';
import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';

const docClient = new DynamoDB.DocumentClient();

type Params = {
    TableName: string,
    Key: string | unknown,
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
}

export async function updateNote(note: any) {
    const params: UpdateItemInput & Params = {
        TableName: String(process.env.NOTES_TABLE),
        Key: {
            id: note.id
        },
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: "",
        ReturnValues: "UPDATED_NEW"
    };
    let prefix = "set ";
    const attributes = Object.keys(note);
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        if (attribute !== "id") {
            params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
            params["ExpressionAttributeValues"][":" + attribute] = note[attribute];
            params["ExpressionAttributeNames"]["#" + attribute] = attribute;
            prefix = ", ";
        }
    }
    console.log('params: ', params)
    try {
        await docClient.update(params).promise()
        return note
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}