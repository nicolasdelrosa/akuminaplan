# JM Smuckers - Term Set Configuration Guide

## Creating a New Term Set "OurPeople"

### Overview
This guide provides step-by-step instructions for creating a new term set called "OurPeople" in SharePoint's Term Store and updating the Site Column to use the new term set in the Dev environment. This configuration will allow content to be properly categorized under the Our People section.

---

## Reference Images

This guide references the following screenshots to help you identify UI elements:

**Image 1: Term Store Context Menu**
- Shows the 3-dot menu with options: "Add term set", "Rename term group", "Delete term group", "Import term set"
- Located in Term Store Management when right-clicking on a term group

**Image 2: OurPeople Term Set Structure**
- Shows the expanded OurPeople term set in the hierarchy
- Displays "Category" and "Persona" subsections with expandable arrows
- Shows the "Group Manage" context menu

**Image 3: Complete Term List**
- Shows all five terms that should be in OurPeople:
  - 🏷️ In Memoriam
  - 🏷️ New Hire
  - 🏷️ New Role
  - 🏷️ Promotion
  - 🏷️ Retirement

**Image 4: Taxonomy Tree in Column Settings**
- Shows the taxonomy tree structure in the field configuration page
- Displays hierarchy: Taxonomy_5Zhesv+E8seDTYWpcTb5pA== → Site URL → Category (Departments highlighted)
- Shows where to select OurPeople

---

## Part 1: Create New Term Set in SharePoint Term Store

### Step 1: Navigate to Central Site
1. Open your web browser
2. Navigate to: **https://jmscollabdev.sharepoint.com/sites/NeighborhoodCentralDev**
3. Ensure you are logged in with an account that has Term Store Administrator permissions

### Step 2: Access Term Store Management
1. Click on the **Settings gear icon** (⚙️) in the top-right corner of the page
2. From the dropdown menu, select **Site Settings**
3. Under the **Site Administration** section, click on **Term store management**
4. Wait for the Term Store Management Tool to load

### Step 3: Locate and Expand Global Term Groups
1. In the left navigation pane of the Term Store, locate **Taxonomy_5Zhesv+E8seDTYWpcTb5pA==**
2. Expand this taxonomy by clicking the arrow (▶) next to it
3. You should see the site URL: **https://jmscollabdev.sharepoint.com/sites/NeighborhoodCentralDev**
4. Expand this site node to view existing term groups and sets

### Step 4: Create New Term Set "OurPeople"
1. Right-click on the term group, OR click on the **3 dots (•••)** ellipsis menu next to the term group
2. From the context menu that appears, select **Add term set**
   - **Reference Image 1**: Menu showing options: "Add term set", "Rename term group", "Delete term group", "Import term set"
3. A new term set will be created with a default name (e.g., "New Term Set")
4. **Immediately rename it** to: **OurPeople**
5. Press **Enter** to confirm the name
6. Click **Save** in the Term Store toolbar to save your changes

**Important:** Make sure the term set is created at the correct level in the hierarchy. It should be visible alongside other term sets like "Category" and "Persona".

### Step 5: Add Terms to the OurPeople Term Set

Now you need to add individual terms that will be used to categorize Our People content.

#### Add First Term:
1. Click on the **OurPeople** term set you just created to select it
2. Click on the **3 dots (•••)** ellipsis menu next to "OurPeople"
3. From the dropdown menu, select **Add term**
   - **Reference Image 2**: OurPeople term set structure with Category and Persona subsections
4. A new term will be created with a default name
5. Rename it to: **In Memoriam**
6. Press **Enter** to confirm

#### Add Remaining Terms:
Repeat the "Add term" process for each of the following terms:

7. **New Hire**
   - Click the 3 dots next to OurPeople → Add term → Type "New Hire" → Press Enter

8. **New Role**
   - Click the 3 dots next to OurPeople → Add term → Type "New Role" → Press Enter

9. **Promotion**
   - Click the 3 dots next to OurPeople → Add term → Type "Promotion" → Press Enter

10. **Retirement**
    - Click the 3 dots next to OurPeople → Add term → Type "Retirement" → Press Enter

