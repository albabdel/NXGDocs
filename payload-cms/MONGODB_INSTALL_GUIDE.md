# MongoDB Installation Guide

## Quick Install (Requires Admin Rights)

### Option 1: Automated Install (Run as Administrator)

Right-click PowerShell and select "Run as Administrator", then:

```powershell
cd c:\nxgen-docs\payload-cms
.\install-mongodb.ps1
```

### Option 2: Manual Install

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Click: Download

2. **Install:**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install as a Service (default)
   - Uncheck "Install MongoDB Compass" (optional)

3. **Start MongoDB:**
   ```cmd
   net start MongoDB
   ```

### Option 3: Docker (If you have Docker Desktop)

```cmd
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

## Verify Installation

```cmd
# Check if MongoDB is running
sc query MongoDB

# Or check the port
netstat -ano | findstr :27017
```

## Start Payload CMS

Once MongoDB is running:

```cmd
cd c:\nxgen-docs\payload-cms
npm run dev
```

Access at: http://localhost:4000/admin

## Troubleshooting

**"Access Denied" error:**
- Run PowerShell/CMD as Administrator

**Service won't start:**
```cmd
# Try manual start
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

**Port 27017 already in use:**
- Another MongoDB instance is running
- Or change port in `.env` file
