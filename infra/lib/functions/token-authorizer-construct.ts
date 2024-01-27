import { Construct } from "constructs";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { RustFunction } from "cargo-lambda-cdk";
import { Duration, Stack } from "aws-cdk-lib";
import { Architecture } from "aws-cdk-lib/aws-lambda";

interface AuthorizerProps {
    version: string;
    pool: IUserPool;
    clientId: string;
}

export class AuthorizerFunction extends Construct {
    private readonly _func: RustFunction;
    constructor(scope: Construct, id: string, props: AuthorizerProps) {
        super(scope, id);

        this._func = new RustFunction(this, `TokenAuthorizerFunction`, {
            manifestPath: "./token-authorizer/Cargo.toml",
            functionName: `api-authorizer`,
            timeout: Duration.seconds(10),
            memorySize: 256,
            architecture: Architecture.ARM_64,
            environment: {
                APP_LOG: "access_token_authorizer=debug",
                USER_POOL_ID: props.pool.userPoolId,
                REGION_ID: Stack.of(this).region,
                CLIENT_ID: props.clientId,
            },
        });
        // add permissions and event sources
    }
    get function(): RustFunction {
        return this._func;
    }
}
