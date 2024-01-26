import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthorizerTable } from "./data/table-construct";
import { TokenCustomizerFunction } from "./functions/token-customizer-construct";
import { CognitoConstruct } from "./cognito/cognito-construct";

export class MainStack extends cdk.Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const version = new Date().toISOString();
        const tableStack = new AuthorizerTable(
            this,
            "AuthorizerTableConstruct"
        );

        const tokenCustomizerStack = new TokenCustomizerFunction(
            this,
            "TokenCustomizerFunctionConstruct",
            {
                table: tableStack.table,
                version: version,
            }
        );

        const cognitoStack = new CognitoConstruct(this, "CognitoStack", {
            function: tokenCustomizerStack.function,
        });

        // const authorizerStack = new AuthorizerFunction(
        //     this,
        //     "AuthorizerFunctionStack",
        //     {
        //         options: props.options,
        //         key: keyStack.key,
        //         table: tableStack.table,
        //         stage: props.stageEnvironment,
        //         version: version,
        //         pool: cognitoStack.pool,
        //     }
        // );
    }
}
