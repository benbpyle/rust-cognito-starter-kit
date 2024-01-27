## Cognito Starter Kit with Rust and Lambda

Purpose: This repository contains a Cognito Starter Kit with Rust and Lambda. It builds up
a Cognito User Pool with the V2 Payload enabled to customize the access token. It also includes
two working Lambdas coded in Rust to customize the access and ID tokens and also authorize requests in API Gateway and build a context payload that is passed down the call chain

This repository supports the [article hosted on Binaryheap.com](https://www.binaryheap.com/cognito-starter-kit-rust-and-lambda/)

## Steps for Running

-   [Install Rust](https://www.rust-lang.org/tools/install)
-   [Install Node](https://nodejs.org/en/download)
-   [Install CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

```bash
cdk deploy
cdk destroy
```
