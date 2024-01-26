import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class AuthorizerTable extends Construct {
    private readonly _table: dynamodb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // dynamodb table
        this._table = new dynamodb.Table(this, id, {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            partitionKey: {
                name: "user_id",
                type: dynamodb.AttributeType.STRING,
            },
            tableName: `SampleUserProfile`,
            encryption: dynamodb.TableEncryption.AWS_MANAGED,
        });
    }

    get table(): Table {
        return this._table;
    }
}
