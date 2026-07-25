# Goal
Execute the tests and correct the ones that fail.

# Context
Use this command after modifying source code when tests need to be updated.

# Workflow

## Step 1: Run Tests
Run `npm test` to identify failing tests.

## Step 2: Correct Tests
**Agent**: `test-creator-updater`
**Input**: Context from current project

The agent will:
1. Identify modified source files via git
2. Create or update corresponding test files
3. Apply all testing rules from `memory-bank/rules/tests/`
4. Run tests to verify corrections

## Step 3: Verify
If tests still fail after agent completes, repeat Step 2.

Exit condition: **All tests pass**

# Success Criteria
- All failing tests corrected
- All tests pass
- Test files follow vuemann testing rules