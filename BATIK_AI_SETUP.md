# Batik AI Studio - Google Cloud Imagen API Setup

## Overview
The Batik AI Studio uses Google Cloud's Imagen API to generate authentic Indonesian batik patterns. This guide will help you set up the API integration.

## Prerequisites
1. Google Cloud Platform account
2. Billing enabled on your GCP project
3. Imagen API enabled

## Step-by-Step Setup

### 1. Create Google Cloud Project
```bash
# Install Google Cloud CLI if not already installed
# Visit: https://cloud.google.com/sdk/docs/install

# Create a new project
gcloud projects create your-batik-project-id --name="Batik AI Studio"

# Set the project
gcloud config set project your-batik-project-id
```

### 2. Enable Imagen API
```bash
# Enable the Vertex AI API (required for Imagen)
gcloud services enable aiplatform.googleapis.com

# Enable the Imagen API
gcloud services enable imagegeneration.googleapis.com
```

### 3. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create batik-imagen-service \
    --description="Service account for Batik AI Studio" \
    --display-name="Batik Imagen Service"

# Grant necessary permissions
gcloud projects add-iam-policy-binding your-batik-project-id \
    --member="serviceAccount:batik-imagen-service@your-batik-project-id.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create batik-service-account.json \
    --iam-account=batik-imagen-service@your-batik-project-id.iam.gserviceaccount.com
```

### 4. Configure Environment Variables

#### Option A: Using Service Account JSON (Recommended)
```bash
# Add to your .env file
GOOGLE_CLOUD_PROJECT_ID="your-batik-project-id"
GOOGLE_CLOUD_LOCATION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="/path/to/batik-service-account.json"
```

#### Option B: Using API Key
```bash
# Create API key (less secure, not recommended for production)
gcloud alpha services api-keys create --display-name="Batik Studio API Key"

# Add to your .env file
GOOGLE_CLOUD_PROJECT_ID="your-batik-project-id"
GOOGLE_CLOUD_LOCATION="us-central1"
GOOGLE_CLOUD_API_KEY="your-api-key-here"
```

### 5. Test the Setup
```bash
# Test API access
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/your-batik-project-id/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict" \
  -d '{
    "instances": [
      {
        "prompt": "Traditional Indonesian batik pattern with Parang motif, seamless textile design"
      }
    ],
    "parameters": {
      "sampleCount": 1,
      "aspectRatio": "1:1"
    }
  }'
```

## Imagen API Models Available

### Current Models (as of 2024)
- `imagen-3.0-generate-001` (Latest, best quality)
- `imagen-3.0-generate-preview-0611` (Preview version)
- `imagegeneration@006` (Imagen 2)

### Recommended Model for Batik Generation
We recommend using `imagen-3.0-generate-001` for the best quality batik patterns.

## Cost Considerations

### Imagen API Pricing (approximate)
- Imagen 3.0: $0.040 per image (1024x1024)
- Imagen 2.0: $0.020 per image (1024x1024)

### Cost Optimization Tips
1. Use appropriate image dimensions (512x512 for previews)
2. Implement caching for generated patterns
3. Set up billing alerts
4. Consider batch generation for multiple variations

## Prompt Engineering for Batik Patterns

### Best Practices
```text
Effective Prompt Structure:
"Traditional Indonesian batik pattern, [MOTIF] motif from [REGION], 
[STYLE] style, [COLORS] color palette, seamless tileable design, 
textile printing quality, cultural authenticity, 2D flat pattern"

Negative Prompts:
"Avoid: photographs, realistic images, 3D effects, modern objects, 
people, landscapes, architecture, text, logos"
```

### Example Prompts
```text
1. Traditional Parang:
"Traditional Indonesian batik pattern, Parang motif from Solo, 
diagonal parallel lines, sogan brown and cream colors, 
authentic hand-drawn style, seamless textile design"

2. Modern Kawung:
"Contemporary Indonesian batik pattern, Kawung motif, 
four-petal flowers, geometric arrangement, indigo blue palette, 
modern interpretation, textile printing ready"
```

## Troubleshooting

### Common Issues
1. **Authentication Error**: Check service account permissions
2. **Quota Exceeded**: Monitor API usage in Google Cloud Console
3. **Invalid Model**: Ensure using correct model name
4. **Poor Results**: Refine prompts with more specific descriptions

### Debug Mode
Set environment variable for detailed logging:
```bash
DEBUG_IMAGEN_API=true
```

## Security Best Practices
1. Never commit service account keys to version control
2. Use IAM roles with minimal required permissions
3. Rotate API keys regularly
4. Monitor API usage and set billing alerts
5. Use VPC firewall rules if applicable

## Production Deployment
1. Use Google Cloud Run or App Engine for hosting
2. Implement proper error handling and retries
3. Set up monitoring and alerting
4. Use Cloud Storage for generated image storage
5. Implement rate limiting to control costs

## Support Resources
- [Google Cloud Imagen API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-for-using-and-managing-service-accounts)
