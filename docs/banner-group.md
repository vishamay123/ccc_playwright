# Banner Group Create and Delete - Test Specification

## Overview
This test creates a new banner group with unique data, captures its ID, then finds and deletes it from the banner group list.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** banner-group.spec.js

---

## Prerequisites

### Login Function
Use the existing login helper from the helpers folder:
1. Import the login helper: `require('./helpers/login')`
2. Call the login function with the page object
3. Wait for redirect to dashboard (URL contains "dashboard", 30 second timeout)

---

## Test Flow

### 1. Login
- Execute the login helper function
- Verify the URL contains "dashboard"
- Confirm successful login

### 2. Navigate to Banner Group List
- Go directly to the URL: BASE_URL + /backend/bannergroup
- Verify the URL contains "bannergroup"

### 3. Create New Banner Group
- Find the button with role "button" and name "Create"
- Click it

### 4. Fill the Banner Group Form

#### Generate Unique Data
- Create a unique identifier using current timestamp
- Generate name: "Test Banner Group - [timestamp]"
- Generate code: "CODE-[timestamp]"

#### Name Field
- Find the textbox with role "textbox" and name matching "name" (case-insensitive)
- Fill with the generated name

#### Code Field
- Find the input with name attribute containing "code"
- Or use the second textbox on the page (index 1)
- Fill with the generated code

#### Sort Order Field
- Find the input with name attribute containing "sort_order"
- Or find element with role "spinbutton"
- Or find input with type "number"
- Fill with: 1

#### Status Field (Active)
- Use JavaScript to set the status checkbox
- Find the checkbox with name attribute "status"
- Set its checked property to true

### 5. Save the Banner Group
- Find the button with role "button" and name matching "save & continue" (case-insensitive)
- Click it

### 6. Capture the Created Banner Group ID
- Wait for the URL to match pattern: /edit/[number] (30 second timeout)
- Get the current page URL
- Extract the ID number from the URL using pattern: /edit/[number]
- If no ID found, stop the test with an error
- Remember this ID for later steps

### 7. Navigate Back to Banner Group List
- Go directly to the URL: BASE_URL + /backend/bannergroup

### 8. Find the Created Banner Group Row

#### Strict ID Matching (Primary Method)
- Create a regex pattern that matches the ID exactly with optional whitespace: `^\s*[ID]\s*$`
- Find the table row that contains a table cell matching this exact pattern
- Use the first match

#### Fallback Matching (If Strict Fails)
- If no row found with strict matching
- Find the table row that contains the ID text anywhere
- Use the first match

#### Verify Row Exists
- Verify the row is visible (10 second timeout)
- Optionally log the row content for debugging

### 9. Delete the Banner Group
- Within the banner group row, find the delete action:
  - Look for a link or button with title "Delete"
  - Or a link or button containing a trash icon (class: fa-trash)
  - Or a link with class "btn-danger"
- Use the first match
- Wait for it to be visible (5 second timeout)
- Click it

### 10. Confirm Deletion
- Wait for a modal dialog to appear
- The modal should have class "modal" and contain the word "delete" (case-insensitive)
- Verify the modal is visible (10 second timeout)
- Within the modal, find the confirm button:
  - Look in the modal footer for a button with class "btn-danger"
  - Or any button with text "Delete"
- Use the first match
- Click it

### 11. Verify Deletion Success
- Check that the banner group row is no longer visible (10 second timeout)
- Confirm the banner group was deleted successfully

---

## Important Notes

### Unique Data Generation
- Use timestamp (Date.now()) to ensure unique names and codes
- This prevents conflicts with existing data
- Makes it easy to identify test data

### Selector Priorities
1. Always prefer finding elements by their role or accessible name
2. Use attribute selectors (name, type) as fallback
3. Use nth() selectors only when necessary
4. For ID matching in tables, use strict regex first, then fallback to loose match

### ID Matching Strategy
- **Strict Match**: Uses regex `^\s*[ID]\s*$` to match ID exactly in a table cell
- **Fallback Match**: Uses simple text contains if strict match fails
- This two-tier approach handles different table formatting

### Status Checkbox
- Uses JavaScript evaluation to set the checkbox
- This is more reliable than clicking when the checkbox might be hidden or styled

### Error Handling
- Critical steps will stop the test if they fail
- Row matching has a fallback mechanism
- Logging is used throughout for debugging

### Timeouts
- Element visibility checks: 10 seconds
- URL navigation: 30 seconds
- Delete action visibility: 5 seconds
- Overall test timeout: 120 seconds (2 minutes)

---

## Success Indicators

The test passes when:
1. ✓ Login completes and redirects to dashboard
2. ✓ Banner group list page loads
3. ✓ Create form opens
4. ✓ All form fields are filled with unique data
5. ✓ Banner group is saved and redirects to edit page
6. ✓ Banner group ID is captured from URL
7. ✓ Banner group is found in the list by exact ID
8. ✓ Delete action is clicked
9. ✓ Confirmation modal appears and is confirmed
10. ✓ Banner group row disappears from the list

**Expected Duration:** 15-30 seconds

---

## Running the Test

### Standard run:
```
npx playwright test test/banner-group.spec.js --project=chromium
```

### Debug mode (see browser):
```
npx playwright test test/banner-group.spec.js --project=chromium --headed
```

### View results:
```
npx playwright show-report
```

---

## Maintenance Guide

### Update this spec when:
- Form fields are added, removed, or renamed
- Navigation URLs change
- Modal confirmation messages change
- Delete button location or styling changes
- Table structure changes (affects ID matching)

### Common troubleshooting:
- **ID not captured:** Check if URL pattern after save has changed
- **Row not found:** Verify table structure and ID column position
- **Status checkbox fails:** Check if checkbox name attribute changed
- **Modal doesn't appear:** Verify modal class names and structure haven't changed
- **Strict ID match fails:** The fallback loose match should handle this, but check table cell formatting

---

## Key Differences from Auction Test

1. **Uses external login helper** instead of inline function
2. **Direct URL navigation** to banner group list (no menu clicking)
3. **Timestamp-based unique data** for name and code
4. **JavaScript evaluation** for status checkbox
5. **Two-tier ID matching** (strict regex + fallback)
6. **Shorter timeout** (2 minutes vs 5 minutes)

---

*This specification describes the complete end-to-end test for banner group creation and deletion. Use it to regenerate the test script or as a reference for similar tests.*
