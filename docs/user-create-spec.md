# User Create and Delete - Test Specification

## Overview
This test creates a new user (customer) with unique data, verifies the creation via a specific email warning message (due to server configuration), and then finds and deletes the user from the customer list using their email address.

**Base URL:** http://52.91.192.7  
**Timeout:** 5 minutes  
**Test File:** user-create.spec.js

---

## Prerequisites

### Login Function
Create a helper function that logs into the application:
1. Go to the base URL
2. If the page URL contains "login":
   - Find the email field (by placeholder or label matching "email" or "username", case-insensitive)
   - Enter: admin@gmail.com
   - Find the password field (by placeholder or label matching "password", case-insensitive)
   - Enter: admin123
   - Find and click the login button (role: button, name contains "login" or "sign in")
   - If no button found, press Enter on the password field
3. Wait for the page network to be idle (10 second timeout)
4. Verify the URL no longer contains "login" (30 second timeout)

---

## Test Flow

### 1. Login
- Execute the login helper function
- Confirm successful login

### 2. Navigate to User Create
- Click the "Users" link (exact text match)
- Click the "Add User" link

### 3. Generate Unique Data
- **Timestamp:** Get current time (Date.now())
- **Email:** `testuser[timestamp]@example.com`
- **First Name:** Randomly select a name from a list (e.g., "David")
- **Phone:** `93132` + last 5 digits of timestamp

### 4. Fill the User Form

#### Customer Information
- **First Name:** Find input `name="customer[first_name]"`, click and fill with generated First Name
- **Last Name:** Find input `name="customer[last_name]"`, click and fill with "User"
- **Email:** Find textbox with name "Email", click and fill with generated Email
- **Country Code:** Find input `name="customer[country_code]"`, click and fill with "+91"
- **Phone:** Find textbox with name "Phone *", click and fill with generated Phone
- **Status:** Find select element `id="customer[status]"`, select option with value "2" (Active)

#### Address Information
- Click "Address" tab
- **Address:** Find textbox with name "Address", click and fill with "Test Address"
- **City:** Find input `name="address[city]"`, click and fill with "Test City"
- **Message:** Find input `name="address[message]"`, click and fill with "Test message from automation"

### 5. Save the User
- Find the button with text "Save & Continue"
- Click it

### 6. Verify Creation (Special Handling)
- **Note:** The page does NOT redirect after saving.
- **Success Indicator:** Wait for a specific warning message: "An email must have a 'To', 'Cc', or 'Bcc' header"
- This warning confirms the user was created but the server failed to send a welcome email.
- This serves as the success confirmation for this test.
- Since no redirect occurs, we **cannot capture the User ID**. We must rely on the **Email** for identification.

### 7. Navigate to Customer List
- Navigate directly to `${BASE_URL}/backend/customer` to ensure we are on the correct list page.
- Wait for network idle.

### 8. Search for the Created User
- Because we don't have an ID, we search by **Email**.
- Find the search input (placeholder or name contains "search", "keyword", or "id")
- If visible:
  - Clear the input
  - Type the generated **Email**
  - Press Enter
  - Wait 3 seconds for results to filter

### 9. Find the User Row
- Find the table row that contains the **username part** of the generated email (text before '@').
  - *Reasoning:* The table might truncate long emails, so matching the full email string might fail. The timestamped username is unique enough.
- Verify this row is visible (10 second timeout).

### 10. Delete the User
- Within the found row, look for the delete action:
  - Link/Button with title "Delete"
  - OR Link/Button containing a trash icon (class: fa-trash)
  - OR Link with class "btn-danger"
- Use the first match.
- Wait for it to be visible (5 second timeout).
- Click it.

### 11. Confirm Deletion
- Wait for a modal dialog to appear (class "modal", contains text "delete").
- Verify the modal is visible (10 second timeout).
- Within the modal, find the confirm button:
  - Button with class "btn-danger" inside modal footer
  - OR Button with text "Delete"
- Click it.

### 12. Verify Deletion Success
- Check that the user row is no longer visible (10 second timeout).
- Confirm the user was deleted successfully.

---

## Important Notes

### Unique Data
- Using timestamped data (Email, Phone) prevents conflicts if previous tests failed to clean up.
- Random selection for First Name ensures variety but keeps it simple (letters only).

### Special Handling for No-Redirect
- The test explicitly handles the case where the save action doesn't redirect.
- It interprets a specific server error ("An email must have...") as a success signal.
- It adapts the search strategy to use Email instead of ID.

### Search Strategy
- Searching by the "username part" of the email is robust against UI truncation of long email addresses in the table.

---

## Running the Test

### Standard run:
```bash
npx playwright test test/user-create.spec.js --project=chromium
```

### Debug mode (see browser):
```bash
npx playwright test test/user-create.spec.js --project=chromium --headed
```

### View results:
```bash
npx playwright show-report
```

---

*This specification describes the complete end-to-end test for user creation and deletion. Use it to regenerate the test script or as a reference for similar tests.*
