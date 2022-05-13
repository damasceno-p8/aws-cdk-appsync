import 'source-map-support/register';

import * as cdk from '@aws-cdk/core';

import { AwsCdkAppsyncStack } from '../lib/aws-cdk-appsync-stack';


const app = new cdk.App();
new AwsCdkAppsyncStack(app, 'AwsCdkAppsyncStack', {});