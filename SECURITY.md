# 🔒 Security Policy

## Supported Versions

We actively support security updates for the current version of the application.

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue. Instead:

1. Email security concerns to: security@restaurantstartupapp.com
2. Include details about the vulnerability
3. We will respond within 48 hours

## Security Best Practices

### API Keys and Secrets

- ✅ **NEVER** commit API keys to the repository
- ✅ Use `.env.local` for local development (already in `.gitignore`)
- ✅ Use environment variables in production
- ✅ Rotate keys immediately if exposed
- ✅ Use different keys for development and production

### Environment Variables

All sensitive configuration should be stored in environment variables:

```env
# Local development (.env.local - NOT committed)
REACT_APP_OPENAI_API_KEY=your_key_here
REACT_APP_FIREBASE_API_KEY=your_key_here
```

### File Security

The following files are **NEVER** committed:
- `.env.local`
- `.env.development.local`
- `.env.production.local`
- Any file containing `*.key`, `*.pem`, or credentials

### Code Security

- ✅ No hardcoded API keys in source code
- ✅ No credentials in comments
- ✅ API keys only read from `process.env`
- ✅ Error messages don't expose sensitive data

## If You Find an Exposed Key

1. **Immediately revoke** the exposed key
2. **Generate a new key** from your provider
3. **Update** your local `.env.local` file
4. **Check** for unauthorized usage in your provider dashboard
5. **Report** if found in a public repository

## Production Deployment

For production deployments:

1. **Use backend API** to proxy AI requests (recommended)
2. **Store keys** in secure environment variables
3. **Never expose** keys in client-side JavaScript
4. **Implement rate limiting** to prevent abuse
5. **Monitor usage** regularly

## Security Checklist

Before deploying:
- [ ] No API keys in source code
- [ ] `.env.local` not in repository
- [ ] Environment variables properly configured
- [ ] Error handling doesn't expose sensitive data
- [ ] Dependencies are up to date
- [ ] Security headers configured

---

**Remember:** Security is everyone's responsibility. When in doubt, ask!

