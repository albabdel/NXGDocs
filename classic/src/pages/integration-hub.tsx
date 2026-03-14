import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
    Plug,
    Home,
    ChevronRight,
    Search,
    X,
    Server,
    Camera,
    Cpu,
    Router,
    Radio,
    Zap,
    Video,
    Play,
    Activity,
    FileText,
    Database,
    Cloud,
    Eye,
    Box,
    HardDrive,
    Check,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    RotateCcw,
} from 'lucide-react';
import styles from './index.module.css';
import integrationData from '../../../scripts/integration-matrix.json';

type DeviceCategory = 'NVR' | 'VMS' | 'IP Camera' | 'AI Box' | 'Router' | 'IOT' | 'Cloud VMS' | 'PIR CAM' | 'Other';

type IntegrationDevice = {
    manufacturer: string;
    brand: string;
    deviceType: string;
    gcxReady: string;
    cloudMode: Record<string, string>;
    localMode: Record<string, string>;
    deviceHealth: Record<string, string>;
    cameraHealth: Record<string, string>;
    timelapse: Record<string, string | null>;
    connectivity: {
        integrationProtocol: string;
        eventIntegrationMethod: string;
        videoStreaming: string;
        loginSecurity: string;
        customerPorts: string;
        genesisPorts: string;
    };
    documents: {
        helpManuals: string[];
        helpdesk: string[];
    };
    comments: {
        notes: string;
        currentIssues: string;
        dependencies: string;
        commonIssues: string;
    };
};

type Device = {
    name: string;
    manufacturer: string;
    brand: string;
    category: DeviceCategory;
    gcxReady: boolean;
    features: string[];
    cloudFeatures: string[];
    localFeatures: string[];
    connectivity: IntegrationDevice['connectivity'];
    notes: string;
    issues: string;
    configLink: string | null;
    hasManual: boolean;
};

const categoryConfig: Record<DeviceCategory, { icon: React.ReactNode; color: string }> = {
    'NVR': { icon: <Server className="w-5 h-5" />, color: 'text-amber-400' },
    'VMS': { icon: <Database className="w-5 h-5" />, color: 'text-blue-400' },
    'IP Camera': { icon: <Camera className="w-5 h-5" />, color: 'text-green-400' },
    'AI Box': { icon: <Cpu className="w-5 h-5" />, color: 'text-purple-400' },
    'Router': { icon: <Router className="w-5 h-5" />, color: 'text-cyan-400' },
    'IOT': { icon: <Radio className="w-5 h-5" />, color: 'text-pink-400' },
    'Cloud VMS': { icon: <Cloud className="w-5 h-5" />, color: 'text-sky-400' },
    'PIR CAM': { icon: <Eye className="w-5 h-5" />, color: 'text-orange-400' },
    'Other': { icon: <Box className="w-5 h-5" />, color: 'text-gray-400' },
};

function normalizeManufacturerName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const DOC_URL_MAP: Record<string, string> = {
    'hikvision': '/docs/devices/hikvision',
    'dahua': '/docs/devices/dahua',
    'axis': '/docs/devices/axis-ip-camera',
    'axiscamerastation': '/docs/devices/axis-camera-station',
    'axis cs pro': '/docs/devices/axis-cs-pro',
    'milestone': '/docs/devices/milestone-gcx-one',
    'axxon': '/docs/devices/axxon',
    'ajax': '/docs/devices/ajax',
    'camect': '/docs/devices/camect',
    'eagleeye': '/docs/devices/eagle-eye',
    'eagle eye': '/docs/devices/eagle-eye',
    'senstar': '/docs/devices/senstar',
    'victron': '/docs/devices/victron',
    'genesisaudio': '/docs/devices/genesis-audio',
    'hanwha': '/docs/devices/hanwha-device-configuration',
    'nxwitness': '/docs/devices/hanwha-device-configuration',
    'dahua cloud arc': '/docs/devices/dahua-cloud-arc',
    'hikproconnect': '/docs/devices/hikproconnect-troubleshoot',
    'bosch': '/docs/devices/bosch',
    'mobotix': '/docs/devices/mobotix',
    'uniview': '/docs/devices/uniview',
    'geutebrück': '/docs/devices/geutebruck',
    'geutebruck': '/docs/devices/geutebruck',
    'honeywell': '/docs/devices/honeywell',
    'eneo': '/docs/devices/eneo',
    'eneoip': '/docs/devices/eneo',
    'ganz': '/docs/devices/ganz',
    'avigilon': '/docs/devices/avigilon',
    'avigilon unity': '/docs/devices/avigilon',
    'heitel': '/docs/devices/heitel',
    'netvu': '/docs/devices/netvu',
    'teltonika': '/docs/devices/teltonika-iot',
    'teltonika-iot': '/docs/devices/teltonika-iot',
    'vivotek': '/docs/devices/vivotek',
    'vivotek vortex': '/docs/devices/vivotek-vortex',
    'reconeyez': '/docs/devices/reconeyez',
    'efoy': '/docs/devices/efoy',
    'innovi': '/docs/devices/innovi',
    'davantis': '/docs/devices/davantis',
    'rosenberger': '/docs/devices/rosenberger',
    'autoaid': '/docs/devices/autoaid',
    'auraigateway': '/docs/devices/auraigateway',
    'onvif': '/docs/devices/onvif',
    'spykebox': '/docs/devices/spykebox',
    'viasys': '/docs/devices/viasys-shieldbox',
    'shieldbox': '/docs/devices/viasys-shieldbox',
    'essence': '/docs/devices/essence-my-shield',
    'miwi': '/docs/devices/miwi-urmet-grundig',
    'urmet': '/docs/devices/miwi-urmet-grundig',
    'grundig': '/docs/devices/miwi-urmet-grundig',
};

