import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import LandingPageBackground from '../components/LandingPageBackground';
import Link from '@docusaurus/Link';
import {
    Plug,
    Home,
    ChevronRight,
    Search,
    Filter,
    X,
    Server,
    Camera,
    Cpu,
    Router,
    Radio,
    CheckCircle2,
    Settings,
    Zap,
    Video,
    Play,
    Shield,
    Activity,
    Wifi,
    Bell,
    Clock,
    FileText,
    Layers,
    Network,
    Database,
    Cloud,
    Smartphone,
    Eye,
    RadioIcon,
    Box,
    HardDrive,
    Sparkles,
    TrendingUp
} from 'lucide-react';

// Device data structure
type DeviceFeature = {
    name: string;
    partial?: boolean;
};

type Device = {
    name: string;
    category: 'NVR' | 'VMS' | 'IP Camera' | 'AI Box' | 'Router' | 'IOT' | 'Cloud VMS' | 'Other';
    features: DeviceFeature[];
    configLink?: string;
    icon?: React.ReactNode;
};

// Parse device data from user input
const devices: Device[] = [
    {
        name: 'Hikvision(NVR) NVR',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'TimeSync' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
        ],
    },
    {
        name: 'Hikvision(IPCamera) IPC',
        category: 'IP Camera',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'TimeSync' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Hikpro P2P Cloud VMS',
        category: 'Cloud VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Dahua NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Dahua Dolync Cloud P2P Cloud VMS',
        category: 'Cloud VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO', partial: true },
            { name: 'Poll from Cloud' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
        ],
    },
    {
        name: 'NXWitness',
        category: 'VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'HANWHA',
        category: 'VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'DigitalWatchdog',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'GenesisVms',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'NXGCloudNVR',
        category: 'Cloud VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'NXG Cloud Vision Edge',
        category: 'Cloud VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'SPYKEBOX NVR',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
            { name: 'Clip Export (Manual)' },
        ],
    },
    {
        name: 'Hanwha-Techwin NVR',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'Poll from Cloud' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
        ],
    },
    {
        name: 'Camect AI BOX',
        category: 'AI Box',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Poll from Cloud' },
            { name: 'Heart beat from Device' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
            { name: '4K/High Res Support' },
        ],
    },
    {
        name: 'Ganz AI BOX',
        category: 'AI Box',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Avigilon VMS',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Axxon VMS',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Milestone VMS',
        category: 'VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'AxisCameraStation VMS',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Heitel NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Uniview NVR',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local SDK Audio' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Viasys/ShieldBox Cloud NVR',
        category: 'Cloud VMS',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Axis IP Camera',
        category: 'IP Camera',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'SenStar NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
        ],
    },
    {
        name: 'NetVue IP Camera',
        category: 'IP Camera',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'Local SDK Audio' },
            { name: 'Timeline (Local)', partial: true },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Honeywell 35 Series NVR',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'Poll from Cloud' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse' },
        ],
    },
    {
        name: 'Davantis AI BOX',
        category: 'AI Box',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'GenesisAudio SIP Twillio',
        category: 'Other',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Teltonika Router',
        category: 'Router',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'IO' },
        ],
    },
    {
        name: 'EFOY Router',
        category: 'Router',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
        ],
    },
    {
        name: 'Victron Router',
        category: 'Router',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
        ],
    },
    {
        name: 'AJAX PIR CAM',
        category: 'IOT',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
        ],
    },
    {
        name: 'Ajax Hub/NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Device Monitoring' },
            { name: 'Encrypted Communication' },
            { name: 'Account Mapping' },
        ],
    },
    {
        name: 'Essence My Sheild PIR CAM',
        category: 'IOT',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Events' },
            { name: 'Arm/Disarm' },
        ],
    },
    {
        name: 'Reconeyez PIR Cam',
        category: 'IOT',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
        ],
    },
    {
        name: 'Innovi AI Cloud',
        category: 'IOT',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Rosenberger IOT battery Mgmt',
        category: 'IOT',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Autoaid IOT',
        category: 'IOT',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Auraigateway IOT Mining',
        category: 'IOT',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Onvif IP Camera',
        category: 'IP Camera',
        features: [
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'Mobotix IP Camera',
        category: 'IP Camera',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
        ],
    },
    {
        name: 'ENEO NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
        ],
    },
    {
        name: 'ENEOIP NVR',
        category: 'NVR',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
        ],
    },
    {
        name: 'AXIS CS Pro VMS',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
            { name: 'Timelapse', partial: true },
        ],
    },
    {
        name: 'Geutebrück VMS',
        category: 'VMS',
        configLink: '/docs/devices/add-a-device-to-gcxone',
        features: [
            { name: 'Discovery' },
            { name: 'Live Streaming (Cloud)' },
            { name: 'Playback (Cloud)' },
            { name: 'Timeline (Cloud)' },
            { name: 'Events' },
            { name: 'Arm/Disarm' },
            { name: 'Genesis Audio (SIP)' },
            { name: 'PTZ/Presets' },
            { name: 'IO' },
            { name: 'Event Acknowledgement' },
            { name: 'Live Streaming (Local)' },
            { name: 'Playback (Local)' },
            { name: 'Local PTZ' },
            { name: 'Local IO' },
            { name: 'Timeline (Local)' },
            { name: 'Mobile App Enabled' },
            { name: 'Basic Profile' },
            { name: 'Basic+ Profile' },
            { name: 'Advanced Profile' },
        ],
    },
    {
        name: 'Miwi Urmet (Polish) NVR/IP Camera',
        category: 'NVR',
        features: [
            { name: 'Discovery' },
        ],
    },
];