**Reference Image 3**: Final term list should show:
- 🏷️ In Memoriam
- 🏷️ New Hire
- 🏷️ New Role
- 🏷️ Promotion
- 🏷️ Retirement

#### Save Your Changes:
11. Click the **Save** button in the Term Store toolbar
12. Verify all terms are visible under the OurPeople term set in the left navigation

**Note:** You can add additional terms later by following the same process. Terms can also be reordered by dragging and dropping them within the term set.

---

## Part 2: Update Site Column to Use New Term Set

Now that the OurPeople term set has been created, you need to configure the SpotlightCategory site column to use this new term set instead of the previous one.

### Step 1: Navigate to SpotlightCategory Field Edit Page
1. Open a new browser tab (keep the Term Store tab open in case you need to reference it)
2. Copy and paste this URL into the address bar:
   ```
   https://jmscollabdev.sharepoint.com/sites/NeighborhoodDeliveryDev/_layouts/15/FldEditEx.aspx?List=%7BD865EEBE%2DAB9C%2D4FC3%2DBB37%2D91BFC1437E1C%7D&Field=SpotlightCategory
   ```
3. Press **Enter** to navigate to the page
4. Wait for the **Edit Column** page to load

**What you're viewing:** This is the field configuration page for the SpotlightCategory managed metadata column used in the list/library.

### Step 2: Locate the Term Set Settings Section
1. Scroll down on the Edit Column page until you see the **Term Set Settings** section
2. You should see options for:
   - Use a managed term set
   - Customize your term set
3. Look for the current term set selection (it may show "Category" or another term set)

**Reference Image 4**: You should see the taxonomy tree showing:
- Taxonomy_5Zhesv+E8seDTYWpcTb5pA==
  - https://jmscollabdev.sharepoint.com/sites/NeighborhoodCentralDev
    - **Category** (currently highlighted/selected)
      - Departments (▶)
      - Region
      - Tags
    - **Persona**

### Step 3: Select the OurPeople Term Set
1. In the term set tree view, expand the taxonomy if needed
2. Navigate through the tree structure:
   - **Expand** Taxonomy_5Zhesv+E8seDTYWpcTb5pA==
   - **Expand** https://jmscollabdev.sharepoint.com/sites/NeighborhoodCentralDev
3. **Click on "OurPeople"** term set to select it
   - The term set should become highlighted/selected
   - You should see all the terms you created (In Memoriam, New Hire, New Role, Promotion, Retirement)
4. Verify that "OurPeople" is now selected (it should be highlighted in the tree view)

### Step 4: Configure Additional Settings (if needed)
1. Verify the following settings are configured appropriately:
   - **Allow Fill-in choices**: Typically set to "No" to ensure only predefined terms are used
   - **Display format**: Set to "Term Label only" or as required
   - **Allow multiple values**: Typically "No" for category fields

### Step 5: Save the Column Configuration
1. Scroll to the bottom of the page
2. Click the **OK** button to save your changes
3. Wait for the page to process and redirect back to the list settings

**Confirmation:** You should be redirected back to the list settings page. The SpotlightCategory column now uses the OurPeople term set.

**Important:** The column is now pointed to the OurPeople term set. Any existing items with old category values will need to be updated manually or through bulk update.

---

## Part 3: Clear System Caches

After making changes to the term set and column configuration, you must clear the Akumina caches to ensure the new configuration is loaded throughout the system.

### Why Clear Caches?
- **List Cache**: Stores cached list data including column configurations
- **Taxonomy Cache**: Stores cached term set and term information
- Clearing these ensures the system fetches the latest configuration from SharePoint

### Step 1: Navigate to Admin Debug Panel
1. Open a new browser tab
2. Navigate to: **https://cloud-dev-jmsmucker.onakumina.com/admin/debug**
3. Wait for the debug panel to load
4. You should see the Akumina Administration Debug interface

### Step 2: Clear List Cache
1. Locate the **List Cache** section on the debug panel
2. Click the **"Clear List Cache"** or **"List Cache"** button
3. Wait for the confirmation message (may take 5-15 seconds)
4. You should see a success message indicating the list cache has been cleared

**What this does:** Removes cached list schema information, forcing the system to reload the SpotlightCategory column configuration with the new OurPeople term set.