function mapCategory(deviceType: string): DeviceCategory {
    const type = deviceType?.toLowerCase() || '';
    if (type.includes('nvr') || type.includes('recorder')) return 'NVR';
    if (type.includes('vms') || type.includes('p2p cloud')) return 'Cloud VMS';
    if (type.includes('camera') || type.includes('ipc')) return 'IP Camera';
    if (type.includes('ai') || type.includes('box')) return 'AI Box';
    if (type.includes('router') || type.includes('gateway')) return 'Router';
    if (type.includes('iot') || type.includes('sensor')) return 'IOT';
    if (type.includes('pir')) return 'PIR CAM';
    return 'Other';
}

function convertToDevice(data: IntegrationDevice): Device {
    const name = data.brand || data.manufacturer || 'Unknown';
    const cloudFeatures = Object.entries(data.cloudMode || {})
        .filter(([_, v]) => v === 'Supported')
        .map(([k]) => k);
    const localFeatures = Object.entries(data.localMode || {})
        .filter(([_, v]) => v === 'Supported')
        .map(([k]) => k);
    
    const manualUrl = data.documents?.helpManuals?.[0];
    const manufacturerKey = normalizeManufacturerName(data.manufacturer || '');
    const brandKey = normalizeManufacturerName(data.brand || '');
    const mappedUrl = DOC_URL_MAP[manufacturerKey] || DOC_URL_MAP[brandKey] || DOC_URL_MAP[(data.manufacturer || '').toLowerCase()] || null;
    
    const configLink = manualUrl || mappedUrl || data.documents?.helpdesk?.[0] || null;
    
    return {
        name,
        manufacturer: data.manufacturer || 'Unknown',
        brand: data.brand || '',
        category: mapCategory(data.deviceType),
        gcxReady: data.gcxReady === 'Supported' || data.gcxReady === 'Yes',
        features: [...cloudFeatures.slice(0, 6), ...localFeatures.slice(0, 3)],
        cloudFeatures,
        localFeatures,
        connectivity: data.connectivity,
        notes: data.comments?.notes || '',
        issues: data.comments?.currentIssues || '',
        configLink,
        hasManual: !!configLink,
    };
}

const allDevices: Device[] = (integrationData as IntegrationDevice[])
    .filter(d => d.deviceType && d.deviceType !== 'Not supported')
    .map(convertToDevice);

