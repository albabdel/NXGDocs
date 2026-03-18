export type SupportStatus = 'Supported' | 'Not Supported' | 'Partially Supported' | 'Plan in Future' | 'N/A' | null;

export type CloudModeFeatures = {
    discovery?: SupportStatus;
    live?: SupportStatus;
    playback?: SupportStatus;
    timeline?: SupportStatus;
    events?: SupportStatus;
    armDisarm?: SupportStatus;
    genesisAudio?: SupportStatus;
    ptz?: SupportStatus;
    io?: SupportStatus;
    eventAck?: SupportStatus;
    playAudio?: SupportStatus;
    timeSync?: SupportStatus;
};

export type LocalModeFeatures = {
    live?: SupportStatus;
    playback?: SupportStatus;
    sdkAudio?: SupportStatus;
    ptz?: SupportStatus;
    io?: SupportStatus;
    timeline?: SupportStatus;
};

export type DeviceHealthFeatures = {
    pollFromCloud?: SupportStatus;
    heartbeat?: SupportStatus;
    mobileApp?: SupportStatus;
};

export type CameraHealthFeatures = {
    basic?: SupportStatus;
    basicPlus?: SupportStatus;
    advanced?: SupportStatus;
};

export type TimelapseFeatures = {
    support?: SupportStatus;
    differentiation?: string | null;
    highResSupport?: SupportStatus;
    clipExport?: SupportStatus;
};

export type ConnectivityInfo = {
    integrationProtocol?: string | null;
    eventIntegrationMethod?: string | null;
    videoStreaming?: string | null;
    loginSecurity?: string | null;
    customerPorts?: string | null;
    genesisPorts?: string | null;
};

export type CommentsInfo = {
    notes?: string | null;
    currentIssues?: string | null;
    dependencies?: string | null;
    commonIssues?: string | null;
};

export type ArchitectureInfo = {
    singleton?: string | null;
    api?: string | null;
    action?: string | null;
};

export type DocumentsInfo = {
    helpManuals?: string[];
    helpdesk?: string[];
};

export type IntegrationDevice = {
    manufacturer: string;
    brand?: string | null;
    deviceType: string;
    gcxReady?: SupportStatus | string;
    cloudMode: CloudModeFeatures;
    localMode: LocalModeFeatures;
    deviceHealth: DeviceHealthFeatures;
    cameraHealth: CameraHealthFeatures;
    timelapse: TimelapseFeatures;
    connectivity: ConnectivityInfo;
    documents: DocumentsInfo;
    comments: CommentsInfo;
    architecture: ArchitectureInfo;
};

export type DeviceFeature = {
    name: string;
    partial?: boolean;
};

export type Device = {
    name: string;
    manufacturer: string;
    brand?: string;
    category: 'NVR' | 'VMS' | 'IP Camera' | 'AI Box' | 'Router' | 'IOT' | 'Cloud VMS' | 'Other';
    features: DeviceFeature[];
    configLink?: string;
    gcxReady: boolean;
    knownIssues?: string[];
    connectivityRequirements?: string[];
    cloudModeFeatures?: string[];
    localModeFeatures?: string[];
};
