use aws_lambda_events::apigw::{
    ApiGatewayCustomAuthorizerPolicy, ApiGatewayCustomAuthorizerRequest,
    ApiGatewayCustomAuthorizerResponse, IamPolicyStatement,
};
use claims::dump_claims;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use tracing_subscriber::{
    layer::SubscriberExt as _, util::SubscriberInitExt as _, EnvFilter, Layer,
};

mod claims;

fn new_response(effect: &str, ctx: serde_json::Value) -> ApiGatewayCustomAuthorizerResponse {
    ApiGatewayCustomAuthorizerResponse {
        principal_id: None,
        policy_document: ApiGatewayCustomAuthorizerPolicy {
            version: Some("2012-10-17".to_owned()),
            statement: vec![IamPolicyStatement {
                effect: Some(effect.to_owned()),
                resource: vec!["*".to_owned()],
                action: vec!["execute-api:Invoke".to_owned()],
            }],
        },
        usage_identifier_key: None,
        context: ctx,
    }
}

async fn function_handler(
    client_id: &str,
    keyset: &jsonwebtokens_cognito::KeySet,
    event: LambdaEvent<ApiGatewayCustomAuthorizerRequest>,
) -> Result<ApiGatewayCustomAuthorizerResponse, claims::AuthorizerError> {
    let mut allowance = "Allow";
    let mut ctx = serde_json::Value::default();

    let verifier = keyset.new_access_token_verifier(&[client_id]).build()?;
    let token = event.payload.authorization_token.unwrap();
    let claims: Result<serde_json::Value, jsonwebtokens_cognito::Error> =
        keyset.try_verify(token.as_str(), &verifier);

    match claims {
        Ok(c) => ctx = dump_claims(&c)?,
        Err(_) => {
            allowance = "Deny";
        }
    }

    let response = new_response(allowance, ctx);
    Ok(response)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let filtered_layer = tracing_subscriber::fmt::layer()
        .pretty()
        .with_target(true)
        .with_file(true)
        .with_filter(EnvFilter::from_env("APP_LOG"));

    tracing_subscriber::registry().with(filtered_layer).init();

    let client_id = &std::env::var("CLIENT_ID").expect("CLIENT_ID must be set");
    let keyset = jsonwebtokens_cognito::KeySet::new("us-west-2", "us-west-2_0L5QjPT9N").unwrap();
    let _ = keyset.prefetch_jwks().await;
    let shared_keyset = &keyset;

    run(service_fn(
        move |event: LambdaEvent<ApiGatewayCustomAuthorizerRequest>| async move {
            function_handler(client_id, &shared_keyset, event).await
        },
    ))
    .await
}
