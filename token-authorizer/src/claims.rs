use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AuthorizerError {
    #[error("Something is wrong with the Cognito portion of the JWT")]
    JWTCognitoError,
    #[error("The JSON was bad.  The serde failed.")]
    InvalidSerde,
    #[error("The JWT is invalid")]
    InvalidJWT,
}

impl From<jsonwebtokens::error::Error> for AuthorizerError {
    fn from(_: jsonwebtokens::error::Error) -> Self {
        AuthorizerError::InvalidJWT
    }
}

impl From<serde_json::Error> for AuthorizerError {
    fn from(_: serde_json::Error) -> Self {
        AuthorizerError::InvalidSerde
    }
}

impl From<jsonwebtokens_cognito::Error> for AuthorizerError {
    fn from(_: jsonwebtokens_cognito::Error) -> Self {
        AuthorizerError::JWTCognitoError
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Claim {
    pub auth_time: i64,
    client_id: String,
    event_id: String,
    exp: i64,
    iat: i64,
    iss: String,
    jti: String,
    interesting_value: String,
    origin_jti: String,
    scope: String,
    sub: String,
    token_use: String,
    username: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct PrivateClaim {
    user_name: String,
    location_id: String,
}

pub fn dump_claims(value: &serde_json::Value) -> Result<serde_json::Value, serde_json::Error> {
    let claim: Result<Claim, serde_json::Error> = serde_json::from_value(value.clone());
    tracing::debug!("(Claim_JSON): {}", value);
    tracing::debug!("(Claim_Struct): {:?}", claim);

    match claim {
        Ok(c) => {
            let pc = PrivateClaim {
                user_name: c.username,
                location_id: c.interesting_value,
            };
            tracing::debug!("(PrivateClaim): {:?}", pc);
            let pc_v = serde_json::to_value(pc)?;
            Ok(pc_v)
        }
        Err(e) => {
            tracing::error!("(Claim_Struct): {:?}", e);
            Err(e)
        }
    }
}
