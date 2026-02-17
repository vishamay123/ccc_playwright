# CMS Menu Create and Delete - Test Specification

## Overview
This test creates a new CMS Menu item with unique data, handling complex dropdown interactions, and then verifies its creation before deleting it using a bulk-action workflow.

**Base URL:** http://52.91.192.7  
**Timeout:** 2 minutes  
**Test File:** test/cms-menus.spec.js

---

## Prerequisites

### Login Function
Use the existing login helper from the helpers folder:
1. Import the login helper: `require('./helpers/login')`
2. Call the login function with the page object
3. Wait for redirect to dashboard

---

## Test Flow

### 1. Login
- Execute the login helper function
- Verify successful login (implicit via helper)

### 2. Navigate to Add Menu
- Click link with name "Menu" (exact match)
- Click link with name " Add Menu"

### 3. Fill the Menu Form

#### Generate Unique Data
- Create a unique identifier using current timestamp (`Date.now()`)
- Generate label: "Test Menu [timestamp]"
- Generate CSS Class: "test-class-[timestamp]"
- Generate Icon: "fa-test-[timestamp]"

#### Label Field
- Find input with name `menu[label]`
- Fill with generated label

#### Parent/Module Selection (Complex Dropdown)
- Click the " -- Select -- " title to open dropdown
- Search for "da" in the input `input[type="search"]`
- Wait/Find specific tree items:
  - Click "Dashboard" (Label/Text)
  - Click "Dashboard Page" (Treeitem role)
- *Note: Wrap in try/catch or simple steps as this is environment specific*

#### CSS Class & Icon
- Find input `menu[css_class]` and fill
- Find input `menu[icon]` and fill

#### Sort Order
- Find input by placeholder "Sort Order"
- Fill with "1"

#### Toggles / Sliders
- Interact with specific sliders using nth-child selectors:
  - `label:nth-child(12) > .slider`
  - `label:nth-child(14) > .slider`
- Check visibility before clicking

### 4. Save the Menu
- Click button "Save & Continue"

### 5. Verify & Navigate to List
- Click link "Menu" (exact: true)
- Click link " Menu List"

### 6. Locate and Delete the Item
- Find `listitem` role that contains text: `[menuLabel] |`
- **Verify Visibility**: Ensure the item is visible on the list

#### Deletion Interaction (Bulk/Row Action)
1. **Select Row**: Click the label span within the filtered list item (`locator('label span')`)
2. **Toggle Action**: Click the button within the filtered list item (`getByRole('button')`)
3. **Trigger Delete**: Click the global "Delete" button on the page
4. **Confirm Modal**: Click "Delete" button inside the selector `#delete-form`

### 7. Verify Deletion Success
- Verify the list item with the menu label is no longer visible

---

## Important Notes

### Unique Data
- Using `Date.now()` is critical for the Label to ensure the Deletion step finds the correct unique item in the list.

### Selectors
- **Navigation**: Use `exact: true` for the top-level "Menu" link to avoid confusion with "Add Menu" or "Menu List".
- **Tree/Dropdown**: The selection of "Dashboard Page" relies on specific text/role structure.
- **Deletion**: This test uses a specific multi-step deletion:
  - Check the box (label span)
  - Click the row button (likely a context menu or selection confirmation)
  - Click the main page Delete button
  - Confirm in modal

### Error Handling
- The dropdown selection is wrapped in reliability checks where possible.
- Visibility assertions are used before interactions.

---

## Success Indicators
The test passes when:
1. ✓ Login is successful
2. ✓ Form is filled and saved without validation errors
3. ✓ User is navigated back to the Menu List
4. ✓ The specific created menu item is found
5. ✓ The item is successfully deleted and removed from the list

---

## Running the Test
```bash
npx playwright test test/cms-menus.spec.js --project=chromium --headed
```
