---
sidebar_position: 2
image: ./logo.svg
title: BulkImport
tags:
  - bulk-import
  - devices
  - excel
---

# BulkImport

Import many devices in a few clicks.  
BulkImport lets you upload a template Excel file, preview the records, and create devices in one guided flow.

<video
  controls
  style={{
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    marginTop: '1rem',
    marginBottom: '1.5rem'
  }}
>
  <source src={require('./Bulk import (2).mp4').default} type="video/mp4" />
  Your browser does not support the video tag.
</video>

BulkImport is the recommended way to onboard large numbers of devices into GCXONE.  
Use this page as the reference for how it works, how to prepare your file, and what to expect from each step.

## Where BulkImport lives

Open GCXONE, go to **Devices**, then select **Import**.

![Devices page with Import button](./Screenshot%202025-11-25%20124920.png)

The system opens a three step wizard:

1. Upload  
2. Preview  
3. Complete  

You stay on the Devices page the whole time.

## When to use BulkImport

Use BulkImport when you want to:

- Add many devices for a customer or site.  
- Move devices from an older platform.  
- Roll out new hardware to several locations at once.  
- Keep device configuration consistent by starting from one template file.  

For a single device, use the normal device creation form.  
For anything larger, BulkImport saves a lot of time.

## Step 1 - Upload template file

![Upload step - select Excel file](./Screenshot%202025-11-25%20124938.png)

The Upload step gives two buttons:

- **Download Template File**  
  Downloads an empty Excel file with all required columns.

- **Browse Files**  
  Opens a file picker where you choose your filled `.xlsx` or `.xls` file.

The wizard accepts one Excel file per run.  
If you manage several customers or regions, create one file per group.  
That makes preview and error handling easier to follow.

After you select the file, the wizard moves to Preview.

## Step 2 - Preview import data

![Preview step - review rows](./Screenshot%202025-11-25%20125048.png)

The Preview step shows:

- The customer or site at the top.  
- A table of all rows that BulkImport detected in the file.  
- The total number of rows on the right.  

Check at least:

- Site name.  
- Device type and model.  
- Serial numbers and IP addresses.  
- That the row count matches what you expect.  

If anything looks wrong, click **Back**, fix the Excel file, then upload again.  
Do not continue if the preview does not match what you planned to import.

When the data looks correct, click **Import Data**.

## Step 3 - Completion

![Complete step - success](./Screenshot%202025-11-25%20125103.png)

After the import finishes you see a completion screen.

You get:

- A clear success message.  
- The number of records that BulkImport imported.  

If the system found issues with some rows, it also shows:

- The count of failed records.  
- A link to download an error report file.  

Use that report to correct only the failed rows, then import just those rows in a small follow up file.

Existing devices stay as they are.  
BulkImport only adds new ones.

## Template Excel file

You always get the latest template by clicking **Download Template File** in the Upload step.

![Template Excel example](./Screenshot%202025-11-25%20125021.png)

The template contains these columns:

| Column name                  | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `siteName`                   | Site that owns the device. One file usually targets one site or customer.     |
| `deviceName`                 | Friendly device name as it appears in the UI.                                 |
| `deviceType`                 | Device vendor or type, for example Dahua, Hikvision, or Tower1.               |
| `ipAddressOrH`               | IP address or hostname of the device.                                         |
| `isHttps`                    | `TRUE` to use HTTPS, `FALSE` to use HTTP.                                     |
| `httpsPort`                  | HTTPS port number when `isHttps` is `TRUE`.                                   |
| `controlPort`                | Port used for control or API calls.                                           |
| `serverPort`                 | Main server or service port.                                                  |
| `RTSPPort`                   | Port used for RTSP streaming.                                                 |
| `userName`                   | Username BulkImport should use to log in.                                     |
| `password`                   | Password for the username above.                                              |
| `momentsTimeZoneCountryName` | Time zone where the device is installed, for example `Asia/Kolkata` or `CET`. |
| `isEventPollingEnabled`      | `TRUE` to enable event polling, `FALSE` to disable it.                        |
| `pollingInterval`            | Polling interval in seconds when event polling is enabled.                    |
| `peirodi`                    | Reserved field. Leave empty unless support tells you to use it.               |

Tips for filling the file:

- Fill all required fields on every row.  
- Keep one device per row.  
- Leave optional fields empty instead of guessing values.  
- Use the same site and time zone format in the whole file.  

Treat the file as sensitive because it includes credentials.  
Store and share it in a secure way inside your team.

## Validation and errors

BulkImport validates data during preview and during the actual import.

### Preview checks

During preview BulkImport checks for:

- Missing required values.  
- Invalid port numbers.  
- Basic IP or hostname format problems.  
- Obvious duplicates in the same file.  

If BulkImport finds critical issues it shows a message and blocks the import.  
Fix the file and upload again.

### Import checks

When you click **Import Data**, BulkImport tries to create each device:

- Valid rows create devices and attach them to the selected customer or site.  
- Invalid rows fail and land in the error list.  

When some rows fail:

1. Download the error report.  
2. Fix the rows in a fresh copy of the template.  
3. Run BulkImport again with only those rows.  

That way you do not need to redo a full import.

## Best practices

- Start with a small test file, for example five devices, to confirm the format.  
- Use one file per customer or region so previews stay readable.  
- Keep a copy of every file you import in case you need to audit changes later.  
- After a large import, open a few devices in the UI and confirm they connect as expected.  

## FAQ

**Can I rerun BulkImport with the same file?**  
Yes. This can create duplicates if your environment does not block them, so check the preview carefully.  
When in doubt, keep a copy of the original file and use smaller files for retries.

**What happens to rows that fail?**  
Failed rows do not create devices.  
You correct those rows, then run a smaller import with just that data.

**Can I use CSV instead of Excel?**  
BulkImport expects the Excel template you download from the wizard.  
Use that template to avoid problems with column names and formats.

**Do I need special permissions to use BulkImport?**  
You need permission to manage devices for the target customer or site.  
If you do not see the Import button, contact your GCXONE administrator.

---

**Version:** 1.0.0  
**Last Updated:** November 25, 2025  
**Status:** Current
