# GitHub Repository Secrets Setup Guide

This guide will help you configure all the required GitHub repository secrets for your CI/CD pipeline to work properly.

## How to Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret from the list below

## Required Secrets

### 🔐 Docker Registry Access
```
GITHUB_TOKEN
```
**Value**: Your GitHub Personal Access Token with `write:packages` permission
**How to create**: 
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `write:packages` scope
3. Copy the token

### 🗄️ Database Configuration

#### Staging Environment
```
STAGING_DATABASE_URL
```
**Value**: `postgresql://username:password@host:port/database_name`
**Example**: `postgresql://tresno_user:my_secure_password@db.staging.com:5432/tresno_boedoyo_staging`

```
STAGING_DB_USER
```
**Value**: Database username for staging

```
STAGING_DB_PASSWORD
```
**Value**: Database password for staging

#### Production Environment
```
PROD_DATABASE_URL
```
**Value**: `postgresql://username:password@host:port/database_name`
**Example**: `postgresql://tresno_user:ultra_secure_password@db.prod.com:5432/tresno_boedoyo_prod`

```
PROD_DB_USER
```
**Value**: Database username for production

```
PROD_DB_PASSWORD
```
**Value**: Database password for production

```
PROD_DB_REPLICATION_PASSWORD
```
**Value**: Password for database replication user (production only)

### 🔑 JWT Configuration
```
STAGING_JWT_SECRET
```
**Value**: A secure random string for JWT token signing in staging
**Generate**: `openssl rand -base64 32`

```
PROD_JWT_SECRET
```
**Value**: A secure random string for JWT token signing in production
**Generate**: `openssl rand -base64 32`

### 🌐 API URLs
```
STAGING_API_URL
```
**Value**: `https://api-staging.tresno-boedoyo.com`

```
PROD_API_URL
```
**Value**: `https://api.tresno-boedoyo.com`

### ⛓️ Web3 Configuration
```
STAGING_RPC_URL
```
**Value**: Ethereum testnet RPC URL (e.g., Sepolia)
**Example**: `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID`

```
PROD_RPC_URL
```
**Value**: Ethereum mainnet RPC URL
**Example**: `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`

```
STAGING_WEB3_PRIVATE_KEY
```
**Value**: Private key for Web3 operations in staging (testnet)
**⚠️ Warning**: Never use mainnet private keys in staging!

```
PROD_WEB3_PRIVATE_KEY
```
**Value**: Private key for Web3 operations in production
**⚠️ Warning**: Keep this extremely secure!

### 🖥️ Server Access
```
SERVER_HOST
```
**Value**: IP address or hostname of your deployment server
**Example**: `203.0.113.1` or `server.tresno-boedoyo.com`

```
SERVER_USERNAME
```
**Value**: SSH username for server access
**Example**: `deploy` or `ubuntu`

```
SERVER_SSH_KEY
```
**Value**: Private SSH key for server access (entire key including headers)
**Example**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAFwAAAAdzc2gtcn
...
-----END OPENSSH PRIVATE KEY-----
```

### 📊 Monitoring
```
GRAFANA_ADMIN_PASSWORD
```
**Value**: Password for Grafana admin user
**Generate**: Use a strong password generator

### 💬 Notifications (Optional)
```
SLACK_WEBHOOK_URL
```
**Value**: Slack webhook URL for deployment notifications
**How to get**: 
1. Go to Slack → Apps → Incoming Webhooks
2. Create new webhook for your channel
3. Copy the URL

## Security Best Practices

### 🔒 Password Security
- Use strong, unique passwords for each environment
- Never reuse passwords between staging and production
- Consider using a password manager to generate secure passwords

### 🔑 Private Key Security
- Never commit private keys to Git
- Use different private keys for staging and production
- Store private keys securely and limit access

### 🌍 Environment Separation
- Keep staging and production completely separate
- Use different databases, API keys, and credentials
- Test in staging before deploying to production

### 📝 Documentation
- Document which team members have access to which secrets
- Regularly rotate sensitive credentials
- Monitor access logs for unusual activity

## Validation Commands

After setting up all secrets, you can validate your configuration:

```bash
# Test staging deployment
./deploy.ps1 -Environment staging

# Test production deployment (be careful!)
./deploy.ps1 -Environment production
```

## Troubleshooting

### Common Issues:

1. **Docker login fails**
   - Check `GITHUB_TOKEN` has correct permissions
   - Verify token hasn't expired

2. **Database connection fails**
   - Verify database URLs and credentials
   - Check network connectivity from server

3. **SSH connection fails**
   - Verify `SERVER_SSH_KEY` format
   - Check server firewall settings
   - Confirm username and hostname

4. **Web3 operations fail**
   - Check RPC URL is accessible
   - Verify private key format and permissions
   - Ensure sufficient balance for gas fees

### Getting Help:
- Check GitHub Actions logs for detailed error messages
- Verify all secret names match exactly (case-sensitive)
- Test individual components before full deployment

## Final Checklist ✅

Before running your first deployment:

- [ ] All database secrets configured
- [ ] JWT secrets generated and added
- [ ] Web3 RPC URLs and private keys set
- [ ] Server SSH access configured
- [ ] Docker registry access token added
- [ ] Monitoring passwords set
- [ ] Environment files created locally
- [ ] Docker Compose files reviewed
- [ ] Deployment scripts tested

🎉 **You're ready to deploy!** 

Run your first deployment with:
```powershell
.\deploy.ps1 -Environment staging
```
