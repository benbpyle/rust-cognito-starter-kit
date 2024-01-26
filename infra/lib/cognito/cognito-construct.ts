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

        // {
        //     "Version": "2012-10-17",
        //     "Id": "default",
        //     "Statement": [
        //       {
        //         "Sid": "CSI_PreTokenGeneration_us-west-2CLLsb7v4x_CSI_PreTokenGeneration",
        //         "Effect": "Allow",
        //         "Principal": {
        //           "Service": "cognito-idp.amazonaws.com"
        //         },
        //         "Action": "lambda:InvokeFunction",
        //         "Resource": "arn:aws:lambda:us-west-2:252703795646:function:cogonito-token-customizer",
        //         "Condition": {
        //           "ArnLike": {
        //             "AWS:SourceArn": "arn:aws:cognito-idp:us-west-2:252703795646:userpool/us-west-2_CLLsb7v4x"
        //           }
        //         }
        //       }
        //     ]
        //   }
    }

    get pool(): IUserPool {
        return this._pool;
    }
}
