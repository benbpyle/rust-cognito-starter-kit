use aws_lambda_events::cognito::{
    ClaimsAndScopeOverrideDetailsV2, CognitoAccessTokenGenerationV2,
    CognitoEventUserPoolsPreTokenGenResponseV2, CognitoEventUserPoolsPreTokenGenV2,
    CognitoIdTokenGenerationV2, GroupConfiguration,
};
use aws_sdk_dynamodb::Client;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use std::collections::HashMap;
use tracing_subscriber::{
    layer::SubscriberExt as _, util::SubscriberInitExt as _, EnvFilter, Layer,
};

//mod aws_events;
mod data;
mod models;

async fn function_handler(
    client: &Client,
    table_name: &String,
    mut event: LambdaEvent<CognitoEventUserPoolsPreTokenGenV2>,
) -> Result<CognitoEventUserPoolsPreTokenGenV2, Error> {
    let mut access = HashMap::new();
    let mut id = HashMap::new();
    match event.payload.cognito_event_user_pools_header.user_name {
        Some(ref user_name) => {
            let user = data::fetch_item(client, &table_name, user_name).await?;
            access.insert("interesting_value".to_string(), user.interesting_value);
            id.insert("first_name".to_string(), user.first_name);
            id.insert("last_name".to_string(), user.last_name);
        }
        None => {
            event
                .payload
                .response
                .claims_and_scope_override_details
                .as_mut()
                .unwrap()
                .group_override_details
                .groups_to_override = vec![];
        }
    }

    let access_token = CognitoAccessTokenGenerationV2 {
        claims_to_add_or_override: access,
        claims_to_suppress: vec![],
        scopes_to_add: vec![],
        scopes_to_suppress: vec![],
    };

    let id_token = CognitoIdTokenGenerationV2 {
        claims_to_add_or_override: id,
        claims_to_suppress: vec![],
    };

    let ovr = ClaimsAndScopeOverrideDetailsV2 {
        access_token_generation: Some(access_token),
        group_override_details: GroupConfiguration {
            ..Default::default()
        },
        id_token_generation: Some(id_token),
    };

    event.payload.response = CognitoEventUserPoolsPreTokenGenResponseV2 {
        claims_and_scope_override_details: Some(ovr),
    };

    Ok(event.payload)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let filtered_layer = tracing_subscriber::fmt::layer()
        .pretty()
        .with_target(true)
        .with_file(true)
        .with_filter(EnvFilter::from_env("APP_LOG"));

    tracing_subscriber::registry().with(filtered_layer).init();

    let table_name = &std::env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let config = aws_config::load_from_env().await;
    let client = aws_sdk_dynamodb::Client::new(&config);
    let shared_client = &client;

    run(service_fn(
        move |event: LambdaEvent<CognitoEventUserPoolsPreTokenGenV2>| async move {
            function_handler(&shared_client, table_name, event).await
        },
    ))
    .await
}