// Category icons and colors
const categoryConfig: Record<Device['category'], { icon: React.ReactNode; color: string; gradient: string }> = {
    'NVR': { 
        icon: <Server className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'VMS': { 
        icon: <Database className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'IP Camera': { 
        icon: <Camera className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'AI Box': { 
        icon: <Cpu className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'Router': { 
        icon: <Router className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'IOT': { 
        icon: <Radio className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'Cloud VMS': { 
        icon: <Cloud className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
    'Other': { 
        icon: <Box className="w-6 h-6" />, 
        color: 'text-[#E8B058]',
        gradient: 'from-[#E8B058]/20 to-[#E8B058]/10 border-[#E8B058]/30'
    },
};

// Helper function to get key capabilities
const getKeyCapabilities = (device: Device): string[] => {
    const capabilities: string[] = [];
    const hasCloud = device.features.some(f => f.name.includes('Cloud'));
    const hasLocal = device.features.some(f => f.name.includes('Local'));
    const hasMobile = device.features.some(f => f.name.includes('Mobile'));
    const hasPTZ = device.features.some(f => f.name.includes('PTZ'));
    const hasAudio = device.features.some(f => f.name.includes('Audio'));
    const has4K = device.features.some(f => f.name.includes('4K'));

    if (hasCloud) capabilities.push('Cloud');
    if (hasLocal) capabilities.push('Local');
    if (hasMobile) capabilities.push('Mobile');
    if (hasPTZ) capabilities.push('PTZ');
    if (hasAudio) capabilities.push('Audio');
    if (has4K) capabilities.push('4K');

    return capabilities.slice(0, 4); // Max 4 capabilities
};

// Simplified Device Card Component
const DeviceCard = ({ device }: { device: Device }) => {
    const categoryInfo = categoryConfig[device.category];
    const featureCount = device.features.length;
    const fullFeatures = device.features.filter(f => !f.partial).length;
    const keyCapabilities = getKeyCapabilities(device);

    const CardContent = device.configLink ? (
        <Link
            to={device.configLink}
            className={`block h-full p-6 bg-gradient-to-br ${categoryInfo.gradient} backdrop-blur-xl rounded-xl hover:scale-[1.02] transition-all duration-300 border border-slate-700/30 hover:border-slate-600/50 no-underline group`}
        >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                            {device.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[#E8B058]">
                                {categoryInfo.icon}
                            </span>
                            <span className="text-sm text-white/70">{device.category}</span>
                        </div>
                    </div>
                </div>

                {/* Key Capabilities */}
                {keyCapabilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {keyCapabilities.map((cap, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20"
                            >
                                {cap}
                            </span>
                        ))}
                    </div>
                )}

                {/* Feature Summary */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <Sparkles className="w-4 h-4 text-[#E8B058]" />
                        <span>{featureCount} features</span>
                    </div>
                    {device.configLink && (
                        <div className="flex items-center gap-1 text-[#E8B058] group-hover:translate-x-1 transition-transform">
                            <span className="text-sm font-medium">Configure</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </Link>
    ) : (
        <div className={`block h-full p-6 bg-gradient-to-br ${categoryInfo.gradient} backdrop-blur-xl rounded-xl border border-slate-700/30 no-underline group opacity-75`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                        {device.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E8B058]">
                            {categoryInfo.icon}
                        </span>
                        <span className="text-sm text-white/70">{device.category}</span>
                    </div>
                </div>
            </div>

            {/* Key Capabilities */}
            {keyCapabilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {keyCapabilities.map((cap, idx) => (
                        <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20"
                        >
                            {cap}
                        </span>
                    ))}
                </div>
            )}

            {/* Feature Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                    <Sparkles className="w-4 h-4 text-[#E8B058]" />
                    <span>{featureCount} features</span>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
        >
            {CardContent}
        </motion.div>
    );
};

export default function IntegrationHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = useMemo(() => {
        const cats = Array.from(new Set(devices.map(d => d.category))).sort();
        return ['All', ...cats];
    }, []);

    const filteredDevices = useMemo(() => {
        return devices.filter(device => {
            const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || device.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const devicesByCategory = useMemo(() => {
        const grouped: Record<string, Device[]> = {};
        filteredDevices.forEach(device => {
            if (!grouped[device.category]) {
                grouped[device.category] = [];
            }
            grouped[device.category].push(device);
        });
        return grouped;
    }, [filteredDevices]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        devices.forEach(device => {
            stats[device.category] = (stats[device.category] || 0) + 1;
        });
        return stats;
    }, []);

    return (
        <Layout
            title="Integration Hub"
            description="Discover all supported devices and integrations"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                {/* Breadcrumbs */}
                <div className="backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)', borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Integration Hub</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Plug className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">50+ Supported Devices</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-font-color-base)' }}>
                            Integration Hub
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--ifm-font-color-secondary)' }}>
                            Browse our catalog of supported devices. Each integration includes comprehensive setup guides and feature documentation.
                        </p>
                    </motion.div>

                    {/* Category Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12"
                    >
                        {Object.entries(categoryStats).map(([category, count]) => {
                            const config = categoryConfig[category as Device['category']];
                            return (
                                <div
                                    key={category}
                                    className="p-4 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-lg text-center"
                                >
                                    <div className={`${config.color} mb-2 flex justify-center`}>
                                        {config.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{count}</div>
                                    <div className="text-xs text-white/70">{category}</div>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search devices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#202020] border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#E8B058]/50 focus:ring-2 focus:ring-[#E8B058]/20"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="pl-12 pr-10 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-slate-800">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {filteredDevices.length > 0 && (
                            <p className="mt-4 text-sm text-white/70">
                                Showing {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </motion.div>

                    {/* Devices Grid */}
                    {filteredDevices.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No devices found</h3>
                            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            {Object.entries(devicesByCategory).map(([category, categoryDevices]) => {
                                const config = categoryConfig[category as Device['category']];
                                return (
                                    <motion.section
                                        key={category}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`${config.color}`}>
                                                {config.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">{category}</h2>
                                                <p className="text-sm text-white/70">{categoryDevices.length} device{categoryDevices.length !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {categoryDevices.map(device => (
                                                <DeviceCard key={device.name} device={device} />
                                            ))}
                                        </div>
                                    </motion.section>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-32 text-center"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-2xl">
                            <Plug className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Help with Integration?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Can't find your device? Check our general device onboarding guide or contact support for assistance.
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/devices/add-a-device-to-gcxone"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    General Onboarding Guide
                                </Link>
                                <Link
                                    to="/docs/support/contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <Activity className="w-5 h-5" />
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}

