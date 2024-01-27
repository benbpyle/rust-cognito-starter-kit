import { Construct } from "constructs";
import { Duration, Tags } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { RustFunction } from "cargo-lambda-cdk";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";

interface TokenCustomizerProps {
    table: Table;
    version: string;
}

export class TokenCustomizerFunction extends Construct {
    private readonly _func: RustFunction;
    constructor(scope: Construct, id: string, props: TokenCustomizerProps) {
        super(scope, id);
        this._func = new RustFunction(this, `TokenCustomizerFunction`, {
            manifestPath: "./token-customizer/Cargo.toml",
            functionName: `cogonito-token-customizer`,
            timeout: Duration.seconds(10),
            architecture: Architecture.ARM_64,
            memorySize: 256,
            environment: {
                APP_LOG: "access_token_customizer=debug",
                TABLE_NAME: props.table.tableName,
            },
        });
        // add permissions and event sources
        props.table.grantReadWriteData(this._func);
        Tags.of(this._func).add("version", props.version);
    }
    get function(): RustFunction {
        return this._func;
    }
}
