# Issue Close Command

Close the current issue branch by creating a pull request, approving it, merging it into master, and cleaning up the local branch. Refuses to run on the master branch. Before touching git, triggers the `/learn` flow to capture frictions from the work just finished while the context is still clean.

## Steps

1. **Capitalize on learnings first**: Before anything else — while the context is still centered on the actual work and unpolluted by git/gh output — run the full `/learn` flow (see `learn.md`).
   - `/learn` sources learnings exclusively from the user's explicit remarks in the conversation. If there are none, it stops on its own with its standard message — do not force a report. Then continue the close flow.
   - If `/learn` produces a draft report, relay its hand-off message (draft path + the `/apply-rule` follow-up), then continue the close flow.

2. Get the current branch name:
   ```bash
   git branch --show-current
   ```

3. **Safety check**: If the current branch is `master`, STOP and inform the user:
   > "Cannot close from the master branch. Switch to the issue branch first."

4. Extract the issue number from the branch name (second segment, e.g. `bugfix/2/description` → `2`).

5. Create a pull request targeting `master`:
   ```bash
   gh pr create --head {branch_name} --base master --title "{branch_name}" --fill
   ```
   - Extract the pull request number from the output.

6. Approve the pull request:
   ```bash
   gh pr review {pr_number} --approve
   ```

7. Merge the pull request:
   ```bash
   gh pr merge {pr_number} --merge
   ```

8. Switch to `master` and pull the latest changes:
   ```bash
   git checkout master && git pull
   ```

9. Delete the remote branch:
   ```bash
   git push origin --delete {branch_name}
   ```

10. Delete the local branch and prune stale remote-tracking references:
   ```bash
   git branch -D {branch_name} && git fetch origin --prune
   ```

11. Close the GitHub issue:
   ```bash
   gh issue close {issue_number}
   ```

12. Delete the applied plan file (the work is now merged, so the plan is no longer needed). `{PLAN_PATH}` resolves per the project `CLAUDE.md`:
   ```bash
   rm -f {PLAN_PATH}{issue_number}-*.md
   ```
   This is the cleanup counterpart to `/apply-plan`, which keeps the plan until merge. If no matching plan file exists (the plan was applied without this naming, or already removed), skip silently.

13. Confirm to the user:
   > "Pull request created, approved and merged. Branch `{branch_name}` deleted locally and remotely. Issue #{issue_number} closed. Plan file removed. Master branch updated."

## Error Handling

- If the pull request creation fails, report the error and stop.
- If the approval fails, report the error and stop.
- If the merge fails (e.g. conflicts), report the error and stop. Do not proceed with branch deletion.
- If the local branch deletion fails, report the error to the user.
- If the plan file deletion finds no match, do not fail — the cleanup is best-effort.
