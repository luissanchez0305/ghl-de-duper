# Deploying to Vercel

This guide will help you deploy your GHL Contact De-Duper application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All environment variables configured

## Environment Variables

Before deploying, make sure you have the following environment variables set in your Vercel project:

### Required Environment Variables

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_GHL_CLIENT_ID=your_ghl_client_id
VITE_GHL_CLIENT_SECRET=your_ghl_client_secret
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add your environment variables in the project settings

6. Deploy!

## API Endpoints

After deployment, your API will be available at:

- **Health Check**: `https://your-domain.vercel.app/api/health`
- **OAuth Token Exchange**: `https://your-domain.vercel.app/api/oauth/token`
- **Get Accounts**: `https://your-domain.vercel.app/api/accounts`
- **Search Contacts**: `https://your-domain.vercel.app/api/contacts/search`
- **Merge Contacts**: `https://your-domain.vercel.app/api/contacts/merge`

## Local Development

For local development, you can still use the original server:

```bash
npm run dev:backend
```

This will start the Fastify server on `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   - Make sure all environment variables are set in Vercel dashboard
   - Check that variable names match exactly (including `VITE_` prefix)

2. **API Routes Not Working**
   - Verify the `vercel.json` configuration
   - Check that the `api/index.js` file exists
   - Ensure all dependencies are in `package.json`

3. **CORS Issues**
   - The API is configured to allow all origins in development
   - For production, you may want to restrict CORS to your domain

### Debugging

1. Check Vercel function logs in the dashboard
2. Use the Vercel CLI to view logs:
   ```bash
   vercel logs your-project-name
   ```

## Production Considerations

1. **Environment Variables**: Never commit sensitive environment variables to your repository
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Consider implementing rate limiting for API endpoints
4. **Monitoring**: Set up monitoring and alerting for your API endpoints

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the function logs in your Vercel dashboard
3. Ensure all dependencies are properly installed 