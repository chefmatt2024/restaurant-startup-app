# Fix: Firebase Functions Deploy — Storage Permission Error

If you see:
```
Access to bucket gcf-sources-XXXXX-us-central1 denied. You must grant Storage Object Viewer 
permission to XXXXX-compute@developer.gserviceaccount.com
```

Follow these steps in **Google Cloud Console**.

---

## Option A: IAM (easiest — try this first)

1. Open **IAM**: https://console.cloud.google.com/iam-admin/iam?project=restaurant-startup-app  
2. Click **+ GRANT ACCESS**
3. **New principals:** paste `712703384904-compute@developer.gserviceaccount.com`
4. **Role:** search for **Storage Object Viewer** → select it
5. Click **Save**
6. Retry: `firebase deploy --only functions`

---

## Option B: Bucket permissions (if A doesn’t work)

1. **Open Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Select project: **restaurant-startup-app**

2. **Go to Cloud Storage**
   - Menu (≡) → **Cloud Storage** → **Buckets**
   - Or: [console.cloud.google.com/storage/browser](https://console.cloud.google.com/storage/browser?project=restaurant-startup-app)

3. **Locate the Functions bucket**
   - Find the bucket named `gcf-sources-712703384904-us-central1`
   - (Name format: `gcf-sources-<project-number>-us-central1`)

4. **Grant Storage Object Viewer**
   - Click the bucket name
   - Open the **Permissions** tab
   - Click **Grant access**
   - **New principals:** `712703384904-compute@developer.gserviceaccount.com`
   - **Role:** **Storage Object Viewer**
   - Click **Save**

5. **Retry deploy**
   ```powershell
   cd "c:\Iterum Innovation\App-starting a business"
   firebase deploy --only functions
   ```

---

## If the bucket doesn't exist yet

Run the deploy once to create it, then add the permission and deploy again. The error can appear on the first deploy if the default service account doesn't have access yet.

---

## "Build error details not available" (new error after Storage fix)

If you now see **Build failed: Build error details not available** with a link to Cloud Build logs, the Cloud Build service account often needs **Artifact Registry** access.

### Fix: Grant Artifact Registry Writer to Cloud Build

1. Open **IAM**: https://console.cloud.google.com/iam-admin/iam?project=restaurant-startup-app
2. Click **+ GRANT ACCESS**
3. **New principals:** `712703384904@cloudbuild.gserviceaccount.com` (Cloud Build service account - different from compute)
4. **Role:** search for **Artifact Registry Writer** and select it
5. Click **Save**
6. Retry: `firebase deploy --only functions`

### Check the actual error (optional)

Open [Cloud Build builds](https://console.cloud.google.com/cloud-build/builds?project=712703384904), sign in, click the failed build, and view the logs. The error can appear on the first deploy if the default service account doesn’t have access yet.
