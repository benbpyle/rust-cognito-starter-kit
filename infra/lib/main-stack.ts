import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthorizerTable } from "./data/table-construct";
import { TokenCustomizerFunction } from "./functions/token-customizer-construct";
import { CognitoConstruct } from "./cognito/cognito-construct";
import { AuthorizerFunction } from "./functions/token-authorizer-construct";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { aws_lambda as lambda } from "aws-cdk-lib";

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

        const authorizerStack = new AuthorizerFunction(
            this,
            "AuthorizerFunctionStack",
            {
                version: version,
                pool: cognitoStack.pool,
                clientId: cognitoStack.client.userPoolClientId,
            }
        );

        tokenCustomizerStack.function.addPermission("AuthorizerPermission", {
            action: "lambda:InvokeFunction",
            principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
            sourceArn: cognitoStack.pool.userPoolArn,
        });
    }
}