### Step 3: Clear Taxonomy Cache
1. Locate the **Taxonomy Cache** section on the debug panel
2. Click the **"Clear Taxonomy Cache"** or **"Taxonomy Cache"** button
3. Wait for the confirmation message (may take 5-15 seconds)
4. You should see a success message indicating the taxonomy cache has been cleared

**What this does:** Removes cached term set and term information, forcing the system to reload the OurPeople term set with all its terms (In Memoriam, New Hire, New Role, Promotion, Retirement).

### Step 4: Verify Cache Clearing
1. Check for confirmation messages on the screen
2. Both caches should show as successfully cleared
3. Wait an additional **2-3 minutes** for the cache clearing to propagate across all servers

**Note:** If you don't see confirmation messages, try refreshing the page and clearing the caches again. Some environments may require clearing multiple times.

---

## Part 4: Verify Configuration on Delivery Site

Now that everything is configured and caches are cleared, you need to verify that the Our People component is working correctly with the new term set.

### Step 1: Navigate to the Delivery Site
1. Open a new browser tab or navigate to the **Neighborhood Delivery Dev** site
2. Expected URL format: **https://jmscollabdev.sharepoint.com/sites/NeighborhoodDeliveryDev**
3. Wait for the page to fully load

### Step 2: Access the Our People Component Location
Navigate through the site structure to reach the Our People component:

1. Click on **Rail** in the navigation (or locate the Rail section)
2. Navigate to **Structure Content**
3. Go to **Components** section
4. Locate and click on **Our People**

**Alternative Access:** You may also access this through:
- Site Contents → Our People list
- Or via direct URL if known: `/sites/NeighborhoodDeliveryDev/Lists/OurPeople/`

### Step 3: Review Existing Items
1. You should see a list of Our People items/entries
2. Each item should have a **SpotlightCategory** column visible
3. Check 3-5 existing items to see their current category values

### Step 4: Verify SpotlightCategory Field is Working
For each item in the list:

1. **Click on an item** to open it, OR click **Edit** on an item
2. Locate the **SpotlightCategory** field in the form
3. Click on the SpotlightCategory field dropdown/picker
4. **Verify** that you can see all the new terms from OurPeople:
   - 🏷️ In Memoriam
   - 🏷️ New Hire
   - 🏷️ New Role
   - 🏷️ Promotion
   - 🏷️ Retirement
5. **Select the appropriate category** for each item based on its content
6. Click **Save** to save the item

### Step 5: Update All Items with Correct Categories
Go through each Our People item and ensure they have the correct SpotlightCategory assigned:

**Example Categorization:**
- **In Memoriam**: Tribute posts for deceased employees
- **New Hire**: Welcome announcements for new employees
- **New Role**: Internal promotions or role changes
- **Promotion**: Career advancement announcements
- **Retirement**: Retirement announcements and celebrations

**Bulk Update Option:** If you have many items, you can:
1. Select "Quick Edit" or "Edit in Grid View" from the list ribbon
2. Update the SpotlightCategory column for multiple items at once
3. Ensure each item has an appropriate category selected
4. Save all changes

### Step 6: Test on the Front-End Site
1. Navigate to the public-facing Our People page/component on the site
2. Verify that:
   - Items are displaying correctly
   - Categories/filters are working if implemented
   - No errors appear in the browser console (press F12 → Console tab)
3. Test any filtering or sorting by category functionality

### Step 7: Final Verification Checklist
Review the following before concluding:

- ✅ All Our People items have a SpotlightCategory assigned
- ✅ Categories match the new OurPeople term set terms
- ✅ No items are using old/invalid category values
- ✅ The SpotlightCategory field shows only the OurPeople terms when editing
- ✅ No console errors appear when viewing Our People content
- ✅ Category filtering (if applicable) works correctly on the front end

**If any items are missing categories or showing errors:**
1. Re-edit the item and assign a category from the dropdown
2. Save and verify again
3. If issues persist, clear caches again (Part 3) and wait 5 minutes

---

## Expected Results

After completing all steps in this guide, you should have:

- ✅ **New "OurPeople" term set created** in the Term Store at the correct location
- ✅ **Five terms added** to the OurPeople term set:
  - In Memoriam
  - New Hire
  - New Role
  - Promotion
  - Retirement
