# Fastly Purge for Surrogate Keys

## How to Configure and Test

Prequisistes: have NPM (node package manager) and NVM (node version manager) installed

1. Run in terminal at root: `nvm use v10` and `npm install`
2. Copy `.env.example.yml` to `.env.yml` and replace the values from API keys you get from FASTLY with for the specific server.

## How to deploy to a GCP cloud function

1. Install gcloud sdk cli tools https://cloud.google.com/sdk/docs#install_the_latest_cloud_tools_version_cloudsdk_current_version
2. Authenticate with google https://cloud.google.com/sdk/gcloud/reference/auth
3. `gcloud  functions deploy zestyFastlyPurge --env-vars-file .env.yml --runtime nodejs10 --trigger-http --project YOUR-PROJECT-NAME`

## How to Purge the cache hitting the remote Google Cloud function

1. Setup a POST request to `https://us-central1-zesty-dev.cloudfunctions.net/zestyFastlyPurge` note `us-central1` will be your deploy location and `zesty-dev` will be your GCP environement name
2. In that post request include a header `'X-Auth' : SERVICE_KEY` and a raw body:
```
{
      "objects": [
          "ZUID or SURROGATE KEY"
      ]
  }
  ```

**Examples**

Curl 

```
curl --location --request POST 'https://us-central1-PROJECT-NAME.cloudfunctions.net/zestyFastlyPurge' \
--header 'X-Auth: xxxxx' \
--header 'Content-Type: text/plain' \
--data-raw '{
      "objects": [
          "Foo",
          "Bar"
      ]
  }'
```