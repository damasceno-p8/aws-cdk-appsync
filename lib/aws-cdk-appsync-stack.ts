import * as appSync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export class AwsCdkAppsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new appSync.GraphqlApi(this, "aws-cdk-api-test", {
      name: "cdk-notes-appsync-api",
      schema: appSync.Schema.fromAsset(`${process.cwd()}/graphql/schemas/schema.gql`),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    })

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    })

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    })

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    })

    const notesLambda = new lambda.Function(this, 'AppSyncNotesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(`dist/functions`),
      memorySize: 1024,
    });

    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', notesLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    const notesTable = new ddb.Table(this, 'CDKNotesTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    notesTable.grantFullAccess(notesLambda)

    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName);
  }
}
