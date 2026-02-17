# Mail Template Create and Delete - Test Specification

## Overview
This test creates a new Mail Template with unique data (Name, Slug, Subject), verifies the creation, then finds and deletes it from the list using a bulk-delete style flow.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/mail-templates.spec.js

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

### 2. Navigate to CMS -> Mail Templates -> Add
- Click link with name "CMS"
- Click paragraph containing text "Mail Templates"
- Click link with name " Add"

### 3. Fill the Mail Template Form

#### Generate Unique Data
- **Name**: "Test Template [uniqueId]"
- **Slug**: "test-template-[uniqueId]"
- **Subject**: "Test Subject [uniqueId]"
- **Body**: "This is a test mail template body generated at [uniqueId]"
- **CC/BCC**: "test@example.com"

#### Name Field
- Click input `input[name="mail[name]"]`
- Fill with generated Name

#### Slug Field
- Click textbox with name "Slug"
- Fill with generated Slug

#### Subject Field
- Click input `input[name="mail[subject]"]`
- Fill with generated Subject

#### Body Field (Rich Text/Complex)
- **Locator**: `locator('#custom-tabs-three-page-info div').filter({ hasText: 'Body * NormalQuoteCodeHeader' }).getByRole('textbox')`
- **Action**: Click and Fill with generated Body content
- *Fallback*: If specific locator fails, use a broader filter for 'Body'.

#### CC & BCC Fields
- **CC**: `input[name="mail[cc]"]` -> Click & Fill with email
- **BCC**: `input[name="mail[bcc]"]` -> Click & Fill with email

### 4. Save and Verify Creation
- Click button with name "Save & Continue"
- **Verification**: Wait for success message (e.g., "Mail Template created successfully") or redirection.

### 5. Navigate Back to List
- Click link with name "CMS"
- Click paragraph containing text "Mail Templates"
- Click link with name " List" (if visible/available)

### 6. Find the Created Template Row
- **Locator**: Find table row (`tr`) that contains the **Unique Name**.
- **Action**: Wait for this row to be visible.
  - *Reliability*: If not immediately matching, try searching using the search input (placeholder matching "search", "keyword", "name") and pressing Enter.

### 7. Delete the Template (Bulk Action Flow)
- **Select Row**: Find the checkbox (`input[type="checkbox"]`) within the identified row and check it.
- **Trigger Delete**: Click the global "Delete" button.
- **Confirm Deletion**:
  - Wait for the delete confirmation modal (`#delete-form`).
  - Click the "Delete" button inside the modal.

### 8. Verify Deletion Success
- Check that the row with the Unique Name is **no longer visible**.
- Log success message.

---

## Important Notes

### Unique Data Strategy
- The test relies on the **Name** and **Slug** being unique.
- Random ID appended to strings ensures isolation between test runs.

### Navigation
- Follows the user-specified path: CMS -> Mail Templates -> Add.

### Locators
- Uses robust locators combining Role, Text Filtering, and Attribute Selectors (`input[name="..."]`) as requested.
- Specific complex locator used for the **Body** field to target the rich text editor correct area.

---

## Success Indicators

The test passes when:
TBD - Standard CRUD success flows (Create -> Verify in List -> Delete -> Verify Removal).

## Running the Test

```bash
npx playwright test test/mail-templates.spec.js --project=chromium --headed
```
