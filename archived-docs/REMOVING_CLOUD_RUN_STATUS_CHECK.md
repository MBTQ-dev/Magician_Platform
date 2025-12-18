# Removing Cloud Run Status Check

## Issue

A GitHub status check named "rmgpgab-magician-platform-europe-west1-MBTQ-dev-Magician-Plaweu (business-magician-bd630)" is configured but stuck in a "Queued - Waiting to run this check..." state.

## Investigation Findings

After thorough investigation of the repository:

1. **No workflow files** contain this check name in `.github/workflows/`
2. **No references** found in any codebase files (searched for: rmgpgab, europe-west1, Plaweu, business-magician-bd630)
3. The only related file is `deploy-to-cloud-run.sh` which references a GCP project "business-magician" but not this specific check

## Root Cause

This appears to be a **GitHub branch protection rule** or **required status check** that was configured externally (not through workflow files) and is now:
- Either misconfigured
- Pointing to a non-existent service
- Or stuck in a queued state

## Resolution

Since this check is not defined in the repository's workflow files, it must be removed through GitHub's repository settings:

### Steps to Remove (Repository Admin Required)

1. Navigate to the repository settings:
   ```
   https://github.com/MBTQ-dev/Magician_Platform/settings
   ```

2. Go to **Branches** in the left sidebar

3. Click on the branch protection rule for your main branch (usually `main` or `develop`)

4. Scroll down to **Require status checks to pass before merging**

5. Look for the check named:
   ```
   rmgpgab-magician-platform-europe-west1-MBTQ-dev-Magician-Plaweu (business-magician-bd630)
   ```

6. **Uncheck or remove** this status check from the required checks list

7. Click **Save changes** at the bottom of the page

### Alternative: Using GitHub CLI (if available)

If you have the GitHub CLI with appropriate permissions:

```bash
# List current branch protection rules
gh api repos/MBTQ-dev/Magician_Platform/branches/main/protection

# Update branch protection to remove the specific check
# (This requires crafting a full branch protection update payload)
```

## Verification

After removal:
1. Check that pull requests no longer show this check as pending
2. Verify that other required checks still function correctly
3. Confirm that the branch protection rules are still appropriate for your workflow

## Related Files

- `deploy-to-cloud-run.sh` - Contains GCP deployment configuration but doesn't create this status check
- `.github/workflows/` - No workflows reference this check name

## Conclusion

This is a repository configuration issue that requires admin access to GitHub repository settings to resolve. The check appears to be an orphaned or misconfigured external status check that is no longer needed.
