import { Construct } from "constructs";

import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnOutput, Duration } from "aws-cdk-lib";
import {
    AdvancedSecurityMode,
    CfnUserPool,
    IUserPool,
    UserPool,
    UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";

interface CognitoProps {
    function: lambda.Function;
}

export class CognitoConstruct extends Construct {
    private readonly _pool: IUserPool;
    private readonly _client: cognito.UserPoolClient;
    constructor(scope: Construct, id: string, props: CognitoProps) {
        super(scope, id);

        const cfnUserPool = new CfnUserPool(this, "CfnUserPool", {
            userPoolName: `ExampleUserPool`,
            userPoolAddOns: {
                advancedSecurityMode: AdvancedSecurityMode.AUDIT,
            },
            lambdaConfig: {
                // @ts-ignore
                preTokenGenerationConfig: {
                    lambdaArn: props.function.functionArn,
                    lambdaVersion: "V2_0",
                },
            },
            policies: {},
        });

        this._pool = UserPool.fromUserPoolId(
            scope,
            "RefdUserPool",
            cfnUserPool.ref
        );

        this._client = this._pool.addClient("sample-client", {
            userPoolClientName: "sample-client",
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: false,
            },
            idTokenValidity: Duration.minutes(60),
            refreshTokenValidity: Duration.days(30),
            accessTokenValidity: Duration.minutes(60),
        });
    }

    get pool(): IUserPool {
        return this._pool;
    }

    get client(): UserPoolClient {
        return this._client;
    }
}
