import type { Device, DeviceFeature, IntegrationDevice, SupportStatus } from '../types/integration';

const SANITY_INTEGRATIONS_PATH = '../data/sanity-integrations.generated.json';
const STATIC_INTEGRATIONS_PATH = '../../../scripts/integration-matrix.json';

let sanityIntegrationsCache: SanityIntegration[] | null = null;

type SanityFeatureStatus = 'full' | 'partial' | 'none' | 'development' | null;

type SanityCloudModeFeatures = {
  discovery?: SanityFeatureStatus;
  live?: SanityFeatureStatus;
  playback?: SanityFeatureStatus;
  timeline?: SanityFeatureStatus;
  events?: SanityFeatureStatus;
  armDisarm?: SanityFeatureStatus;
  genesisAudio?: SanityFeatureStatus;
  ptz?: SanityFeatureStatus;
  io?: SanityFeatureStatus;
  eventAck?: SanityFeatureStatus;
  playAudio?: SanityFeatureStatus;
  timeSync?: SanityFeatureStatus;
};

type SanityLocalModeFeatures = {
  live?: SanityFeatureStatus;
  playback?: SanityFeatureStatus;
  sdkAudio?: SanityFeatureStatus;
  ptz?: SanityFeatureStatus;
  io?: SanityFeatureStatus;
  timeline?: SanityFeatureStatus;
};

type SanityDeviceHealthFeatures = {
  pollFromCloud?: boolean;
  heartbeat?: boolean;
  mobileApp?: boolean;
};

type SanityCameraHealthFeatures = {
  basic?: boolean;
  basicPlus?: boolean;
  advanced?: boolean;
};

type SanityTimelapseFeatures = {
  timelapse?: boolean;
  highRes?: boolean;
  clipExport?: boolean;
};

type SanityConnectivity = {
  integrationProtocol?: string;
  eventIntegrationMethod?: string;
  videoStreaming?: string;
  loginSecurityProfile?: string;
  customerPorts?: string;
  genesisPorts?: string;
};

type SanityDocumentation = {
  helpManualUrl?: string;
  helpdeskUrl?: string;
  configurationArticle?: { _ref: string };
  troubleshootingArticle?: { _ref: string };
};

type SanityNotesAndIssues = {
  notes?: string;
  currentIssues?: string;
  dependencies?: string;
  commonIssues?: string;
};

type SanityArchitecture = {
  singletonScaled?: string;
  apiType?: string;
  actionType?: string;
};

type SanityIntegration = {
  _id: string;
  _type: 'deviceIntegration';
  name: string;
  slug: { current: string };
  manufacturer?: string;
  brand?: string;
  deviceType?: string;
  gcxReady?: boolean;
  status?: string;
  description?: string;
  cloudModeFeatures?: SanityCloudModeFeatures;
  localModeFeatures?: SanityLocalModeFeatures;
  deviceHealthFeatures?: SanityDeviceHealthFeatures;
  cameraHealthFeatures?: SanityCameraHealthFeatures;
  timelapseFeatures?: SanityTimelapseFeatures;
  connectivity?: SanityConnectivity;
  documentation?: SanityDocumentation;
  notesAndIssues?: SanityNotesAndIssues;
  architecture?: SanityArchitecture;
};

function mapDeviceTypeToCategory(deviceType?: string): Device['category'] {
  if (!deviceType) return 'Other';
  
  const typeMap: Record<string, Device['category']> = {
    nvr: 'NVR',
    vms: 'VMS',
    camera: 'IP Camera',
    gateway: 'Router',
    sensor: 'IOT',
    access: 'Other',
    intrusion: 'IOT',
    audio: 'Other',
    other: 'Other',
  };
  
  return typeMap[deviceType.toLowerCase()] || 'Other';
}

function isSanityFeatureSupported(status?: SanityFeatureStatus): boolean {
  return status === 'full' || status === 'partial';
}

