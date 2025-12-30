# Configuration Wizard Templates

Interactive step-by-step wizards for device configuration and onboarding.

## Camera Configuration Wizard

### Wizard Structure
```typescript
interface CameraWizardSteps {
  step1: DeviceSelection;      // Choose manufacturer/model
  step2: NetworkSetup;         // IP, ports, credentials  
  step3: VideoConfiguration;   // Resolution, FPS, bitrate
  step4: EventSetup;           // Motion, analytics
  step5: AdvancedOptions;      // NTP, HTTPS, etc.
  step6: TestAndSave;          // Verify and save
}
```

### Step 1: Device Selection
```jsx
<WizardStep 
  title="Select Your Device"
  description="Choose the manufacturer and model of your camera"
>
  <DeviceSelector
    onManufacturerChange={handleManufacturerChange}
    onModelChange={handleModelChange}
    manufacturers={supportedManufacturers}
    models={filteredModels}
    autoDetect={true}
  />
  
  <DevicePreview
    manufacturer={selectedManufacturer}
    model={selectedModel}
    specifications={deviceSpecs}
  />
</WizardStep>
```

### Step 2: Network Setup
```jsx
<WizardStep
  title="Network Configuration" 
  description="Configure network connection and credentials"
>
  <NetworkForm
    fields={[
      {
        name: "ipAddress",
        label: "IP Address",
        type: "ip",
        required: true,
        validation: "ipv4",
        placeholder: "192.168.1.100"
      },
      {
        name: "port", 
        label: "Port",
        type: "number",
        default: 80,
        range: [1, 65535]
      },
      {
        name: "username",
        label: "Username", 
        type: "text",
        required: true,
        default: "admin"
      },
      {
        name: "password",
        label: "Password",
        type: "password", 
        required: true,
        strength: true
      }
    ]}
  />
  
  <ConnectionTest
    onTest={testConnection}
    status={connectionStatus}
    results={testResults}
  />
</WizardStep>
```

### Step 3: Video Configuration
```jsx
<WizardStep
  title="Video Settings"
  description="Configure video streams and quality"
>
  <StreamConfiguration>
    <StreamSettings
      streamType="main"
      title="Main Stream (Recording)"
      settings={{
        resolution: "1080p",
        frameRate: "25fps", 
        bitrate: "4Mbps",
        codec: "H.264"
      }}
      presets={mainStreamPresets}
    />
    
    <StreamSettings
      streamType="sub"
      title="Sub Stream (Live View)"
      settings={{
        resolution: "720p",
        frameRate: "15fps",
        bitrate: "1Mbps", 
        codec: "H.264"
      }}
      presets={subStreamPresets}
    />
  </StreamConfiguration>
  
  <VideoPreview
    streamUrl={previewUrl}
    settings={videoSettings}
  />
</WizardStep>
```

### Step 4: Event Setup
```jsx
<WizardStep
  title="Event Configuration"
  description="Configure motion detection and analytics"
>
  <EventConfiguration>
    <MotionDetection
      enabled={motionEnabled}
      sensitivity={motionSensitivity}
      zones={motionZones}
      onZoneChange={handleZoneChange}
    />
    
    <SmartEvents
      events={[
        {
          type: "lineCrossing",
          enabled: true,
          sensitivity: 50,
          direction: "bidirectional"
        },
        {
          type: "intrusion", 
          enabled: true,
          sensitivity: 60,
          timeThreshold: 3
        }
      ]}
    />
    
    <EventSchedule
      schedule={eventSchedule}
      onScheduleChange={handleScheduleChange}
    />
  </EventConfiguration>
</WizardStep>
```

### Step 5: Advanced Options
```jsx
<WizardStep
  title="Advanced Settings"
  description="Configure additional features and security"
>
  <AdvancedSettings>
    <TimeConfiguration
      timezone={selectedTimezone}
      ntpEnabled={true}
      ntpServer="time1.nxgen.cloud"
      dstEnabled={true}
    />
    
    <SecuritySettings
      httpsEnabled={false}
      authMethod="digest"
      ipWhitelist={[]}
    />
    
    <StorageSettings
      localStorage={true}
      cloudStorage={false}
      retentionDays={30}
    />
  </AdvancedSettings>
</WizardStep>
```

### Step 6: Test and Save
```jsx
<WizardStep
  title="Test & Save Configuration"
  description="Verify settings and save device configuration"
>
  <ConfigurationSummary
    settings={allSettings}
    editable={true}
  />
  
  <FinalTests>
    <TestItem
      name="Connection Test"
      status={connectionTest.status}
      details={connectionTest.details}
    />
    <TestItem
      name="Video Stream Test"
      status={videoTest.status}
      details={videoTest.details}
    />
    <TestItem
      name="Event Test"
      status={eventTest.status}
      details={eventTest.details}
    />
  </FinalTests>
  
  <SaveConfiguration
    onSave={saveDevice}
    onCancel={cancelWizard}
    saving={isSaving}
  />
</WizardStep>
```

## NVR Onboarding Wizard

### Multi-Camera Discovery
```jsx
<WizardStep
  title="NVR Camera Discovery"
  description="Discover and configure cameras connected to your NVR"
>
  <CameraDiscovery
    nvr={nvrDetails}
    onDiscovery={handleCameraDiscovery}
    discoveredCameras={cameras}
  />
  
  <CameraList
    cameras={cameras}
    onCameraSelect={handleCameraSelect}
    onCameraConfig={handleCameraConfig}
  />
  
  <BulkConfiguration
    selectedCameras={selectedCameras}
    template={configTemplate}
    onApplyTemplate={applyBulkConfig}
  />
</WizardStep>
```

