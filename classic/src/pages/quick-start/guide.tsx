import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Zap,
    LogIn,
    Shield,
    Users,
    Building2,
    LayoutDashboard,
    Radio,
    Settings,
    Activity,
    Clock,
    Home,
    ChevronRight,
    CheckCircle,
    Code,
    Copy,
    Server,
    Key,
    AlertCircle,
    Database,
    GitBranch,
    Terminal
} from 'lucide-react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
                {copied ? <CheckCircle className="w-4 h-4 text-[#E8B058]" /> : <Copy className="w-4 h-4 text-white/70" />}
            </button>
            <pre className="bg-[#202020] border border-white/10 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-white/70 font-mono">{code}</code>
            </pre>
        </div>
    );
};

export default function QuickStartGuide() {
    return (
        <Layout
            title="Quick Start Guide"
            description="Get up and running in 5 minutes"
        >
            <main className="min-h-screen bg-black">
                {/* Breadcrumbs */}
                <div className="bg-black border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <Link to="/#quick-start" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Quick Start
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Quick Start Guide</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Clock className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">5-10 Minute Setup</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Quick Start Guide
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Follow this comprehensive guide to configure your GCXONE platform from initial login to full monitoring capability
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-white/70">
                                <Clock className="w-4 h-4" />
                                <span>Time Required: 5-10 minutes</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Users className="w-4 h-4" />
                                <span>All Roles</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Workflow Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Onboarding Workflow</h2>
                            <p className="text-slate-400 text-lg">
                                Four simple steps to get your platform operational
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl blur-3xl" />
                            <div className="relative p-8 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                                <img
                                    src="/brain/0f57876f-36e6-4c47-95c4-bb9af8002cf5/onboarding_flow_1764966433996.png"
                                    alt="Onboarding Workflow"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Prerequisites */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="p-6 bg-[#202020] border border-white/10 rounded-xl">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-[#E8B058] flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Before You Begin</h3>
                                    <div className="space-y-2 text-white/70">
                                        <p>• Access credentials provided by your administrator or received via email</p>
                                        <p>• Network access to <code className="px-2 py-1 bg-[#1a1a1a] rounded text-[#E8B058]">*.nxgen.cloud</code></p>
                                        <p>• Multi-factor authentication app (recommended: Google Authenticator, Authy)</p>
                                        <p>• Admin privileges if setting up CMS connections</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 1: First Access & Login */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">1</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">First Access & Security Setup</h2>
                                    <p className="text-white/70">Secure your account and configure workspace</p>
                                </div>
                            </div>
                        </div>

                        {/* Login Process */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Initial Login</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#E8B058]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-[#E8B058]">1</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-1">Navigate to Login Portal</h4>
                                                <p className="text-sm text-white/70">Access the GCXONE platform at your organization's URL</p>
                                                <CodeBlock code="https://yourcompany.gcxone.cloud" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#E8B058]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-[#E8B058]">2</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-1">Enter Credentials</h4>
                                                <p className="text-sm text-white/70 mb-3">Use the temporary credentials provided by your administrator</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Key className="w-4 h-4 text-[#E8B058]" />
                                                        <span className="text-white/70">Username: Usually your email address</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Key className="w-4 h-4 text-[#E8B058]" />
                                                        <span className="text-white/70">Password: Temporary password from setup email</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#E8B058]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-[#E8B058]">3</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-1">Set New Password</h4>
                                                <p className="text-sm text-white/70 mb-2">Create a strong password meeting security requirements:</p>
                                                <ul className="text-sm text-white/70 space-y-1">
                                                    <li>• Minimum 12 characters</li>
                                                    <li>• Mix of uppercase, lowercase, numbers</li>
                                                    <li>• At least one special character (!@#$%)</li>
                                                    <li>• Not previously used</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Multi-Factor Authentication (MFA)</h3>
                                <div className="p-6 bg-[#202020] border border-white/10 rounded-lg mb-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-[#E8B058] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-[#E8B058] mb-1">Highly Recommended</h4>
                                            <p className="text-sm text-white/70">MFA adds an essential security layer protecting against unauthorized access</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <h4 className="font-semibold text-white mb-2">Setup Steps:</h4>
                                        <ol className="space-y-3 text-sm text-white/70">
                                            <li className="flex gap-2">
                                                <span className="font-mono text-[#E8B058]">1.</span>
                                                <span>Navigate to Account Settings → Security</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-mono text-[#E8B058]">2.</span>
                                                <span>Click "Enable Two-Factor Authentication"</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-mono text-[#E8B058]">3.</span>
                                                <span>Scan QR code with authenticator app</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-mono text-[#E8B058]">4.</span>
                                                <span>Enter 6-digit verification code</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-mono text-[#E8B058]">5.</span>
                                                <span>Save backup codes in secure location</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <h4 className="font-semibold text-white mb-2">Supported Apps:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Google Authenticator', 'Microsoft Authenticator', 'Authy', 'Duo Mobile'].map(app => (
                                                <div key={app} className="p-2 bg-[#1a1a1a] rounded text-sm text-white/70 text-center">
                                                    {app}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Need Help?</h4>
                                    <p className="text-sm text-white/70">Detailed guide with screenshots</p>
                                </div>
                                <Link
                                    to="/docs/getting-started/first-time-login"
                                    className="px-4 py-2 bg-[#E8B058]/20 hover:bg-[#E8B058]/30 border border-[#E8B058]/40 text-[#E8B058] font-medium rounded-lg transition-all no-underline"
                                >
                                    View Full Guide →
                                </Link>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 2: CMS Connection */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">2</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">CMS Connection Setup</h2>
                                    <p className="text-white/70">Configure Central Monitoring Station for alarm routing</p>
                                </div>
                            </div>
                        </div>

                        {/* CMS Comparison */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold text-white mb-6">Choose Your Integration Method</h3>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-2xl" />
                            <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <img
                                        src="/brain/0f57876f-36e6-4c47-95c4-bb9af8002cf5/cms_comparison_table_1764966792109.png"
                                        alt="CMS Comparison Table"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuration Examples */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Talos Setup */}
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#E8B058]/20 rounded-lg">
                                        <Zap className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Talos (Native)</h4>
                                        <span className="text-xs px-2 py-1 bg-[#E8B058]/20 border border-[#E8B058]/30 rounded text-[#E8B058]">
                                            Recommended
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Full native integration with automatic site sync and bidirectional communication.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2">Configuration:</h5>
                                        <CodeBlock code={`# Navigate to Settings → Integrations
# Select "Talos CMS"
# Enter your credentials:

Server URL: https://talos.yourcompany.com
API Token: [Generate from Talos Admin]
Auto-sync Sites: Enabled`} />
                                    </div>
                                    <div className="p-3 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded">
                                        <p className="text-xs text-[#E8B058]">
                                            ✓ Alarms route automatically after setup
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* External CMS Setup */}
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#E8B058]/20 rounded-lg">
                                        <Radio className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">External CMS (Bridge)</h4>
                                        <span className="text-xs px-2 py-1 bg-[#E8B058]/20 border border-[#E8B058]/30 rounded text-[#E8B058]">
                                            Lisa / Amwin
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Connect to third-party monitoring platforms via GCXONE Bridge using standard protocols.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2">Configuration:</h5>
                                        <CodeBlock code={`# Install GCXONE Bridge (STOS)
# Configure alarm receiver:

Protocol: SIA DC-09
IP Address: [Bridge Server IP]
Port: 5000
Encryption: AES-256 (optional)
Account Format: [Your Site ID Format]`} />
                                    </div>
                                    <Link
                                        to="/docs/integrations/GCXONE-bridge-overview"
                                        className="block p-3 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded hover:bg-[#E8B058]/20 transition-colors no-underline"
                                    >
                                        <p className="text-xs text-[#E8B058]">
                                            View Bridge Setup Guide →
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Testing Connection */}
                        <div className="mt-8 p-6 bg-[#202020] rounded-xl border border-white/10">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-[#E8B058]" />
                                Testing Your Connection
                            </h4>
                            <div className="space-y-3 text-sm text-white/70">
                                <p><strong>1.</strong> Navigate to Settings → Integrations → Test Connection</p>
                                <p><strong>2.</strong> Click "Send Test Alarm" to verify routing</p>
                                <p><strong>3.</strong> Confirm alarm appears in your CMS within 2-5 seconds</p>
                                <p><strong>4.</strong> Check GCXONE Event Log for transmission confirmation</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 3: Database Setup */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">3</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Build Your Database</h2>
                                    <p className="text-white/70">Create organizational hierarchy and user structure</p>
                                </div>
                            </div>
                        </div>

                        {/* Hierarchy Diagram */}
                        <div className="mb-12">
                            <h3 className="text-xl font-semibold text-white mb-4">Database Structure</h3>
                            <div className="p-8 bg-[#202020] rounded-xl border border-white/10">
                                <div className="space-y-6">
                                    {/* Company Level */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                            <Building2 className="w-6 h-6 text-[#E8B058]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white mb-2">Company / Customer Groups</h4>
                                            <p className="text-sm text-white/70 mb-3">Top-level organizational entities</p>
                                            <CodeBlock code={`# Example:
- Acme Security (Parent Company)
  └── Acme Retail Division
  └── Acme Industrial Division`} />
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-white/10 ml-6 pl-6 space-y-6">
                                        {/* Site Level */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                                <Building2 className="w-6 h-6 text-[#E8B058]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-2">Sites / Locations</h4>
                                                <p className="text-sm text-white/70 mb-3">Physical locations within each customer</p>
                                                <CodeBlock code={`# Example Sites:
- Store #101 - Downtown Branch
  Address: 123 Main St, City
  Devices: 12 cameras, 3 sensors
  
- Warehouse A - North Campus
  Address: 456 Industrial Way
  Devices: 24 cameras, 8 sensors`} />
                                            </div>
                                        </div>

                                        {/* User Level */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                                <Users className="w-6 h-6 text-[#E8B058]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-2">Users & Permissions</h4>
                                                <p className="text-sm text-white/70 mb-3">Assign users with role-based access control</p>
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    {[
                                                        { role: 'Admin', access: 'Full system access' },
                                                        { role: 'Operator', access: 'Alarm monitoring' },
                                                        { role: 'Manager', access: 'Reports & analytics' },
                                                        { role: 'Installer', access: 'Device setup only' }
                                                    ].map(item => (
                                                        <div key={item.role} className="p-3 bg-[#1a1a1a] rounded border border-white/5">
                                                            <div className="font-semibold text-white text-sm">{item.role}</div>
                                                            <div className="text-xs text-white/70">{item.access}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'Create Customers', icon: <Building2 className="w-5 h-5" />, link: '/docs/admin-guide/creating-customers' },
                                { title: 'Add Sites', icon: <Database className="w-5 h-5" />, link: '/docs/admin-guide/creating-sites' },
                                { title: 'Manage Users', icon: <Users className="w-5 h-5" />, link: '/docs/account-management/managing-users-and-roles' }
                            ].map(item => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="p-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-lg border border-white/10 hover:border-[#E8B058]/50 transition-all flex items-center gap-3 no-underline group"
                                >
                                    <div className="p-2 bg-[#E8B058]/20 rounded text-[#E8B058] group-hover:bg-[#E8B058]/30">
                                        {item.icon}
                                    </div>
                                    <span className="font-semibold text-white">{item.title}</span>
                                    <ChevronRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-[#E8B058]" />
                                </Link>
                            ))}
                        </div>
                    </motion.section>

                    {/* Step 4: Dashboard */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <CheckCircle className="w-7 h-7 text-[#E8B058]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                                    <p className="text-white/70">Understand your monitoring interface</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-2xl" />
                                <div className="relative p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <img
                                        src="/brain/0f57876f-36e6-4c47-95c4-bb9af8002cf5/dashboard_mockup_1764966807607.png"
                                        alt="Dashboard Preview"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: <Activity className="w-6 h-6" />,
                                    title: 'Active Sites Widget',
                                    desc: 'Real-time count of connected and monitoring locations',
                                    features: ['Live connection status', 'Health indicators', 'Quick filters']
                                },
                                {
                                    icon: <GitBranch className="w-6 h-6" />,
                                    title: 'Alarm Volume Chart',
                                    desc: 'Visual analytics of alarm trends over time',
                                    features: ['24-hour trends', 'Type breakdown', 'Comparative analysis']
                                },
                                {
                                    icon: <Server className="w-6 h-6" />,
                                    title: 'Device Status',
                                    desc: 'Overview of all connected hardware',
                                    features: ['Online/offline counts', 'Lifecheck status', 'Quick diagnostics']
                                },
                                {
                                    icon: <LayoutDashboard className="w-6 h-6" />,
                                    title: 'Customizable Widgets',
                                    desc: 'Tailor dashboard to your role and needs',
                                    features: ['Drag & drop layout', 'Role-specific views', 'Save preferences']
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="p-6 bg-[#202020] rounded-lg border border-white/10">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="p-2 bg-[#E8B058]/20 rounded-lg text-[#E8B058]">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                            <p className="text-sm text-white/70">{feature.desc}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1 ml-14">
                                        {feature.features.map((f, i) => (
                                            <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#E8B058]/60" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Success Message */}
                        <div className="mt-8 p-6 bg-[#202020] border border-white/10 rounded-xl">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-12 h-12 text-[#E8B058]" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">🎉 You're All Set!</h3>
                                    <p className="text-white/70 mb-3">
                                        Your GCXONE platform is fully configured and ready for monitoring operations.
                                    </p>
                                    <p className="text-sm text-white/70">
                                        Next step: Connect your first device to start receiving and processing alarms
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex gap-4 flex-wrap justify-center">
                            <Link
                                to="/quick-start/device-integration"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                            >
                                Next: Connect Your First Device
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/quick-start/platform-overview"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                            >
                                ← Platform Overview
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
