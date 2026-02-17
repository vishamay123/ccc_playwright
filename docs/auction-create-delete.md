# Auction Create and Delete - Test Specification

## Overview
This test creates a new auction, captures its ID, then finds and deletes it from the auction list.

**Base URL:** http://52.91.192.7  
**Timeout:** 5 minutes  
**Test File:** auction-create.spec.js

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

### 2. Navigate to Auction Create
- Click the "Auction" link (exact text match)
- Click the "Auction Create" link (text contains a space before "Auction Create")

### 3. Fill the Auction Form

#### Description Field
- Find the description textbox inside a div that contains the text "Description * NormalQuoteCodeHeader 1Header 2Header 3Header 4Header 5Header"
- Click it
- Type: test

#### Meta Title
- Click the text "Meta title *"
- Find the textbox with accessible name "Meta title"
- Type: test

#### Meta Description
- Find the textarea with name attribute "en[meta_description]"
- Click it
- Type: test

#### Meta Keywords
- Click the text "Meta keywords *"
- Find the textbox with accessible name "Meta keywords"
- Type: test

#### Assign Artwork
- Click the text "Assign Artwork *Select"
- Find the dropdown labeled "Assign Artwork"
- Count how many options it has
- If more than 1 option: select the option at index 1 (second option)
- Otherwise: select the option at index 0 (first option)

#### Auction Date
- Find and click the textbox with accessible name "Auction date"
- Try to click the calendar header (text: "SuMoTuWeThFrSa12345678910111213141516171819202122232425262728")
  - If this fails, continue anyway (it's not critical)
- Click the link with text "17" (use the first match if multiple)

#### Estimate
- Find the input with name attribute "estimate"
- Click it
- Type: 12

#### Auction Start Time
- Find the element with ID "auction_start_time"
- Click it
- Try to click the text "TimeHourMinuteTime Zone-1200-"
  - If this fails, continue anyway (it's not critical)

#### Auction End Time
- Find the element with ID "auction_end_time"
- Click it
- Find the first div inside a dl element
- Click it

#### Status
- Find the dropdown labeled "Status"
- Select the option with value "1"

### 4. Save the Auction
- Find the button with text "Save & Continue" (case-insensitive)
- Click it

### 5. Capture the Created Auction ID
- Wait for the URL to change to a pattern containing "/edit/" or "/auction/" or "?id=" (30 second timeout)
- Get the current page URL
- Extract the ID number from the URL:
  - Look for pattern: /edit/[number]
  - Or look for pattern: id=[number]
- If no ID found, stop the test with an error
- Remember this ID for later steps

### 6. Navigate to Auction List
- Click the "Auction" link (exact text match)
- Try to click the "Auction List" link
  - If not found, assume we're already on the list page
- Wait for the page network to be idle

### 7. Search for the Created Auction
- Find the search input (placeholder or name contains "search", "keyword", or "id", case-insensitive)
- If the search input is visible:
  - Type the captured auction ID
  - Press Enter
  - Wait 2 seconds for the results to filter

### 8. Find the Auction Row
- Find the table row that contains the auction ID text
- Use the first match
- Verify this row is visible (10 second timeout)

### 9. Delete the Auction
- Within the auction row, find the delete action:
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
- Check that the auction row is no longer visible (10 second timeout)
- Confirm the auction was deleted successfully

---

## Important Notes

### Selector Priorities
1. Always prefer finding elements by their role or label (more accessible and stable)
2. Use text matching with case-insensitive regex when possible
3. When multiple elements match, use the first one
4. For fallback selectors, chain them with OR logic

### Error Handling
- Some calendar and time picker interactions are wrapped in try-catch because they're not critical
- If they fail, the test continues
- Critical steps will stop the test if they fail

### Timeouts
- Element visibility checks: 10 seconds
- URL navigation: 30 seconds
- Network idle: 10 seconds
- Delete action visibility: 5 seconds
- Search filter wait: 2 seconds

### Dynamic Content
- The artwork dropdown selection is dynamic (checks option count first)
- The auction ID is extracted from the URL after creation
- The search/filter step is conditional (only if search input exists)

---

## Success Indicators

The test passes when:
1. ✓ Login completes successfully
2. ✓ All form fields are filled
3. ✓ Auction is saved and redirects to edit page
4. ✓ Auction ID is captured from URL
5. ✓ Auction is found in the list
6. ✓ Delete button is clicked
7. ✓ Confirmation modal appears and is confirmed
8. ✓ Auction row disappears from the list

**Expected Duration:** 30-45 seconds

---

## Running the Test

### Standard run:
```
npx playwright test test/auction-create.spec.js --project=chromium
```

### Debug mode (see browser):
```
npx playwright test test/auction-create.spec.js --project=chromium --headed
```

### View results:
```
npx playwright show-report
```

---

## Maintenance Guide

### Update this spec when:
- Form fields are added, removed, or renamed
- Navigation menu structure changes
- Modal confirmation messages change
- Delete button location or styling changes

### Common troubleshooting:
- **Calendar fails to open:** The calendar header text is very specific and may change with UI updates
- **Time picker doesn't work:** This is non-critical and wrapped in error handling
- **Can't find auction in list:** Check if search functionality changed or if ID format changed
- **Modal doesn't appear:** Verify modal class names and structure haven't changed

---

*This specification describes the complete end-to-end test for auction creation and deletion. Use it to regenerate the test script or as a reference for similar tests.*
