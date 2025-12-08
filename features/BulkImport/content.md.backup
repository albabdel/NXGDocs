---
sidebar_position: 2
image: ./logo.svg
---

# BulkImport

**Thousands of Sites. Imported in Minutes.**

Streamline your site onboarding process with powerful bulk import capabilities that can handle thousands of locations, devices, and configurations in a single operation.

## Overview

Bulk Import eliminates the tedious manual process of adding sites one by one. Whether you're migrating from another platform or scaling up operations, import thousands of sites with their complete configurations in minutes, not months.

## Key Features

- **Mass Site Creation**: Import thousands of sites simultaneously
- **Configuration Templates**: Apply standardized settings across all sites
- **Data Validation**: Automatic verification of import data integrity
- **Progress Tracking**: Real-time import status and error reporting
- **Rollback Capability**: Undo imports if issues are detected
- **Flexible Formats**: Support for CSV, Excel, and API imports

## Import Process

```javascript
// Bulk import configuration
const bulkImport = new BulkImporter({
  source: 'sites_export.csv',
  template: 'standard_security_site',
  validation: true,
  batchSize: 100
});

// Monitor import progress
bulkImport.on('progress', (status) => {
  console.log(`Imported: ${status.completed}/${status.total}`);
});

bulkImport.on('complete', (results) => {
  console.log(`Successfully imported ${results.success} sites`);
  if (results.errors.length > 0) {
    console.log(`${results.errors.length} sites had issues`);
  }
});

// Start the import
await bulkImport.execute();
```

## Data Mapping

Configure how your data maps to Genesis platform fields:

```csv
Site Name,Address,Contact Email,Device Count,Alarm Zones
Main Office,123 Business St,admin@company.com,12,5
Warehouse A,456 Industrial Ave,warehouse@company.com,8,3
Remote Site 1,789 Remote Rd,remote@company.com,4,2
```

## Validation Rules

- **Required Fields**: Ensure all mandatory data is present
- **Format Checking**: Validate email addresses, phone numbers, coordinates
- **Duplicate Detection**: Identify and handle duplicate entries
- **Business Logic**: Verify relationships between devices and zones

## Benefits

**Time Savings**
- Hours instead of weeks for large deployments
- Automated configuration application
- Reduced manual data entry errors

**Scalability**
- Handle enterprise-scale deployments
- Support for unlimited site counts
- Efficient resource utilization

**Accuracy**
- Validation prevents configuration errors
- Standardized templates ensure consistency
- Audit trail for all changes

## Use Cases

- **System Migrations**: Moving from legacy platforms
- **New Deployments**: Large-scale rollouts
- **Acquisitions**: Integrating acquired companies
- **Franchise Operations**: Rapid expansion support

## Getting Started

Prepare your site data in CSV format, select appropriate templates, and let Bulk Import handle the rest. Our validation engine will catch any issues before they impact your operations. 