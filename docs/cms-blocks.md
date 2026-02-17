# CMS Block Create and Delete - Test Specification

## Overview
This test creates a new CMS Block with unique data, verifies the success message, then finds and deletes it from the Blocks list using a bulk-delete style flow.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/cms-blocks.spec.js

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

### 2. Navigate to CMS -> Blocks -> Add Block
- Click link with name "CMS"
- Click paragraph containing text "Blocks"
- Click link with name " Add Block"

### 3. Fill the CMS Block Form

#### Generate Unique Data
- Create a unique identifier combining `Date.now()` and a random number
- **Title**: "Test Block [uniqueId]"
- **Content**: "This is test block content generated at [uniqueId]"
- **Slug**: "test-block-[uniqueId]"

#### Title Field
- Find textbox with name "Title"
- Fill with generated Title

#### Content Field
- Find textbox with name "Content"
- Fill with generated Content

#### Slug Field
- **Action**: Click textbox "Slug" (to ensure it's active/focused)
- **Fill**: Fill with generated Slug

### 4. Save and Verify Creation
- Click button with name "Save & Continue"
- **Verification**: Wait for text "Block created successfully." to be visible (or verify redirection to list).

### 5. Navigate Back to Block List
- Click link with name "CMS"
- Click paragraph containing text "Blocks"
- *Implicitly check*: If a "List" link exists, click it; otherwise, verify redirection to the list view.

### 6. Find the Created Block Row
- **Locator**: Find table row (`tr`) that contains the **Unique Title**.
- **Action**: Wait for this row to be visible.
  - *Reliability*: If not immediately matching, try searching using the search input (placeholder matching "search", "keyword", "title") and pressing Enter.

### 7. Delete the Block (Bulk Action Flow)
- **Select Row**: Find the checkbox (`input[type="checkbox"]`) within the identified row and check it.
- **Trigger Delete**: Click the global "Delete" button (usually found outside the table in the header/actions area).
- **Confirm Deletion**:
  - Wait for the delete confirmation modal (`#delete-form`).
  - Click the "Delete" button (or button with class `btn-danger`) inside the modal.

### 8. Verify Deletion Success
- Check that the row with the Unique Title is **no longer visible**.
- Log success message.

---

## Important Notes

### Unique Data Strategy
- The test relies on the **Title** being unique to identify the row in the list.
- Format: `Test Block [Timestamp]-[Random]` ensures high uniqueness.

### Navigation
- Standard CMS menu navigation (CMS -> Blocks -> Add Block).

### Deletion Logic
- Matches the CMS Page deletion pattern: **Check-and-Delete**.
- 1. Identify Row -> 2. Check Box -> 3. Click Global Delete -> 4. Confirm Modal.

### Error Handling
- **List Search**: Has a try-catch block to use the search bar if the new block isn't immediately visible in the list.

---

## Success Indicators

The test passes when:
1. ✓ Login is successful.
2. ✓ Navigation to "Add Block" works via UI.
3. ✓ Form is filled (Title, Content, Slug).
4. ✓ "Block created successfully." message appears.
5. ✓ Navigation back to "Block List" works.
6. ✓ The specfic row is found by its unique Title.
7. ✓ Row checkbox is checked and Global Delete is clicked.
8. ✓ Deletion is confirmed in the modal.
9. ✓ The row disappears from the list.

## Running the Test

```bash
npx playwright test test/cms-blocks.spec.js --project=chromium --headed
```
