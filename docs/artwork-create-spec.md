# Artwork Create - Test Specification

## Overview
This test creates a new artwork with all required fields including text information, document uploads, auction details, and image files, then verifies successful creation.

**Base URL:** http://52.91.192.7  
**Timeout:** 5 minutes  
**Test File:** artwork-create.spec.js

---

## Prerequisites

### Required Test Fixtures
Ensure these files exist in the `tests/fixtures/` directory:
- **sample.pdf** - For condition report and fact sheet uploads
- **sample.jpg** - For artwork image upload

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

### 1. Open Website and Login
- Navigate to the base URL
- Execute the login helper function
- Confirm successful login

### 2. Navigate to Artwork List
- Click the text "Auction" in the sidebar
- Wait 500ms for menu to expand
- Click the text "Artwork List"
- Wait 3 seconds for page to load

### 3. Initiate Artwork Creation
- Find and click the button containing text "Create"
- Wait 3 seconds for the form to load

### 4. Fill Artwork Information Fields

#### Title
- Find the input with name attribute: `en[title]`
- Fill with: test

#### Description (Rich Text Editor)
- First, try to find the rich text editor element with class "note-editable" (Summernote editor)
- If the editor is visible:
  - Fill the editor with: test
- If the editor is not visible:
  - Find the textarea with name attribute: `en[description]`
  - Fill with: test

#### Provenance
- Find the input with name attribute: `en[provenance]`
- Fill with: tets

#### Exhibition History
- Find the input with name attribute: `en[exhibition_history]`
- Fill with: test

#### Catalog Notes
- Find the input with name attribute: `en[catalog_notes]`
- Fill with: test

#### Artist
- Find the input with name attribute: `artist`
- Fill with: Test QA

#### Year
- Find the input with name attribute: `year`
- Fill with: 2026

#### Dimensions
- Find the input with name attribute: `dimensions`
- Fill with: 4*4

#### Tags
- Find the input with name attribute: `tags`
- Fill with: etst

### 5. Upload Required Documents

#### Condition Report
- Find the file input with ID: `condition_report`
- Upload file: tests/fixtures/sample.pdf

#### Fact Sheet
- Find the file input with ID: `fact_sheet`
- Upload file: tests/fixtures/sample.pdf

### 6. Fill Auction Details

#### Type
- Find the select dropdown with ID: `artwork_type`
- Select the option with label: Auction

#### Starting Bid
- Find the input with name attribute: `starting_bid`
- Fill with: 1

#### Minimum Increment
- Find the input with name attribute: `minimum_increment`
- Fill with: 5

### 7. Upload Artwork Images

#### Switch to Artwork Files Tab
- Click the text "Artwork Files"
- Wait 1 second for the tab to load

#### Upload Image
- Find the file input with name attribute: `artworkfiles[0][file]`
- Upload file: tests/fixtures/sample.jpg

### 8. Save the Artwork
- Find and click the button containing text "Save & Continue"

### 9. Verify Creation Success

#### Wait for Redirect
- Wait for the URL to change to a pattern containing "/edit/" or "/artwork/" or "?id=" (30 second timeout)

#### Capture Artwork URL
- Get the current page URL
- Log the created artwork URL

#### Extract Artwork ID
- Extract the ID number from the URL:
  - Look for pattern: /edit/[number]
  - Or look for pattern: id=[number]
- If ID found, log it
- If no ID found, log "unknown"

#### Confirm Success
- Log "Artwork Created Successfully!"

---

## Important Notes

### Rich Text Editor Handling
- The description field uses Summernote rich text editor
- First check if the `.note-editable` element is visible
- If visible, fill that element directly
- If not visible, fall back to the standard textarea field
- This two-tier approach handles different editor states

### File Upload Paths
- All file paths are relative to the test execution directory
- Ensure fixture files exist before running the test
- Use `setInputFiles()` method for file uploads

### Wait Times
- Navigation waits: 500ms for menu expansion, 3 seconds for page loads
- Tab switch wait: 1 second
- These waits ensure elements are ready for interaction

### Selector Strategy
- Uses name attributes for most form fields (more stable)
- Uses ID selectors for file inputs and dropdowns
- Uses text selectors for navigation and buttons
- Falls back to class selectors for rich text editor

### Error Handling
- Login checks if already logged in before attempting login
- Rich text editor has fallback to standard textarea
- Network idle wait is wrapped in try-catch (non-critical)

### Timeouts
- Element visibility checks: Default Playwright timeout
- URL navigation: 30 seconds
- Network idle: 10 seconds
- Overall test timeout: 300 seconds (5 minutes)

---

## Success Indicators

The test passes when:
1. ✓ Login completes successfully
2. ✓ Artwork list page loads
3. ✓ Create form opens
4. ✓ All text fields are filled
5. ✓ Condition report PDF is uploaded
6. ✓ Fact sheet PDF is uploaded
7. ✓ Auction type is selected
8. ✓ Starting bid and minimum increment are filled
9. ✓ Artwork image is uploaded
10. ✓ Form is saved and redirects to edit page
11. ✓ Artwork ID is captured from URL

**Expected Duration:** 30-60 seconds

---

## Running the Test

### Standard run:
```
npx playwright test test/artwork-create.spec.js --project=chromium
```

### Debug mode (see browser):
```
npx playwright test test/artwork-create.spec.js --project=chromium --headed
```

### View results:
```
npx playwright show-report
```

---

## Maintenance Guide

### Update this spec when:
- Form fields are added, removed, or renamed
- Rich text editor changes (different library or class names)
- File upload field names change
- Navigation menu structure changes
- Tab names change

### Common troubleshooting:
- **Rich text editor not working:** Check if Summernote is still used, verify `.note-editable` class
- **File uploads fail:** Verify fixture files exist in `tests/fixtures/` directory
- **Navigation fails:** Check if menu structure changed, verify text labels
- **ID not captured:** Check if URL pattern after save has changed
- **Form fields not found:** Verify name attributes haven't changed

### Required Fixtures Checklist
Before running the test, ensure:
- [ ] `tests/fixtures/sample.pdf` exists
- [ ] `tests/fixtures/sample.jpg` exists
- [ ] Files are valid and not corrupted
- [ ] File paths are correct relative to test execution

---

## Key Differences from Other Tests

1. **No deletion step** - This is a create-only test
2. **Multiple file uploads** - Handles PDFs and images
3. **Rich text editor** - Special handling for Summernote
4. **Tab navigation** - Switches to "Artwork Files" tab
5. **More form fields** - Extensive form with many text inputs
6. **Fixture dependencies** - Requires external test files

---

*This specification describes the complete end-to-end test for artwork creation. Use it to regenerate the test script or as a reference for similar tests.*
