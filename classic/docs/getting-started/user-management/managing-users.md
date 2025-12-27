---
title: "Managing Existing Users"
description: "Learn how to view, edit, and manage existing user accounts in GCXONE"
tags:
  - role:admin
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 6
last_updated: 2025-01-21
---

# Managing Existing Users

This guide covers how to view, edit, and manage existing user accounts in GCXONE, including modifying roles, Customer Groups, and removing user access.

![Users List](./images/user-management-1.png)

## Viewing Users

To see all users in your organization:

1. Open **Settings** from the main navigation
2. Click on the **Users** tab

The Users list displays:

- **Name**: User's full name
- **Email**: User's email address
- **Role**: Assigned role
- **Status**: Active/Inactive
- **Actions**: Menu for user management options

![View Users](./images/user-management-2.png)

### User List Information

The Users tab provides a comprehensive view of all users:

| Column | Description |
|--------|-------------|
| **Name** | User's first and last name |
| **Email** | Login email address |
| **Role** | Currently assigned role |
| **Status** | Active (can log in) or Inactive (disabled) |
| **Actions** | Menu with edit, delete, and other options |

### Filtering and Searching

You can filter and search the user list:
- **Search**: Use the search box to find users by name or email
- **Filter by Role**: Filter users by their assigned role
- **Filter by Status**: Show only Active or Inactive users

## Editing User Access

To modify a user's role or Customer Group:

1. Open **Settings**
2. Click on the **Users** tab
3. Click on the **3 dots** (actions menu) of the user you want to edit
4. Select **Edit** from the menu
5. Update their role or Customer Group assignment
6. Modify other settings as needed (session timeout, etc.)
7. Click **Save**

![Edit User](./images/user-management-3.png)

### What Can Be Changed

When editing a user, you can modify:

- ✅ **Role**: Change the user's assigned role
- ✅ **Customer Group**: Add, change, or remove Customer Group assignment
- ✅ **Session Timeout**: Override role-level session timeout
- ✅ **User Information**: Update name, email, phone, address
- ✅ **Status**: Activate or deactivate the user account

### Impact of Changes

:::important Immediate Effect
Changes to user access take effect immediately. Users may need to refresh their browser or log out and log back in to see changes.
:::

**Role Changes:**
- New permissions apply immediately
- User may see new or different features
- Access restrictions apply immediately

**Customer Group Changes:**
- Customer visibility updates immediately
- User may see different customers/sites
- Previous access may be removed

**Status Changes:**
- **Activate**: User can immediately log in
- **Deactivate**: User is immediately logged out and cannot log in

## Removing Users

To remove a user's access to the platform:

1. Open **Settings**
2. Click on the **Users** tab
3. Click on the **3 dots** (actions menu) of the user you want to remove
4. Click **Delete User**
5. Confirm the deletion

![Delete User](./images/user-management-4.png)

:::danger Before Deleting
**Important Considerations:**

- Deleting a user permanently removes their access
- Associated contacts and logs for that user's specific actions may be deleted if they were the primary contact
- User data and history may be affected
- Consider deactivating instead of deleting if you may need to restore access later
:::

### Delete vs. Deactivate

**Delete User:**
- Permanently removes the user account
- Cannot be undone
- May affect associated data and logs
- Use when user will never need access again

**Deactivate User:**
- Temporarily disables access
- Can be reactivated later
- Preserves user data and history
- Use when access may be needed again

:::tip Best Practice
**Deactivate First**: Consider deactivating users instead of deleting them, especially if they may need access again in the future.
:::

## User Status Management

### Activating Users

To activate a previously deactivated user:

1. Navigate to **Settings** → **Users**
2. Find the user (they may appear in a filtered list)
3. Click the **3 dots** menu
4. Select **Edit**
5. Change status to **Active**
6. Click **Save**

### Deactivating Users

To temporarily disable a user's access:

1. Navigate to **Settings** → **Users**
2. Find the user
3. Click the **3 dots** menu
4. Select **Edit**
5. Change status to **Inactive**
6. Click **Save**

The user will be immediately logged out and cannot log in until reactivated.

## Bulk User Management

While GCXONE doesn't have built-in bulk operations, you can efficiently manage multiple users:

### Common Scenarios

**Scenario 1: Change Role for Multiple Users**
1. Filter users by current role
2. Edit each user individually
3. Change to new role
4. Save

**Scenario 2: Assign Customer Group to Multiple Users**
1. Filter or search for relevant users
2. Edit each user
3. Assign the Customer Group
4. Save

**Scenario 3: Deactivate Multiple Users**
1. Select users to deactivate
2. Edit each user
3. Change status to Inactive
4. Save

## User Activity and Monitoring

### Viewing User Information

When viewing a user, you can see:
- Account creation date
- Last login time
- Assigned role and permissions
- Customer Group assignment
- Contact information

### User Activity Logs

User activity may be logged in:
- System logs
- Audit trails
- Activity reports

Check your organization's logging and reporting features for detailed user activity information.

## Best Practices

:::tip Best Practice
**Regular Audits**: Periodically review user access to ensure users have appropriate roles and Customer Groups.
:::

:::tip Best Practice
**Document Changes**: Keep a record of user access changes for audit purposes.
:::

:::tip Best Practice
**Deactivate Before Delete**: Deactivate users first to ensure you don't need to restore access later.
:::

:::tip Best Practice
**Verify Before Changes**: Double-check user information before making changes, especially role assignments.
:::

:::warning Security Best Practice
**Remove Access Promptly**: When users leave the organization or change roles, update or remove their access immediately.
:::

## Troubleshooting

### User Can't Access After Role Change

**Problem**: User reports they can't access features after role change.

**Solutions**:
1. Verify the new role has the correct permissions
2. Check Customer Group assignment (if applicable)
3. Have user log out and log back in
4. Verify access level matches user's needs
5. Check if user needs to be assigned to a Customer Group

### User Still Sees Old Customers

**Problem**: User still sees customers they shouldn't after Customer Group change.

**Solutions**:
1. Verify Customer Group assignment is correct
2. Have user refresh browser or log out and back in
3. Check if user has multiple roles (some may have broader access)
4. Verify role's access level

### Can't Delete User

**Problem**: Delete option is grayed out or unavailable.

**Solutions**:
1. Verify you have administrative permissions
2. Check if user is assigned to critical systems
3. Ensure user is not the last admin user
4. Try deactivating instead of deleting

## Next Steps

Now that you can manage users, you can:

1. **[Inviting Users](./inviting-users)** - Learn how to add new users
2. **[Creating Roles](./creating-roles)** - Create custom roles for specific needs
3. **[Customer Groups](./customer-groups)** - Set up Customer Groups for access control

## Related Documentation

- [Inviting Users](./inviting-users)
- [Creating and Configuring Roles](./creating-roles)
- [Customer Groups](./customer-groups)
- [Understanding Roles and Access Levels](./roles-and-access-levels)

