# GitHub Pages Setup Instructions

## ⚠️ Manual Setup Required

GitHub Pages must be manually enabled in your repository settings before the GitHub Actions workflow can deploy.

## Steps to Enable GitHub Pages:

1. **Go to your repository on GitHub:**
   - Navigate to: https://github.com/chefmatt2024/restaurant-startup-app

2. **Open Settings:**
   - Click on the **Settings** tab (top menu)

3. **Go to Pages:**
   - In the left sidebar, click **Pages**

4. **Configure Build and Deployment:**
   - Under **Build and deployment**:
     - **Source**: Select **"GitHub Actions"**
     - Click **Save**

5. **Verify Workflow Permissions:**
   - Go to **Actions** > **General** in Settings
   - Under **Workflow permissions**:
     - Select **"Read and write permissions"**
     - Check **"Allow GitHub Actions to create and approve pull requests"**
     - Click **Save**

6. **Re-run the Workflow:**
   - Go to the **Actions** tab
   - Find the latest failed workflow run
   - Click **"Re-run all jobs"**

## After Setup:

Once GitHub Pages is enabled, your site will be available at:
- `https://chefmatt2024.github.io/restaurant-startup-app/`

The workflow will automatically deploy on every push to the `main` branch.

## Troubleshooting:

If you still see errors:
- Make sure you're the repository owner or have admin access
- Verify the repository is public (or you have GitHub Pro/Team for private repos)
- Check that the workflow file is in `.github/workflows/deploy.yml`
- Ensure all required secrets are set in Settings > Secrets and variables > Actions

