# CMS Page Create and Delete - Test Specification

## Overview
This test creates a new CMS Page with unique data, verifies the success message, then finds and deletes it from the Pages list using a bulk-delete style flow.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/cms-pages.spec.js

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

### 2. Navigate to CMS -> Pages -> Add
- Click link with name "CMS"
- Click paragraph containing text "Pages"
- Click link with name " Add"

### 3. Fill the CMS Page Form

#### Generate Unique Data
- Create a unique identifier combining `Date.now()` and a random number (e.g., `1771233855879-988`)
- **Title**: "Test Page [uniqueId]"
- **Body**: "This is a test page body generated at [uniqueId]"
- **Meta Title**: "Meta Title [uniqueId]"
- **Meta Description**: "Meta Description [uniqueId]"
- **Slug**: Same as Title (e.g., "Test Page [uniqueId]")

#### Title Field
- Find textbox with name "Title" (exact match)
- Fill with generated Title

#### Body Field (Rich Text/Complex)
- **Primary Strategy**: Look for specific structure `div` inside `#general-form` filtered by text "Body * NormalQuoteCodeHeader". Find textbox within it.
- **Fallback Strategy**: If primary fails, look for `div` inside `#general-form` filtered by text "Body", take the last one, and find textbox within it.
- Fill with generated Body text.

#### Meta Fields
- Find textbox with name "Meta Title" -> Fill with generated Meta Title
- Find textbox with name "Meta Description" -> Fill with generated Meta Description

#### Slug Field
*Ensure this is filled AFTER Meta Description*
- **Step 1**: Click element with text "Slug * Generate" (this might auto-generate or reveal the field).
- **Step 2**: Find textbox with name "Slug".
- **Step 3**: Fill with the generated Title key.

### 4. Save and Verify Creation
- Click button with name "Save & Continue"
- **Verification**: Wait for text "Page created successfully." to be visible.

### 5. Navigate Back to Page List
- Click link with name "CMS"
- Click paragraph containing text "Pages"
- Click link with name " List"

### 6. Find the Created Page Row
- **Locator**: Find table row (`tr`) that contains the **Unique Title**.
- **Action**: Wait for this row to be visible.
  - *Reliability*: If not immediately matching, try searching using the search input (placeholder matching "search", "keyword", "title") and pressing Enter.

### 7. Delete the Page (Bulk Action Flow)
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
- Format: `Test Page [Timestamp]-[Random]` ensures high uniqueness even if tests run frequently.

### Navigation
- Unlike other tests that might use direct URLs, this test explicitly walks through the **Menu UI** (CMS -> Pages -> Add/List) as requested by the user.

### Deletion Logic
- This test uses a **Check-and-Delete** pattern (Bulk Action style) rather than a single-click row action.
- 1. Identify Row -> 2. Check Box -> 3. Click Global Delete -> 4. Confirm Modal.

### Error Handling
- **Body Field**: Has a try-catch block to handle potential DOM structure variations for the rich text editor.
- **List Search**: Has a try-catch block to use the search bar if the new page isn't immediately visible in the list (e.g., due to pagination).

---

## Success Indicators

The test passes when:
1. ✓ Login is successful.
2. ✓ Navigation to "Add Page" works via UI.
3. ✓ Form is filled (Title, Body, Meta, Slug).
4. ✓ "Page created successfully." message appears.
5. ✓ Navigation back to "Page List" works.
6. ✓ The specfic row is found by its unique Title.
7. ✓ Row checkbox is checked and Global Delete is clicked.
8. ✓ Deletion is confirmed in the modal.
9. ✓ The row disappears from the list.

## Running the Test

```bash
npx playwright test test/cms-pages.spec.js --project=chromium --headed
```
