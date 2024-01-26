import { Construct } from "constructs";
import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import { Options, StageEnvironment } from "../types/options";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IKey } from "aws-cdk-lib/aws-kms";
import { UserPool } from "aws-cdk-lib/aws-cognito";

interface AuthorizerProps {
    table: Table;
    version: string;
    pool: UserPool;
}

export class AuthorizerFunction extends Construct {
    //private readonly _func: GoFunction;
    // constructor(scope: Construct, id: string, props: AuthorizerProps) {
    //     super(scope, id);
    //     this._func = new RustFunction(this, `TokenAuthorizerFunction`, {
    //         manifestPath: "./token-authorizer/Cargo.toml",
    //         functionName: `api-authorizer`,
    //         timeout: Duration.seconds(10),
    //         architecture: Architecture.ARM_64,
    //         environment: {
    //             APP_LOG: "access_token_authorizer=debug",
    //         },
    //     });
    //     // add permissions and event sources
    // }
    // get function(): RustFunction {
    //     return this._func;
    // }
}