- ✅ **SpotlightCategory column configured** to use the OurPeople term set
- ✅ **System caches cleared** (List Cache and Taxonomy Cache)
- ✅ **All Our People items updated** with correct categorization
- ✅ **Front-end functionality verified** with no errors

---

## Troubleshooting Guide

### Issue 1: Cannot See the OurPeople Term Set in the Tree View
**Symptoms:** When trying to select the term set for the SpotlightCategory column, OurPeople doesn't appear in the tree.

**Possible Causes:**
- Term set wasn't saved properly
- Created in wrong location
- Browser cache issue

**Solutions:**
1. Go back to the Term Store Management page
2. Verify the OurPeople term set exists and is saved
3. Make sure it's under the correct taxonomy path
4. Clear your browser cache (Ctrl+Shift+Delete)
5. Refresh the field edit page (F5)
6. Try using an Incognito/Private browser window

---

### Issue 2: Terms Not Appearing After Configuration
**Symptoms:** After configuring the column, the terms don't show up in the dropdown when editing an item.

**Solutions:**
1. Verify you cleared **both** List Cache and Taxonomy Cache (Part 3)
2. Wait 2-3 minutes after clearing caches
3. Clear browser cache and refresh the page
4. Check that terms are properly saved in the Term Store (no unsaved changes)
5. Try opening the item in a new browser tab/window
6. Re-clear the caches and wait 5 minutes

---

### Issue 3: Cannot Save Term Set Changes
**Symptoms:** Changes to the term set are not saving, or you get an error when clicking Save.

**Possible Causes:**
- Insufficient permissions
- Concurrent editing by another user
- SharePoint connectivity issue

**Solutions:**
1. **Verify permissions**: You need Term Store Administrator rights
   - Site Settings → Term Store Management → Term Store Administrators
   - Your account should be listed
2. Check if another user is editing the term store (look for edit lock message)
3. Try again after a few minutes
4. Contact your SharePoint administrator if permission issues persist

---

### Issue 4: Old Categories Still Showing
**Symptoms:** Old category values still appear when editing items, even after configuration.

**Solutions:**
1. The column may still be pointing to the old term set
2. Go back to Part 2 and verify the OurPeople term set is selected
3. Clear caches again (Part 3)
4. Check browser Developer Tools console (F12) for errors
5. Sometimes SharePoint caches aggressively - wait 10-15 minutes and try again

---

### Issue 5: Items Not Saving with New Categories
**Symptoms:** When trying to select a new category and save an item, it fails or doesn't save.

**Solutions:**
1. Ensure the term set is published (not in draft mode)
2. Check that terms don't have special characters or formatting issues
3. Verify list permissions allow you to edit items
4. Try using "Quick Edit" mode instead of the edit form
5. Clear browser cache and try in a different browser

---

### Issue 6: "Term Set Not Found" Error
**Symptoms:** Error message when trying to edit items: "The managed metadata service returned no term set"

**Solutions:**
1. The term set may have been deleted or moved
2. Verify in Term Store Management that OurPeople still exists
3. Check the term set GUID if configured manually
4. Reconfigure the column (repeat Part 2)
5. Clear all caches (Part 3)

---

### Issue 7: Permissions Error When Accessing Term Store
**Symptoms:** "Access Denied" or "You don't have permission" when trying to open Term Store Management.

**Solutions:**
1. You need Site Collection Administrator permissions OR Term Store Administrator role
2. Contact your SharePoint administrator to request access
3. As a workaround, have an administrator perform the term set creation while you watch/document
4. Required roles:
   - **Site Collection Administrator**, OR
   - **Term Store Administrator**

---

### Issue 8: Changes Not Reflecting on Front-End
**Symptoms:** Back-end changes are saved, but the front-end Our People component doesn't reflect updates.

**Solutions:**
1. Clear Akumina caches again (Part 3)
2. Check if there's a separate production cache that needs clearing
3. Hard refresh the front-end page (Ctrl+F5)
4. Clear browser cache completely
5. Check if CDN caching is involved - may take longer to propagate
6. Wait up to 15 minutes for all caches to expire
7. Check Akumina widget configuration - widget may have cached data

---

