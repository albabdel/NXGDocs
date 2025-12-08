# Payload CMS Setup - Complete Instructions

## Current Status
✅ Dependencies installed  
✅ Configuration files created  
⚠️ **MongoDB required** (not installed)

## Install MongoDB (Choose ONE option)

### Option 1: Quick Install with Chocolatey (Easiest)

Open PowerShell as Administrator and run:

```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb -y

# Start MongoDB
net start MongoDB
```

### Option 2: Manual Download & Install

1. Download: https://www.mongodb.com/try/download/community
2. Run installer (choose Complete installation)
3. Install as Windows Service
4. Start service:
   ```cmd
   net start MongoDB
   ```

### Option 3: Docker (If Docker Desktop installed)

```cmd
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

## Start Payload CMS

Once MongoDB is running:

```cmd
cd c:\nxgen-docs\payload-cms
npm run dev
```

Access at: **http://localhost:4000/admin**

## Verify MongoDB is Running

```cmd
# Check service status
sc query MongoDB

# Or check port
netstat -ano | findstr :27017
```

## Troubleshooting

**"Access Denied"**: Run CMD/PowerShell as Administrator

**Port 27017 in use**: Another MongoDB is running or change port in `.env`

**Service won't start**: Check Windows Services app for MongoDB service

## Need Help?

The automated install script attempted to install MongoDB but requires admin privileges.  
Please run one of the options above manually.
