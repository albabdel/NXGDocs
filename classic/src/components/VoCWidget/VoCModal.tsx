import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Types
type FeedbackType = 'feature' | 'bug' | 'integration';
type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type Frequency = 'Every Time' | 'Intermittent' | 'Once';
type Capability = 'Alarms' | 'Video Verification' | 'Playback' | 'Audio' | 'PTZ' | 'IO' | 'Cloud';

interface VoCModalProps {
    onClose: () => void;
    currentPath: string;
}

export default function VoCModal({ onClose, currentPath }: VoCModalProps) {
    // --- STATE ---

    // Shared Fields
    const [type, setType] = useState<FeedbackType>('feature');
    const [title, setTitle] = useState('');
    const [module, setModule] = useState('General');
    const [customModule, setCustomModule] = useState(''); // For "Other" module option
    const [severity, setSeverity] = useState<SeverityLevel>('Medium');
    const [email, setEmail] = useState('');
    const [tenantName, setTenantName] = useState('');

    // Path A: Feature Request (Agile)
    const [role, setRole] = useState('');
    const [desiredOutcome, setDesiredOutcome] = useState('');
    const [businessValue, setBusinessValue] = useState('');
    const [acceptanceCriteria, setAcceptanceCriteria] = useState('');

    // Path B: Bug Report (LSS/QA)
    const [actualBehavior, setActualBehavior] = useState('');
    const [expectedBehavior, setExpectedBehavior] = useState('');
    const [reproSteps, setReproSteps] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('Every Time');

    // Path C: Integration Request
    const [deviceType, setDeviceType] = useState('');
    const [deviceCount, setDeviceCount] = useState('');
    const [capabilities, setCapabilities] = useState<Capability[]>([]);
    const [supportingDocuments, setSupportingDocuments] = useState<Array<{ file: File; base64: string; name: string }>>([]);

    // Evidence
    const [attachment, setAttachment] = useState<string | null>(null); // Base64

    // Hidden Context (Calculated on submit/mount)
    const [userAgent, setUserAgent] = useState('');
    const [screenWidth, setScreenWidth] = useState(0);

    // Status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // --- EFFECT ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserAgent(navigator.userAgent);
            setScreenWidth(window.innerWidth);
            // Try to auto-detect module from URL
            const pathSegments = currentPath.split('/').filter(Boolean);
            if (pathSegments.length > 0) {
                // e.g. /docs/api/v1 -> "api"
                const potentialModule = pathSegments.find(s => ['docs', 'api', 'help', 'guides'].includes(s) === false);
                if (potentialModule) {
                    setModule(potentialModule.charAt(0).toUpperCase() + potentialModule.slice(1));
                }
            }
        }
    }, [currentPath]);

    // --- HANDLERS ---

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) processFile(blob);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setAttachment(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    setSupportingDocuments(prev => [...prev, {
                        file,
                        base64,
                        name: file.name
                    }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeDocument = (index: number) => {
        setSupportingDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        // --- VALIDATION ---
        if (!title.trim()) { setErrorMessage('Please provide a Title/Summary.'); return; }
        if (!email.trim() && (type === 'feature' || type === 'integration')) { setErrorMessage('Email is required for feature requests and integration requests.'); return; }

        if (type === 'feature') {
            if (!desiredOutcome.trim()) { setErrorMessage('Please tell us what you want to achieve.'); return; }
        } else if (type === 'bug') {
            if (!actualBehavior.trim()) { setErrorMessage('Please describe what happened.'); return; }
            if (!reproSteps.trim()) { setErrorMessage('Please provide steps to reproduce.'); return; }
            if (!attachment) { setErrorMessage('Screenshots help us fix bugs faster. Please verify if one is needed (Required).'); return; }
        } else if (type === 'integration') {
            if (!deviceType.trim()) { setErrorMessage('Please specify the device type.'); return; }
            if (!deviceCount.trim()) { setErrorMessage('Please specify the expected number of devices.'); return; }
            if (capabilities.length === 0) { setErrorMessage('Please select at least one capability.'); return; }
        }

        // Validate custom module if "Other" is selected
        if (module === 'Other' && !customModule.trim()) {
            setErrorMessage('Please specify the module name.'); 
            return;
        }

        setIsSubmitting(true);

        // --- PAYLOAD CONSTRUCTION ---
        const finalModule = module === 'Other' ? customModule : module;
        
        const payload: any = {
            type,
            title,
            email,
            tenant_name: tenantName,
            ...(type !== 'integration' && { module: finalModule, severity }),

            // Dynamic Fields
            ...(type === 'feature' ? {
                role,
                desired_outcome: desiredOutcome,
                business_value: businessValue,
                acceptance_criteria: acceptanceCriteria
            } : type === 'bug' ? {
                actual_behavior: actualBehavior,
                expected_behavior: expectedBehavior,
                repro_steps: reproSteps,
                frequency
            } : {
                // Integration Request
                device_type: deviceType,
                device_count: deviceCount,
                capabilities: capabilities,
                supporting_documents: supportingDocuments.map(doc => ({
                    name: doc.name,
                    type: doc.file.type,
                    size: doc.file.size,
                    data: doc.base64
                }))
            }),

            // Hidden Context
            context: {
                url: window.location.origin + currentPath,
                browser: userAgent,
                viewport: `${screenWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString()
            },

            // Attachment (for bug reports - screenshots)
            ...(type === 'bug' && attachment && { attachment })
        };

        try {
            // Use admin server in development, relative path in production (Vercel serverless)
            const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const apiUrl = isDevelopment ? 'http://localhost:3001/api/feedback' : '/api/feedback';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setTimeout(() => onClose(), 2500);
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Server error' }));
                throw new Error(errorData.error || 'Server error');
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
            setErrorMessage('Failed to submit. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Capability toggle handler
    const toggleCapability = (capability: Capability) => {
        setCapabilities(prev => 
            prev.includes(capability) 
                ? prev.filter(c => c !== capability)
                : [...prev, capability]
        );
    };

    if (submitStatus === 'success') {
        const teamName = type === 'feature' ? 'Product' : type === 'bug' ? 'Quality' : 'Integration';
        return (
            <div className="voc-modal-overlay">
                <div className="voc-modal voc-glass voc-success-message">
                    <div className="voc-check-icon">✓</div>
                    <h3>Feedback Received</h3>
                    <p>Your request has been routed to our {teamName} team.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="voc-modal-overlay" onClick={onClose}>
            <div
                className="voc-modal voc-glass"
                onClick={e => e.stopPropagation()}
                onPaste={handlePaste}
            >
                <div className="voc-modal-header">
                    <h2>Share Feedback</h2>
                    <button className="voc-close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="voc-form">

                    {/* --- SHARED HEADER --- */}

                    <div className="voc-tabs">
                        <button type="button"
                            className={clsx('voc-tab', type === 'feature' && 'voc-tab--active')}
                            onClick={() => setType('feature')}>
                            🚀 Feature Request
                        </button>
                        <button type="button"
                            className={clsx('voc-tab', type === 'bug' && 'voc-tab--active')}
                            onClick={() => setType('bug')}>
                            🐞 Bug Report
                        </button>
                        <button type="button"
                            className={clsx('voc-tab', type === 'integration' && 'voc-tab--active')}
                            onClick={() => setType('integration')}>
                            🔌 Integration Request
                        </button>
                    </div>

                    <div className="voc-form-group">
                        <label>Title / Summary <span className="required">*</span></label>
                        <input
                            className="voc-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder={
                                type === 'feature' 
                                    ? "e.g., Add bulk device onboarding for Hikvision NVRs" 
                                    : type === 'bug'
                                    ? "e.g., Alarm notifications not appearing in Talos dashboard"
                                    : "e.g., Integrate new Axis camera model AXIS P3245-LVE"
                            }
                            autoFocus
                        />
                    </div>

                    {(type === 'feature' || type === 'bug') && (
                        <div className="voc-row">
                            <div className="voc-form-group">
                                <label>Module</label>
                                <select className="voc-input" value={module} onChange={e => setModule(e.target.value)}>
                                    <option>Getting Started</option>
                                    <option>Platform Fundamentals</option>
                                    <option>Admin & Configuration</option>
                                    <option>Devices</option>
                                    <option>Alarm Management</option>
                                    <option>Features</option>
                                    <option>Operator Guide</option>
                                    <option>Installer Guide</option>
                                    <option>Reporting</option>
                                    <option>Troubleshooting</option>
                                    <option>Knowledge Base</option>
                                    <option>Support</option>
                                    <option>API Documentation</option>
                                    <option>General</option>
                                    <option>Other</option>
                                </select>
                                {module === 'Other' && (
                                    <input
                                        className="voc-input"
                                        style={{ marginTop: '0.5rem' }}
                                        value={customModule}
                                        onChange={e => setCustomModule(e.target.value)}
                                        placeholder="Please specify the module name"
                                    />
                                )}
                            </div>
                            <div className="voc-form-group">
                                <label>Impact / Urgency</label>
                                <select className="voc-input" value={severity} onChange={e => setSeverity(e.target.value as SeverityLevel)}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="voc-form-group">
                        <label>Email <span className={type === 'integration' ? 'required' : 'optional'}>{type === 'integration' ? '*' : '(for tailored updates)'}</span></label>
                        <input type="email" className="voc-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@client.com" />
                    </div>

                    <div className="voc-form-group">
                        <label>Tenant name</label>
                        <input type="text" className="voc-input" value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Enter tenant name" />
                    </div>

                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

                    {/* --- DYNAMIC BODY --- */}

                    {type === 'feature' ? (
                        <>
                            {/* Agile User Story Path */}
                            <div className="voc-form-group">
                                <label>I am acting as... <span className="optional">(Role)</span></label>
                                <input className="voc-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., A Site Admin, An Operator, A Service Provider" />
                            </div>
                            <div className="voc-form-group">
                                <label>I want to... <span className="required">(Function)</span></label>
                                <textarea className="voc-input" rows={2} value={desiredOutcome} onChange={e => setDesiredOutcome(e.target.value)} placeholder="e.g., configure PTZ presets for multiple cameras at once" />
                            </div>
                            <div className="voc-form-group">
                                <label>So that... <span className="optional">(Benefit)</span></label>
                                <textarea className="voc-input" rows={2} value={businessValue} onChange={e => setBusinessValue(e.target.value)} placeholder="e.g., I can quickly set up patrol routes for all cameras during site onboarding" />
                            </div>
                            <div className="voc-form-group">
                                <label>Success Looks Like... <span className="optional">(Acceptance Criteria)</span></label>
                                <textarea className="voc-input" rows={2} value={acceptanceCriteria} onChange={e => setAcceptanceCriteria(e.target.value)} placeholder="e.g., I can select multiple cameras and apply the same preset configuration to all of them" />
                            </div>
                        </>
                    ) : type === 'bug' ? (
                        <>
                            {/* LSS Bug Report Path */}
                            <div className="voc-form-group">
                                <label>What Happened? <span className="required">*</span></label>
                                <textarea className="voc-input" rows={2} value={actualBehavior} onChange={e => setActualBehavior(e.target.value)} placeholder="e.g., Device health status shows 'Offline' but device is actually online and streaming" />
                            </div>
                            <div className="voc-form-group">
                                <label>What Should Happen? <span className="optional">(Gap Analysis)</span></label>
                                <textarea className="voc-input" rows={2} value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} placeholder="e.g., Device health should show 'Online' when device is responding to health checks" />
                            </div>
                            <div className="voc-form-group">
                                <label>Steps to Reproduce <span className="required">*</span></label>
                                <textarea className="voc-input" rows={4} value={reproSteps} onChange={e => setReproSteps(e.target.value)} placeholder={"1. Navigate to Devices section\n2. Select a Hikvision NVR\n3. Check device health status\n4. Observe incorrect status display"} />
                            </div>
                            <div className="voc-form-group">
                                <label>Frequency</label>
                                <select className="voc-input" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)}>
                                    <option>Every Time</option>
                                    <option>Intermittent</option>
                                    <option>Once</option>
                                </select>
                            </div>
                        </>
                    ) : type === 'integration' ? (
                        <>
                            {/* Integration Request Path */}
                            <div className="voc-form-group">
                                <label>Device Type / Manufacturer <span className="required">*</span></label>
                                <input 
                                    className="voc-input" 
                                    value={deviceType} 
                                    onChange={e => setDeviceType(e.target.value)} 
                                    placeholder="e.g., Axis P3245-LVE, Hikvision DS-2CD2xxx, Generic ONVIF" 
                                />
                            </div>
                            <div className="voc-form-group">
                                <label>Expected Number of Devices <span className="required">*</span></label>
                                <input 
                                    type="number" 
                                    className="voc-input" 
                                    value={deviceCount} 
                                    onChange={e => setDeviceCount(e.target.value)} 
                                    placeholder="e.g., 50, 200, 1000" 
                                    min="1"
                                />
                            </div>
                            <div className="voc-form-group">
                                <label>Required Capabilities <span className="required">*</span></label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {(['Alarms', 'Video Verification', 'Playback', 'Audio', 'PTZ', 'IO', 'Cloud'] as Capability[]).map((cap) => (
                                        <label 
                                            key={cap}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.75rem',
                                                cursor: 'pointer',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                background: capabilities.includes(cap) ? 'rgba(200, 148, 70, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                                border: `1px solid ${capabilities.includes(cap) ? 'var(--nxgen-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={capabilities.includes(cap)}
                                                onChange={() => toggleCapability(cap)}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    accentColor: 'var(--nxgen-gold)'
                                                }}
                                            />
                                            <span style={{ color: '#fff', fontSize: '0.95rem' }}>{cap}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="voc-form-group">
                                <label>Supporting Documents <span className="optional">(SDK, PDFs, specifications, etc.)</span></label>
                                <div
                                    className={clsx('voc-dropzone', supportingDocuments.length > 0 && 'voc-dropzone--has-file')}
                                    onClick={() => document.getElementById('voc-documents-input')?.click()}
                                    style={{ minHeight: '100px' }}
                                >
                                    {supportingDocuments.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                                            {supportingDocuments.map((doc, index) => (
                                                <div 
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '0.75rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                                                        <div>
                                                            <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{doc.name}</div>
                                                            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                                                                {(doc.file.size / 1024).toFixed(2)} KB • {doc.file.type || 'Unknown type'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        className="voc-remove-img" 
                                                        onClick={(e) => { e.stopPropagation(); removeDocument(index); }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                style={{
                                                    marginTop: '0.5rem',
                                                    padding: '0.5rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '8px',
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); document.getElementById('voc-documents-input')?.click(); }}
                                            >
                                                + Add More Documents
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="voc-dropzone-prompt">
                                            Click to upload or drag and drop
                                            <br />
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PDFs, SDKs, specifications, documentation, etc.</span>
                                        </div>
                                    )}
                                    <input 
                                        id="voc-documents-input" 
                                        type="file" 
                                        multiple 
                                        className="hidden-input" 
                                        onChange={handleDocumentUpload}
                                        accept="*/*"
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}

                    {/* --- EVIDENCE --- */}
                    {type === 'bug' && (
                        <div className="voc-form-group">
                            <label>Evidence / Screenshot <span className="required">(Required)</span></label>
                            <div
                                className={clsx('voc-dropzone', attachment && 'voc-dropzone--has-file')}
                                onClick={() => document.getElementById('voc-file-input')?.click()}
                            >
                                {attachment ? (
                                    <div className="voc-preview">
                                        <img src={attachment} alt="Preview" />
                                        <button type="button" className="voc-remove-img" onClick={(e) => { e.stopPropagation(); setAttachment(null); }}>Remove</button>
                                    </div>
                                ) : (
                                    <div className="voc-dropzone-prompt">Paste (Ctrl+V) or click to upload</div>
                                )}
                                <input id="voc-file-input" type="file" accept="image/*" className="hidden-input" onChange={handleFileChange} />
                            </div>
                        </div>
                    )}

                    {errorMessage && <div className="voc-error-banner">{errorMessage}</div>}

                    <div className="voc-modal-footer">
                        <button type="submit" className="voc-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending to Team...' : 'Submit Request'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