function isSanityFeaturePartial(status?: SanityFeatureStatus): boolean {
  return status === 'partial';
}

function convertSanityFeatureToDeviceFeatures(
  cloudFeatures?: SanityCloudModeFeatures,
  localFeatures?: SanityLocalModeFeatures,
  deviceHealth?: SanityDeviceHealthFeatures
): DeviceFeature[] {
  const features: DeviceFeature[] = [];
  
  if (cloudFeatures) {
    if (isSanityFeatureSupported(cloudFeatures.discovery)) {
      features.push({ name: 'Discovery', partial: isSanityFeaturePartial(cloudFeatures.discovery) });
    }
    if (isSanityFeatureSupported(cloudFeatures.live)) {
      features.push({ name: 'Live Streaming (Cloud)', partial: isSanityFeaturePartial(cloudFeatures.live) });
    }
    if (isSanityFeatureSupported(cloudFeatures.playback)) {
      features.push({ name: 'Playback (Cloud)', partial: isSanityFeaturePartial(cloudFeatures.playback) });
    }
    if (isSanityFeatureSupported(cloudFeatures.timeline)) {
      features.push({ name: 'Timeline (Cloud)', partial: isSanityFeaturePartial(cloudFeatures.timeline) });
    }
    if (isSanityFeatureSupported(cloudFeatures.events)) {
      features.push({ name: 'Events', partial: isSanityFeaturePartial(cloudFeatures.events) });
    }
    if (isSanityFeatureSupported(cloudFeatures.armDisarm)) {
      features.push({ name: 'Arm/Disarm', partial: isSanityFeaturePartial(cloudFeatures.armDisarm) });
    }
    if (isSanityFeatureSupported(cloudFeatures.genesisAudio)) {
      features.push({ name: 'Genesis Audio (SIP)', partial: isSanityFeaturePartial(cloudFeatures.genesisAudio) });
    }
    if (isSanityFeatureSupported(cloudFeatures.ptz)) {
      features.push({ name: 'PTZ/Presets', partial: isSanityFeaturePartial(cloudFeatures.ptz) });
    }
    if (isSanityFeatureSupported(cloudFeatures.io)) {
      features.push({ name: 'IO', partial: isSanityFeaturePartial(cloudFeatures.io) });
    }
    if (isSanityFeatureSupported(cloudFeatures.eventAck)) {
      features.push({ name: 'Event Acknowledgement', partial: isSanityFeaturePartial(cloudFeatures.eventAck) });
    }
  }
  
  if (localFeatures) {
    if (isSanityFeatureSupported(localFeatures.live)) {
      features.push({ name: 'Live Streaming (Local)', partial: isSanityFeaturePartial(localFeatures.live) });
    }
    if (isSanityFeatureSupported(localFeatures.playback)) {
      features.push({ name: 'Playback (Local)', partial: isSanityFeaturePartial(localFeatures.playback) });
    }
    if (isSanityFeatureSupported(localFeatures.ptz)) {
      features.push({ name: 'Local PTZ', partial: isSanityFeaturePartial(localFeatures.ptz) });
    }
  }
  
  if (deviceHealth?.mobileApp) {
    features.push({ name: 'Mobile App Enabled' });
  }
  
  return features;
}

