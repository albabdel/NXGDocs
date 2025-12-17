import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Types
type FeedbackType = 'feature' | 'bug';
type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type Frequency = 'Every Time' | 'Intermittent' | 'Once';

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
    const [severity, setSeverity] = useState<SeverityLevel>('Medium');
    const [email, setEmail] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        // --- VALIDATION ---
        if (!title.trim()) { setErrorMessage('Please provide a Title/Summary.'); return; }
        if (!email.trim() && type === 'feature') { setErrorMessage('Email is recommended for feature requests.'); } // Soft validation

        if (type === 'feature') {
            if (!desiredOutcome.trim()) { setErrorMessage('Please tell us what you want to achieve.'); return; }
        } else {
            // Bug
            if (!actualBehavior.trim()) { setErrorMessage('Please describe what happened.'); return; }
            if (!reproSteps.trim()) { setErrorMessage('Please provide steps to reproduce.'); return; }
            if (!attachment) { setErrorMessage('Screenshots help us fix bugs faster. Please verify if one is needed (Required).'); return; }
        }

        setIsSubmitting(true);

        // --- PAYLOAD CONSTRUCTION ---
        const payload = {
            type,
            title,
            email,
            module,
            severity,

            // Dynamic Fields
            ...(type === 'feature' ? {
                role,
                desired_outcome: desiredOutcome,
                business_value: businessValue,
                acceptance_criteria: acceptanceCriteria
            } : {
                actual_behavior: actualBehavior,
                expected_behavior: expectedBehavior,
                repro_steps: reproSteps,
                frequency
            }),

            // Hidden Context
            context: {
                url: window.location.origin + currentPath,
                browser: userAgent,
                viewport: `${screenWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString()
            },

            // Attachment (Separate field, might need handling in n8n)
            attachment
        };

        try {
            const webhookUrl = 'https://n8n.nxgen.cloud/webhook/gcxone-feedback';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setTimeout(() => onClose(), 2500);
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
            setErrorMessage('Failed to submit. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (submitStatus === 'success') {
        return (
            <div className="voc-modal-overlay">
                <div className="voc-modal voc-glass voc-success-message">
                    <div className="voc-check-icon">✓</div>
                    <h3>Feedback Received</h3>
                    <p>Your request has been routed to our {type === 'feature' ? 'Product' : 'Quality'} team.</p>
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
                    </div>

                    <div className="voc-form-group">
                        <label>Title / Summary <span className="required">*</span></label>
                        <input
                            className="voc-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder={type === 'feature' ? "e.g., Export reports as PDF" : "e.g., Login button unresponsive"}
                            autoFocus
                        />
                    </div>

                    <div className="voc-row">
                        <div className="voc-form-group">
                            <label>Module</label>
                            <select className="voc-input" value={module} onChange={e => setModule(e.target.value)}>
                                <option>General</option>
                                <option>Authentication</option>
                                <option>Dashboard</option>
                                <option>Reports</option>
                                <option>API</option>
                                <option>Devices</option>
                            </select>
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

                    <div className="voc-form-group">
                        <label>Email <span className="optional">(for tailored updates)</span></label>
                        <input type="email" className="voc-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@client.com" />
                    </div>

                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

                    {/* --- DYNAMIC BODY --- */}

                    {type === 'feature' ? (
                        <>
                            {/* Agile User Story Path */}
                            <div className="voc-form-group">
                                <label>I am acting as... <span className="optional">(Role)</span></label>
                                <input className="voc-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., An Admin, A Viewer" />
                            </div>
                            <div className="voc-form-group">
                                <label>I want to... <span className="required">(Function)</span></label>
                                <textarea className="voc-input" rows={2} value={desiredOutcome} onChange={e => setDesiredOutcome(e.target.value)} placeholder="e.g., export reports as PDF" />
                            </div>
                            <div className="voc-form-group">
                                <label>So that... <span className="optional">(Benefit)</span></label>
                                <textarea className="voc-input" rows={2} value={businessValue} onChange={e => setBusinessValue(e.target.value)} placeholder="e.g., I can share them with non-users" />
                            </div>
                            <div className="voc-form-group">
                                <label>Success Looks Like... <span className="optional">(Acceptance Criteria)</span></label>
                                <textarea className="voc-input" rows={2} value={acceptanceCriteria} onChange={e => setAcceptanceCriteria(e.target.value)} placeholder="e.g., The PDF includes charts and tables" />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* LSS Bug Report Path */}
                            <div className="voc-form-group">
                                <label>What Happened? <span className="required">*</span></label>
                                <textarea className="voc-input" rows={2} value={actualBehavior} onChange={e => setActualBehavior(e.target.value)} placeholder="e.g., clicked Login and got a 500 error" />
                            </div>
                            <div className="voc-form-group">
                                <label>What Should Happen? <span className="optional">(Gap Analysis)</span></label>
                                <textarea className="voc-input" rows={2} value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} placeholder="e.g., Dashboard should load" />
                            </div>
                            <div className="voc-form-group">
                                <label>Steps to Reproduce <span className="required">*</span></label>
                                <textarea className="voc-input" rows={4} value={reproSteps} onChange={e => setReproSteps(e.target.value)} placeholder={"1. Go to /login\n2. Enter details..."} />
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
                    )}

                    {/* --- EVIDENCE --- */}
                    <div className="voc-form-group">
                        <label>Evidence / Screenshot {type === 'bug' && <span className="required">(Required)</span>}</label>
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