## Alarm Panel Wizard

### Zone Configuration
```jsx
<WizardStep
  title="Zone Configuration"
  description="Configure alarm zones and sensors"
>
  <ZoneMapping>
    <ZoneList
      zones={alarmZones}
      onZoneEdit={editZone}
      onZoneAdd={addZone}
    />
    
    <ZoneEditor
      zone={selectedZone}
      sensorTypes={supportedSensors}
      onSave={saveZone}
    />
  </ZoneMapping>
  
  <ZoneTest
    zones={configuredZones}
    onTest={testZone}
    results={zoneTestResults}
  />
</WizardStep>
```

## Bulk Device Wizard

### Template-Based Configuration
```jsx
<WizardStep
  title="Bulk Device Configuration"
  description="Configure multiple devices using templates"
>
  <DeviceImport
    onFileUpload={handleDeviceImport}
    template={bulkTemplate}
    devices={importedDevices}
  />
  
  <TemplateSelector
    templates={configTemplates}
    onTemplateSelect={selectTemplate}
    selectedTemplate={activeTemplate}
  />
  
  <BulkProgress
    devices={deviceList}
    progress={configProgress}
    errors={configErrors}
  />
</WizardStep>
```

## Wizard Components

### Base Wizard Component
```jsx
interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function ConfigurationWizard({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onCancel
}: WizardProps) {
  return (
    <div className="wizard-container">
      <WizardHeader
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepChange}
      />
      
      <WizardContent>
        {steps[currentStep].component}
      </WizardContent>
      
      <WizardFooter
        canGoBack={currentStep > 0}
        canGoNext={steps[currentStep].isValid}
        isLastStep={currentStep === steps.length - 1}
        onBack={() => onStepChange(currentStep - 1)}
        onNext={() => onStepChange(currentStep + 1)}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </div>
  );
}
```

### Progress Indicator
```jsx
export function WizardProgress({ 
  steps, 
  currentStep 
}: {
  steps: WizardStep[];
  currentStep: number;
}) {
  return (
    <div className="wizard-progress">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`progress-step ${
            index < currentStep ? 'completed' :
            index === currentStep ? 'active' : 'pending'
          }`}
        >
          <div className="step-number">
            {index < currentStep ? '✓' : index + 1}
          </div>
          <div className="step-title">{step.title}</div>
        </div>
      ))}
    </div>
  );
}
```

### Validation System
```jsx
interface ValidationRule {
  field: string;
  rule: 'required' | 'ip' | 'port' | 'email' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
}

export function useWizardValidation(rules: ValidationRule[]) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (data: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    
    rules.forEach(rule => {
      const value = data[rule.field];
      let isValid = true;
      
      switch (rule.rule) {
        case 'required':
          isValid = value != null && value !== '';
          break;
        case 'ip':
          isValid = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
          break;
        case 'port':
          isValid = value >= 1 && value <= 65535;
          break;
        case 'custom':
          isValid = rule.validator ? rule.validator(value) : true;
          break;
      }
      
      if (!isValid) {
        newErrors[rule.field] = rule.message;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return { errors, validate };
}
```

## Wizard Templates

### Camera Wizard Template
```json
{
  "name": "IP Camera Configuration",
  "description": "Step-by-step camera setup wizard",
  "estimatedTime": "5-10 minutes",
  "steps": [
    {
      "id": "device-selection",
      "title": "Device Selection",
      "component": "DeviceSelector",
      "required": true
    },
    {
      "id": "network-setup", 
      "title": "Network Setup",
      "component": "NetworkConfiguration",
      "required": true
    },
    {
      "id": "video-config",
      "title": "Video Configuration", 
      "component": "VideoSettings",
      "required": false
    },
    {
      "id": "event-setup",
      "title": "Event Setup",
      "component": "EventConfiguration", 
      "required": false
    },
    {
      "id": "advanced",
      "title": "Advanced Settings",
      "component": "AdvancedOptions",
      "required": false
    },
    {
      "id": "test-save",
      "title": "Test & Save",
      "component": "TestAndSave",
      "required": true
    }
  ]
}
```

### NVR Wizard Template
```json
{
  "name": "NVR Configuration", 
  "description": "Configure NVR and connected cameras",
  "estimatedTime": "10-20 minutes",
  "steps": [
    {
      "id": "nvr-setup",
      "title": "NVR Setup",
      "component": "NVRConfiguration"
    },
    {
      "id": "camera-discovery",
      "title": "Camera Discovery", 
      "component": "CameraDiscovery"
    },
    {
      "id": "camera-config",
      "title": "Camera Configuration",
      "component": "BulkCameraConfig"
    },
    {
      "id": "recording-setup",
      "title": "Recording Setup",
      "component": "RecordingConfiguration"
    },
    {
      "id": "test-save",
      "title": "Test & Save", 
      "component": "TestAndSave"
    }
  ]
}
```

## Usage Examples

### Basic Camera Wizard
```jsx
import { CameraConfigurationWizard } from '@site/src/components/wizards';

export function CameraSetupPage() {
  const handleWizardComplete = (config) => {
    // Save device configuration
    saveDeviceConfig(config);
  };
  
  return (
    <CameraConfigurationWizard
      manufacturer="hikvision"
      onComplete={handleWizardComplete}
      onCancel={() => navigate('/devices')}
    />
  );
}
```

### Embedded Wizard
```jsx
// In device documentation
<ConfigWizard 
  type="camera-setup" 
  manufacturer="hikvision"
  model="DS-2CD2347G2-LU"
  embedded={true}
/>
```