function convertSanityIntegrationToDevice(integration: SanityIntegration): Device | null {
  if (!integration.name || !integration.manufacturer) {
    return null;
  }
  
  const category = mapDeviceTypeToCategory(integration.deviceType);
  const features = convertSanityFeatureToDeviceFeatures(
    integration.cloudModeFeatures,
    integration.localModeFeatures,
    integration.deviceHealthFeatures
  );
  
  const cloudModeFeatures: string[] = [];
  if (integration.cloudModeFeatures) {
    const cf = integration.cloudModeFeatures;
    if (isSanityFeatureSupported(cf.live)) cloudModeFeatures.push('Live Streaming');
    if (isSanityFeatureSupported(cf.playback)) cloudModeFeatures.push('Playback');
    if (isSanityFeatureSupported(cf.timeline)) cloudModeFeatures.push('Timeline');
    if (isSanityFeatureSupported(cf.events)) cloudModeFeatures.push('Events');
    if (isSanityFeatureSupported(cf.armDisarm)) cloudModeFeatures.push('Arm/Disarm');
    if (isSanityFeatureSupported(cf.ptz)) cloudModeFeatures.push('PTZ');
  }
  
  const localModeFeatures: string[] = [];
  if (integration.localModeFeatures) {
    const lf = integration.localModeFeatures;
    if (isSanityFeatureSupported(lf.live)) localModeFeatures.push('Live Streaming');
    if (isSanityFeatureSupported(lf.playback)) localModeFeatures.push('Playback');
    if (isSanityFeatureSupported(lf.ptz)) localModeFeatures.push('PTZ Control');
    if (isSanityFeatureSupported(lf.io)) localModeFeatures.push('IO Control');
    if (isSanityFeatureSupported(lf.sdkAudio)) localModeFeatures.push('Audio');
  }
  
  const connectivityRequirements: string[] = [];
  if (integration.connectivity?.integrationProtocol) {
    connectivityRequirements.push('Protocol: ' + integration.connectivity.integrationProtocol);
  }
  if (integration.connectivity?.customerPorts) {
    connectivityRequirements.push('Ports: ' + integration.connectivity.customerPorts);
  }
  
  const knownIssues: string[] = [];
  if (integration.notesAndIssues?.currentIssues) {
    knownIssues.push(integration.notesAndIssues.currentIssues);
  }
  
  let configLink: string | undefined;
  if (integration.documentation?.configurationArticle?._ref) {
    configLink = `/docs/${integration.slug.current}`;
  } else if (integration.documentation?.helpManualUrl) {
    configLink = integration.documentation.helpManualUrl;
  }
  
  return {
    name: integration.brand || integration.name,
    manufacturer: integration.manufacturer,
    brand: integration.brand || undefined,
    category,
    features,
    configLink,
    gcxReady: integration.gcxReady ?? false,
    knownIssues: knownIssues.length > 0 ? knownIssues : undefined,
    connectivityRequirements: connectivityRequirements.length > 0 ? connectivityRequirements : undefined,
    cloudModeFeatures: cloudModeFeatures.length > 0 ? cloudModeFeatures : undefined,
    localModeFeatures: localModeFeatures.length > 0 ? localModeFeatures : undefined,
  };
}

export function isSupported(status?: SupportStatus | string): boolean {
  if (!status) return false;
  if (typeof status === 'string') {
    return status === 'Supported' || status === 'Partially Supported';
  }
  return false;
}

export function isPartialSupport(status?: SupportStatus | string): boolean {
  if (!status) return false;
  return status === 'Partially Supported';
}

