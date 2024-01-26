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
} from "aws-cdk-lib/aws-cognito";

interface CognitoProps {
    function: lambda.Function;
}

export class CognitoConstruct extends Construct {
    private readonly _pool: IUserPool;
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
        });

        // ....
        // if you need to add other things like clients etc you can export / import it into the stack
        this._pool = UserPool.fromUserPoolId(
            scope,
            "RefdUserPool",
            cfnUserPool.ref
        );

        this._pool.addClient("sample-client", {
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
}
