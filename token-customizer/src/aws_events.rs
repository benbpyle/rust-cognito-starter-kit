// use serde::{Deserialize, Deserializer, Serialize};
// use std::collections::HashMap;

// pub(crate) fn deserialize_lambda_map<'de, D, K, V>(
//     deserializer: D,
// ) -> Result<HashMap<K, V>, D::Error>
// where
//     D: Deserializer<'de>,
//     K: serde::Deserialize<'de>,
//     K: std::hash::Hash,
//     K: std::cmp::Eq,
//     V: serde::Deserialize<'de>,
// {
//     // https://github.com/serde-rs/serde/issues/1098
//     let opt = Option::deserialize(deserializer)?;
//     Ok(opt.unwrap_or_default())
// }

// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoEventUserPoolsCallerContext {
//     #[serde(default)]
//     #[serde(rename = "awsSdkVersion")]
//     pub awssdk_version: Option<String>,
//     #[serde(default)]
//     pub client_id: Option<String>,
// }

// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoEventUserPoolsHeader {
//     #[serde(default)]
//     pub version: Option<String>,
//     #[serde(default)]
//     pub trigger_source: Option<String>,
//     #[serde(default)]
//     pub region: Option<String>,
//     #[serde(default)]
//     pub user_pool_id: Option<String>,
//     pub caller_context: CognitoEventUserPoolsCallerContext,
//     #[serde(default)]
//     pub user_name: Option<String>,
// }

// /// `GroupConfiguration` allows lambda to override groups, roles and set a preferred role
// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct GroupConfiguration {
//     pub groups_to_override: Vec<String>,
//     pub iam_roles_to_override: Vec<String>,
//     pub preferred_role: Option<String>,
// }

// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoEventUserPoolsPreTokenGenV2 {
//     #[serde(rename = "CognitoEventUserPoolsHeader")]
//     #[serde(flatten)]
//     pub cognito_event_user_pools_header: CognitoEventUserPoolsHeader,
//     pub request: CognitoEventUserPoolsPreTokenGenRequestV2,
//     pub response: CognitoEventUserPoolsPreTokenGenResponseV2,
// }

// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoEventUserPoolsPreTokenGenRequestV2 {
//     #[serde(deserialize_with = "deserialize_lambda_map")]
//     #[serde(default)]
//     pub user_attributes: HashMap<String, String>,
//     pub group_configuration: GroupConfiguration,
//     #[serde(deserialize_with = "deserialize_lambda_map")]
//     #[serde(default)]
//     pub client_metadata: HashMap<String, String>,
//     pub scopes: Vec<String>,
// }

// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoEventUserPoolsPreTokenGenResponseV2 {
//     pub claims_and_scope_override_details: Option<ClaimsAndScopeOverrideDetailsV2>,
// }

// /// `ClaimsAndScopeOverrideDetailsV2` allows lambda to add, suppress or override claims in the token
// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct ClaimsAndScopeOverrideDetailsV2 {
//     pub group_override_details: GroupConfiguration,
//     pub id_token_generation: Option<CognitoIdTokenGenerationV2>,
//     pub access_token_generation: Option<CognitoAccessTokenGenerationV2>,
// }

// /// `CognitoIdTokenGenerationV2` allows lambda to customize the ID Token before generation
// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoIdTokenGenerationV2 {
//     pub claims_to_add_or_override: HashMap<String, String>,
//     pub claims_to_suppress: Vec<String>,
// }

// /// `CognitoAccessTokenGenerationV2` allows lambda to customize the Access Token before generation
// #[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct CognitoAccessTokenGenerationV2 {
//     pub claims_to_add_or_override: HashMap<String, String>,
//     pub claims_to_suppress: Vec<String>,
//     pub scopes_to_add: Vec<String>,
//     pub scopes_to_suppress: Vec<String>,
// }