export function convertIntegrationToDevice(integration: IntegrationDevice): Device | null {
  if (!integration.manufacturer) {
    return null;
  }
  
  const category = mapDeviceTypeToCategory(integration.deviceType);
  const features: DeviceFeature[] = [];
  
  if (integration.cloudMode) {
    const cloudFeatures = integration.cloudMode;
    if (isSupported(cloudFeatures.discovery)) features.push({ name: 'Discovery', partial: isPartialSupport(cloudFeatures.discovery) });
    if (isSupported(cloudFeatures.live)) features.push({ name: 'Live Streaming (Cloud)', partial: isPartialSupport(cloudFeatures.live) });
    if (isSupported(cloudFeatures.playback)) features.push({ name: 'Playback (Cloud)', partial: isPartialSupport(cloudFeatures.playback) });
    if (isSupported(cloudFeatures.timeline)) features.push({ name: 'Timeline (Cloud)', partial: isPartialSupport(cloudFeatures.timeline) });
    if (isSupported(cloudFeatures.events)) features.push({ name: 'Events', partial: isPartialSupport(cloudFeatures.events) });
    if (isSupported(cloudFeatures.armDisarm)) features.push({ name: 'Arm/Disarm', partial: isPartialSupport(cloudFeatures.armDisarm) });
    if (isSupported(cloudFeatures.genesisAudio)) features.push({ name: 'Genesis Audio (SIP)', partial: isPartialSupport(cloudFeatures.genesisAudio) });
    if (isSupported(cloudFeatures.ptz)) features.push({ name: 'PTZ/Presets', partial: isPartialSupport(cloudFeatures.ptz) });
    if (isSupported(cloudFeatures.io)) features.push({ name: 'IO', partial: isPartialSupport(cloudFeatures.io) });
    if (isSupported(cloudFeatures.eventAck)) features.push({ name: 'Event Acknowledgement', partial: isPartialSupport(cloudFeatures.eventAck) });
  }
  
  if (integration.localMode) {
    const localFeatures = integration.localMode;
    if (isSupported(localFeatures.live)) features.push({ name: 'Live Streaming (Local)', partial: isPartialSupport(localFeatures.live) });
    if (isSupported(localFeatures.playback)) features.push({ name: 'Playback (Local)', partial: isPartialSupport(localFeatures.playback) });
    if (isSupported(localFeatures.ptz)) features.push({ name: 'Local PTZ', partial: isPartialSupport(localFeatures.ptz) });
  }
  
  if (integration.deviceHealth?.mobileApp === 'Supported') {
    features.push({ name: 'Mobile App Enabled' });
  }
  
  const cloudModeFeatures: string[] = [];
  if (integration.cloudMode) {
    if (isSupported(integration.cloudMode.live)) cloudModeFeatures.push('Live Streaming');
    if (isSupported(integration.cloudMode.playback)) cloudModeFeatures.push('Playback');
    if (isSupported(integration.cloudMode.timeline)) cloudModeFeatures.push('Timeline');
    if (isSupported(integration.cloudMode.events)) cloudModeFeatures.push('Events');
    if (isSupported(integration.cloudMode.armDisarm)) cloudModeFeatures.push('Arm/Disarm');
    if (isSupported(integration.cloudMode.ptz)) cloudModeFeatures.push('PTZ');
  }
  
  const localModeFeatures: string[] = [];
  if (integration.localMode) {
    if (isSupported(integration.localMode.live)) localModeFeatures.push('Live Streaming');
    if (isSupported(integration.localMode.playback)) localModeFeatures.push('Playback');
    if (isSupported(integration.localMode.ptz)) localModeFeatures.push('PTZ Control');
    if (isSupported(integration.localMode.io)) localModeFeatures.push('IO Control');
    if (isSupported(integration.localMode.sdkAudio)) localModeFeatures.push('Audio');
  }
  
  const connectivityRequirements: string[] = [];
  if (integration.connectivity?.integrationProtocol) {
    connectivityRequirements.push('Protocol: ' + integration.connectivity.integrationProtocol);
  }
  if (integration.connectivity?.customerPorts) {
    connectivityRequirements.push('Ports: ' + integration.connectivity.customerPorts);
  }
  
  const knownIssues: string[] = [];
  if (integration.comments?.currentIssues) {
    knownIssues.push(integration.comments.currentIssues);
  }
  
  const gcxReady = integration.gcxReady === 'Supported';
  const name = integration.brand || integration.manufacturer;
  
  return {
    name: name || integration.manufacturer,
    manufacturer: integration.manufacturer,
    brand: integration.brand || undefined,
    category,
    features,
    gcxReady,
    knownIssues: knownIssues.length > 0 ? knownIssues : undefined,
    connectivityRequirements: connectivityRequirements.length > 0 ? connectivityRequirements : undefined,
    cloudModeFeatures: cloudModeFeatures.length > 0 ? cloudModeFeatures : undefined,
    localModeFeatures: localModeFeatures.length > 0 ? localModeFeatures : undefined,
  };
}