export default function IntegrationHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [filters, setFilters] = useState({
        manufacturers: [] as string[],
        categories: [] as DeviceCategory[],
        gcxOnly: false,
    });
    const [showFilters, setShowFilters] = useState(false);

    const manufacturers = useMemo(() => 
        [...new Set(allDevices.map(d => d.manufacturer))].sort(),
        []);

    const categories = useMemo(() => 
        [...new Set(allDevices.map(d => d.category))].sort(),
        []);

    const filteredDevices = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return allDevices.filter(device => {
            const matchesSearch = !query || 
                device.name.toLowerCase().includes(query) ||
                device.manufacturer.toLowerCase().includes(query) ||
                device.brand?.toLowerCase().includes(query) ||
                device.category.toLowerCase().includes(query);
            
            const matchesManufacturer = filters.manufacturers.length === 0 ||
                filters.manufacturers.includes(device.manufacturer);
            
            const matchesCategory = filters.categories.length === 0 ||
                filters.categories.includes(device.category);
            
            const matchesGcx = !filters.gcxOnly || device.gcxReady;
            
            return matchesSearch && matchesManufacturer && matchesCategory && matchesGcx;
        });
    }, [searchQuery, filters]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        allDevices.forEach(d => {
            stats[d.category] = (stats[d.category] || 0) + 1;
        });
        return stats;
    }, []);

    const toggleFilter = (type: 'manufacturers' | 'categories', value: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value as never)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value as never],
        }));
    };

    const clearFilters = () => {
        setFilters({ manufacturers: [], categories: [], gcxOnly: false });
        setSearchQuery('');
    };

    const activeFilterCount = filters.manufacturers.length + filters.categories.length + (filters.gcxOnly ? 1 : 0);

    return (
        <Layout title="Integration Hub | GCXONE" description="Browse supported devices and integrations">
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link to="/" className="flex items-center gap-1 hover:text-[#E8B058] transition-colors no-underline">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span style={{ color: 'var(--ifm-color-content)' }}>Integration Hub</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="text-center mb-12">
                        <span className={styles.sectionBadge}>Supported Devices</span>
                        <h1 className="text-4xl font-bold mt-4 mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                            Integration Hub
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Browse {allDevices.length}+ supported devices and integrations for GCXONE monitoring platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                        {Object.entries(categoryStats).map(([category, count]) => {
                            const config = categoryConfig[category as DeviceCategory] || categoryConfig['Other'];
                            return (
                                <div 
                                    key={category}
                                    className="p-4 rounded-xl border border-white/10 bg-white/5 text-center cursor-pointer hover:border-[#E8B058]/30 transition-colors"
                                    onClick={() => toggleFilter('categories', category)}
                                    style={{
                                        borderColor: filters.categories.includes(category as DeviceCategory) 
                                            ? 'rgba(232, 176, 88, 0.5)' 
                                            : undefined
                                    }}
                                >
                                    <div className={`${config.color} mb-2 flex justify-center`}>{config.icon}</div>
                                    <div className="text-2xl font-bold text-white">{count}</div>
                                    <div className="text-xs text-white/60">{category}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-8 p-6 rounded-xl border border-white/10 bg-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                    </h3>
                                    {activeFilterCount > 0 && (
                                        <button 
                                            onClick={clearFilters}
                                            className="text-xs text-[#E8B058] hover:underline flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.gcxOnly}
                                            onChange={(e) => setFilters(prev => ({ ...prev, gcxOnly: e.target.checked }))}
                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#E8B058] focus:ring-[#E8B058]"
                                        />
                                        <span className="text-sm text-white/80">GCX Ready Only</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-white/40 uppercase mb-2">Manufacturer</h4>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {manufacturers.slice(0, 15).map(m => (
                                            <label key={m} className="flex items-center gap-2 cursor-pointer py-1">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.manufacturers.includes(m)}
                                                    onChange={() => toggleFilter('manufacturers', m)}
                                                    className="w-3 h-3 rounded border-white/20 bg-white/5 text-[#E8B058]"
                                                />
                                                <span className="text-xs text-white/70 truncate">{m}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search by manufacturer, brand, device type..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-[#E8B058]/50 focus:outline-none transition-colors"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white flex items-center gap-2"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-[#E8B058] text-black text-xs flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="mb-4 text-sm text-white/50">
                                Showing {filteredDevices.length} of {allDevices.length} integrations
                            </div>

                            {filteredDevices.length === 0 ? (
                                <div className="text-center py-16">
                                    <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No devices found</h3>
                                    <p className="text-white/50 mb-4">Try adjusting your search or filters</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 rounded-lg bg-[#E8B058]/10 text-[#E8B058] border border-[#E8B058]/30 hover:bg-[#E8B058]/20 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredDevices.map((device, index) => (
                                        <div
                                            key={`${device.manufacturer}-${device.name}-${index}`}
                                            className="p-4 rounded-xl border border-white/10 bg-[#1a1a1a] hover:border-[#E8B058]/30 transition-all cursor-pointer group"
                                            onClick={() => setSelectedDevice(device)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src={`/img/manufacturers/${device.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`}
                                                        alt={device.manufacturer}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.parentElement!.innerHTML = `<span class="text-2xl font-bold text-white/30">${device.manufacturer.charAt(0)}</span>`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white truncate group-hover:text-[#E8B058] transition-colors">
                                                        {device.name}
                                                    </h3>
                                                    <p className="text-sm text-white/50 truncate">{device.manufacturer}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/70 border border-white/10">
                                                    {device.category}
                                                </span>
                                                {device.gcxReady && (
                                                    <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                                                        <Check className="w-3 h-3" />
                                                        GCX Ready
                                                    </span>
                                                )}
                                                {device.hasManual && (
                                                    <a 
                                                        href={device.configLink!} 
                                                        target="_blank" 
                                                        rel="noopener"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 hover:bg-blue-500/20 transition-colors no-underline"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Manual Available
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {device.features.slice(0, 4).map((feature, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-[#E8B058]/5 text-[#E8B058]/70">
                                                        {feature}
                                                    </span>
                                                ))}
                                                {device.features.length > 4 && (
                                                    <span className="text-xs px-2 py-0.5 rounded text-white/40">
                                                        +{device.features.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs text-white/40">{device.features.length} features</span>
                                                <span className="text-xs text-[#E8B058] group-hover:underline">View Details →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-16 p-8 rounded-2xl border border-white/10 bg-[#1a1a1a] text-center">
                        <Plug className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Need Help with Integration?</h2>
                        <p className="text-white/60 mb-6 max-w-lg mx-auto">
                            Can't find your device? Check our general onboarding guide or contact support.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                to="/docs/devices/general/onboarding-overview"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-colors no-underline"
                            >
                                <FileText className="w-5 h-5" />
                                Onboarding Guide
                            </Link>
                            <Link
                                to="/docs/support/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors no-underline"
                            >
                                <Activity className="w-5 h-5" />
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>

                {selectedDevice && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDevice(null)}
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <div 
                            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 p-2 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`/img/manufacturers/${selectedDevice.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`}
                                            alt={selectedDevice.manufacturer}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = `<span class="text-2xl font-bold text-white/30">${selectedDevice.manufacturer.charAt(0)}</span>`;
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedDevice.name}</h2>
                                        <p className="text-white/60">{selectedDevice.manufacturer} {selectedDevice.brand && `• ${selectedDevice.brand}`}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDevice(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                                        {selectedDevice.category}
                                    </span>
                                    {selectedDevice.gcxReady && (
                                        <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
                                            <Check className="w-4 h-4" />
                                            GCX Ready
                                        </span>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl border border-white/10 bg-sky-500/5">
                                        <div className="flex items-center gap-2 mb-3 text-sky-400">
                                            <Cloud className="w-5 h-5" />
                                            <h3 className="font-semibold">Cloud Mode</h3>
                                        </div>
                                        <ul className="space-y-1 text-sm text-white/70">
                                            {selectedDevice.cloudFeatures.length > 0 ? (
                                                selectedDevice.cloudFeatures.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-sky-400" />
                                                        {f}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-white/40">No cloud features</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-amber-500/5">
                                        <div className="flex items-center gap-2 mb-3 text-amber-400">
                                            <HardDrive className="w-5 h-5" />
                                            <h3 className="font-semibold">Local Mode</h3>
                                        </div>
                                        <ul className="space-y-1 text-sm text-white/70">
                                            {selectedDevice.localFeatures.length > 0 ? (
                                                selectedDevice.localFeatures.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-amber-400" />
                                                        {f}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-white/40">No local features</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {selectedDevice.connectivity?.integrationProtocol && (
                                    <div className="p-4 rounded-xl border border-white/10 mb-4">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#E8B058]" />
                                            Connectivity
                                        </h3>
                                        <div className="grid gap-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/50">Protocol</span>
                                                <span className="text-white/80">{selectedDevice.connectivity.integrationProtocol}</span>
                                            </div>
                                            {selectedDevice.connectivity.customerPorts && (
                                                <div className="flex justify-between">
                                                    <span className="text-white/50">Customer Ports</span>
                                                    <span className="text-white/80">{selectedDevice.connectivity.customerPorts}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedDevice.issues && (
                                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                        <h3 className="font-semibold text-red-400 mb-2">Known Issues</h3>
                                        <p className="text-sm text-white/70">{selectedDevice.issues}</p>
                                    </div>
                                )}
                            </div>

                            <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-white/10 p-4 flex gap-3">
                                <Link
                                    to={`/docs/devices/${selectedDevice.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${selectedDevice.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-center transition-colors no-underline"
                                >
                                    Device Docs
                                </Link>
                                {selectedDevice.configLink && (
                                    <Link
                                        to={selectedDevice.configLink!}
                                        className="flex-1 py-3 rounded-xl bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold text-center transition-colors no-underline flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-5 h-5" />
                                        View Configuration Guide
                                    </Link>
                                )}
                                <button
                                    onClick={() => setSelectedDevice(null)}
                                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showFilters && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/80" onClick={() => setShowFilters(false)} />
                        <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#1a1a1a] border-r border-white/10 p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-white">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="text-white/60">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.gcxOnly}
                                        onChange={(e) => setFilters(prev => ({ ...prev, gcxOnly: e.target.checked }))}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-white/80">GCX Ready Only</span>
                                </label>
                            </div>
                            <h4 className="text-xs font-medium text-white/40 uppercase mb-2">Manufacturer</h4>
                            <div className="space-y-1">
                                {manufacturers.map(m => (
                                    <label key={m} className="flex items-center gap-2 cursor-pointer py-1">
                                        <input
                                            type="checkbox"
                                            checked={filters.manufacturers.includes(m)}
                                            onChange={() => toggleFilter('manufacturers', m)}
                                            className="w-3 h-3"
                                        />
                                        <span className="text-sm text-white/70">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
}
