#!/bin/bash

# Set environment variables
ENV=$1

# Define S3 bucket names (adjust accordingly)
BUCKET_PREFIX="usupport-ui"
UI="client"
REGION="eu-central-1"

DISTRIBUTION_ID=""
if [ "$ENV" == "prod" ]; then
    DISTRIBUTION_ID="E21ZDY7THNVRU3"
else
    DISTRIBUTION_ID="E3AAOY8M0AN1GH"
fi

# Ensure correct parameters
if [ "$ENV" != "staging" ] && [ "$ENV" != "prod" ]; then
    echo "Please select deployment environment: staging | prod"
    exit 1
fi

# Build the UI
echo "Building $UI for $ENV..."
npm install

# Install the components library
cd USupport-components-library
npm install
cd ..

if [ "$ENV" == "prod" ]; then
    npm run build --prod
else
    npm run staging
fi

# Sync to the appropriate S3 bucket
BUCKET_NAME="${BUCKET_PREFIX}-${ENV}"
S3_PATH="s3://${BUCKET_NAME}/${UI}/"
echo "Uploading to S3 bucket: $S3_PATH"
aws s3 sync ./dist/ $S3_PATH --region $REGION --delete

# Invalidate CloudFront cache
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "Invalidating CloudFront cache for distribution: $DISTRIBUTION_ID"
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/${UI}/*"
else
    echo "No matching CloudFront distribution found for $BUCKET_NAME"
fi

echo "Deployment of $UI to $ENV completed successfully."