export function mapStaticDeviceTypeToCategory(deviceType: string): Device['category'] {
  const typeMap: Record<string, Device['category']> = {
    'NVR': 'NVR',
    'VMS': 'VMS',
    'IPC': 'IP Camera',
    'IP Camera': 'IP Camera',
    'AI BOX': 'AI Box',
    'P2P Cloud VMS': 'Cloud VMS',
    'Cloud NVR': 'Cloud VMS',
    'Cloud VMS': 'Cloud VMS',
    'Router': 'Router',
    'IOT': 'IOT',
    'IOT battery Mgmt': 'IOT',
    'IOT Mining': 'IOT',
    'IOT Air Horn': 'IOT',
    'PIR CAM': 'IOT',
    'PIR Cam': 'IOT',
    'SIP Twillio': 'Other',
    'AI Cloud': 'Other',
    'hik': 'Other',
    'NVR/IP Camera': 'NVR',
    'Not supported': 'Other',
  };
  return typeMap[deviceType] || 'Other';
}

async function loadSanityIntegrations(): Promise<SanityIntegration[]> {
  if (sanityIntegrationsCache !== null) {
    return sanityIntegrationsCache;
  }
  
  try {
    const sanityModule = await import(SANITY_INTEGRATIONS_PATH);
    const integrations = sanityModule.default || sanityModule;
    sanityIntegrationsCache = Array.isArray(integrations) ? integrations : [];
    return sanityIntegrationsCache;
  } catch {
    console.warn('[fetch-integrations] Sanity integrations file not found, falling back to static JSON');
    return [];
  }
}

async function loadStaticIntegrations(): Promise<IntegrationDevice[]> {
  try {
    const staticModule = await import(STATIC_INTEGRATIONS_PATH);
    const integrations = staticModule.default || staticModule;
    return Array.isArray(integrations) ? integrations : [];
  } catch {
    console.warn('[fetch-integrations] Static integrations file not found');
    return [];
  }
}

export async function fetchIntegrations(): Promise<Device[]> {
  const [sanityIntegrations, staticIntegrations] = await Promise.all([
    loadSanityIntegrations(),
    loadStaticIntegrations(),
  ]);
  
  const devices: Device[] = [];
  
  if (sanityIntegrations.length > 0) {
    for (const integration of sanityIntegrations) {
      const device = convertSanityIntegrationToDevice(integration);
      if (device) {
        devices.push(device);
      }
    }
  }
  
  if (devices.length === 0 && staticIntegrations.length > 0) {
    for (const integration of staticIntegrations) {
      if (integration.deviceType && integration.deviceType !== 'Not supported') {
        const device = convertIntegrationToDevice(integration);
        if (device) {
          devices.push(device);
        }
      }
    }
  }
  
  return devices;
}

export function fetchIntegrationsSync(): Device[] {
  try {
    const sanityIntegrations = require(SANITY_INTEGRATIONS_PATH);
    const integrations = sanityIntegrations.default || sanityIntegrations;
    if (Array.isArray(integrations) && integrations.length > 0) {
      return integrations
        .map(convertSanityIntegrationToDevice)
        .filter((d): d is Device => d !== null);
    }
  } catch {
    // Fall through to static
  }
  
  try {
    const staticIntegrations = require(STATIC_INTEGRATIONS_PATH);
    const integrations = staticIntegrations.default || staticIntegrations;
    if (Array.isArray(integrations)) {
      return integrations
        .filter((d: IntegrationDevice) => d.deviceType && d.deviceType !== 'Not supported')
        .map(convertIntegrationToDevice)
        .filter((d): d is Device => d !== null);
    }
  } catch {
    // No integrations available
  }
  
  return [];
}

export { type SanityIntegration };