## Additional Notes and Best Practices

### Environment Considerations
- **This configuration is for the Dev environment only**
- Changes made to term sets in **Dev** must be manually replicated to:
  - **QA/Test Environment**
  - **Production Environment**
- Always document term set changes to ensure consistency across environments
- Consider creating a change management document when promoting to production

### Term Set Management Best Practices

1. **Documentation**: Keep a record of all terms in each term set
   - Maintain a spreadsheet or document listing all terms
   - Include descriptions of when to use each term
   - Document any changes (additions, deletions, renames)

2. **Naming Conventions**: Use clear, descriptive term names
   - Avoid abbreviations unless universally understood
   - Use consistent capitalization (e.g., "New Hire" not "new hire" or "NEW HIRE")
   - Keep term names concise but meaningful

3. **Change Management**:
   - Don't delete terms that are actively being used
   - Instead, deprecate terms by moving items to new terms first
   - Document the reason for any term changes
   - Communicate changes to content editors

4. **Testing Process**:
   - Always test in Dev environment first
   - Verify on multiple browsers (Chrome, Edge, Firefox)
   - Test on both desktop and mobile devices if applicable
   - Have a content editor test the changes before go-live

### Timing Expectations

- **Term Store changes**: Take effect immediately after saving
- **Column configuration changes**: Take effect immediately after clicking OK
- **Cache clearing**: 
  - List Cache: 30 seconds to 2 minutes
  - Taxonomy Cache: 1-5 minutes
- **Full propagation**: Allow up to 15 minutes for all systems to sync
- **CDN cache (if applicable)**: May take up to 30 minutes

### Rollback Plan

If you need to revert the changes:

1. **Go back to the Field Edit page** (Part 2, Step 1)
2. **Select the previous term set** instead of OurPeople
3. **Save the column configuration**
4. **Clear caches** (Part 3)
5. **Update items back to old categories** if needed

**Note:** Keep a record of the previous term set name and location before making changes.

### Related Configuration

This term set configuration may impact:
- **Search refiners**: If SpotlightCategory is used as a refiner
- **Filtering logic**: Any custom code filtering by category
- **Views**: List views that filter by SpotlightCategory
- **Workflows**: Any workflows that read/write the SpotlightCategory field
- **Power Automate flows**: Flows that reference this field
- **Reporting**: Any reports or dashboards showing category statistics

### Maintenance and Updates

**Adding New Terms**:
- Navigate to Term Store Management
- Expand to OurPeople term set
- Right-click or use 3 dots → Add term
- Name the new term
- Save changes
- Clear Taxonomy Cache
- Notify content editors of the new term

**Removing Terms**:
- **Before removing**: Ensure no items are using the term
- Update all items using the term to a different category
- Navigate to Term Store Management
- Right-click the term → Delete
- Confirm deletion
- Save changes
- Clear Taxonomy Cache

**Renaming Terms**:
- Navigate to Term Store Management
- Click on the term to select it
- Edit the term label in the properties pane
- Save changes
- Clear Taxonomy Cache
- Note: Existing items will automatically update

---

## Document Information

**Document Title:** JM Smuckers - Term Set Configuration Guide  
**Version:** 1.1  
**Date Created:** March 5, 2026  
**Last Updated:** March 5, 2026  
**Environment:** JM Smuckers Dev (NeighborhoodCentralDev)  
**Author:** Technical Documentation Team

### Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | March 5, 2026 | Initial document creation | Technical Team |
| 1.1 | March 5, 2026 | Added detailed instructions and troubleshooting | Technical Team |

### Related Resources

- **SharePoint Term Store Documentation**: [Microsoft Docs - Managed Metadata]
- **Akumina Admin Guide**: [Akumina Documentation Portal]
- **JM Smuckers Dev Environment**: https://jmscollabdev.sharepoint.com
- **Akumina Dev Admin Panel**: https://cloud-dev-jmsmucker.onakumina.com/admin

### Support Contacts

For issues or questions regarding:
- **SharePoint Term Store**: Contact SharePoint Administrator
- **Akumina Configuration**: Contact Akumina Support Team
- **OurPeople Content**: Contact Content Management Team
- **Permissions**: Contact IT Security/Access Management

---

**End of Document**
