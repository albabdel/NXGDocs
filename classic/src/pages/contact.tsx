import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
    Headphones,
    Mail,
    Phone,
    BookOpen,
    MessageSquare,
    MapPin,
    Clock,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Send,
    AlertCircle,
    Key,
    Cpu,
    Activity,
    ArrowRight,
} from 'lucide-react';
import styles from './index.module.css';

type ContactMethod = {
    title: string;
    description: string;
    icon: React.ReactNode;
    link?: string;
    linkText?: string;
    external?: boolean;
};

type FAQItem = {
    question: string;
    answer: string;
    icon: React.ReactNode;
};

type OfficeLocation = {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    hours: string;
};

const contactMethods: ContactMethod[] = [
    {
        title: 'Support Portal',
        description: 'Submit tickets, track requests, and access your support history',
        icon: <Headphones className="w-6 h-6" />,
        link: 'https://nxgen.cloud/support',
        linkText: 'Open Portal',
        external: true,
    },
    {
        title: 'Email Support',
        description: 'Send us an email for non-urgent inquiries',
        icon: <Mail className="w-6 h-6" />,
        link: 'mailto:support@nxgen.cloud',
        linkText: 'support@nxgen.cloud',
        external: true,
    },
    {
        title: 'Phone Support',
        description: 'Critical issues requiring immediate assistance',
        icon: <Phone className="w-6 h-6" />,
        linkText: 'Available 24/7 for critical issues',
    },
    {
        title: 'Documentation',
        description: 'Browse guides, tutorials, and API references',
        icon: <BookOpen className="w-6 h-6" />,
        link: '/docs',
        linkText: 'View Docs',
    },
];

const faqItems: FAQItem[] = [
    {
        question: 'How do I reset my password?',
        answer: 'Navigate to Settings > Security > Change Password. You can also use the "Forgot Password" link on the login page to receive a reset email. For security purposes, password reset links expire after 24 hours.',
        icon: <Key className="w-5 h-5" />,
    },
    {
        question: 'How do I add a new device?',
        answer: 'Go to Devices > Add Device in the main navigation. Follow the guided setup wizard to configure your device type, network settings, and integration options. Most devices can be added in under 5 minutes.',
        icon: <Cpu className="w-5 h-5" />,
    },
    {
        question: 'How do I check system status?',
        answer: 'Visit our status page at status.nxgen.cloud for real-time system health information, scheduled maintenance windows, and incident updates. You can also subscribe to receive status notifications.',
        icon: <Activity className="w-5 h-5" />,
    },
];

const officeLocations: OfficeLocation[] = [
    {
        name: 'NXGEN Headquarters',
        address: '123 Innovation Drive, Tech City, TC 10001',
        phone: '+1 (555) 123-4567',
        email: 'info@nxgen.cloud',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
    },
    {
        name: 'EMEA Support Center',
        address: '456 Enterprise Lane, London, UK EC2A 1NT',
        phone: '+44 20 1234 5678',
        email: 'emea@nxgen.cloud',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM GMT',
    },
];

export default function ContactPage(): React.JSX.Element {
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const toggleFaq = (question: string) => {
        setExpandedFaq(expandedFaq === question ? null : question);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.open('mailto:support@nxgen.cloud?subject=' + encodeURIComponent(formData.subject) + '&body=' + encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`));
    };

    return (
        <Layout title="Contact | NXGEN Support" description="Contact NXGEN Support - Get help with GCXONE platform">
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link to="/" className="flex items-center gap-1 hover:text-[#E8B058] transition-colors no-underline">
                            <span>Home</span>
                        </Link>
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                        <span style={{ color: 'var(--ifm-color-content)' }}>Contact</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <section className="mb-16">
                        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(232,176,88,0.08) 0%, rgba(0,0,0,0.5) 50%, rgba(232,176,88,0.05) 100%)'
                                : 'linear-gradient(135deg, rgba(232,176,88,0.12) 0%, rgba(255,255,255,0.8) 50%, rgba(232,176,88,0.08) 100%)',
                            border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
                        }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
                            }} />

                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={styles.sectionBadge}>Support</span>
                                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                                            background: 'rgba(34, 197, 94, 0.15)',
                                            color: '#22c55e',
                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                        }}>
                                            24/7 Support
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                                        Contact NXGEN Support
                                    </h1>
                                    <p className="text-lg mb-6 max-w-2xl" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Get help with GCXONE platform. Our team is available around the clock to assist you with any questions or issues.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to="https://nxgen.cloud/support"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200 no-underline"
                                            style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                        >
                                            <Headphones className="w-5 h-5" />
                                            Open Support Portal
                                        </Link>
                                        <Link
                                            to="mailto:support@nxgen.cloud"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all duration-200 no-underline"
                                            style={{
                                                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                        >
                                            <Mail className="w-5 h-5" />
                                            Email Us
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:w-72 w-full">
                                    <div className="p-4 rounded-xl" style={{
                                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                                    }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock className="w-4 h-4" style={{ color: '#E8B058' }} />
                                            <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                                                Response Times
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span style={{ color: 'var(--ifm-color-content-secondary)' }}>Critical</span>
                                                <span className="font-medium" style={{ color: '#ef4444' }}>&lt; 1 hour</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span style={{ color: 'var(--ifm-color-content-secondary)' }}>High</span>
                                                <span className="font-medium" style={{ color: '#f59e0b' }}>&lt; 4 hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span style={{ color: 'var(--ifm-color-content-secondary)' }}>Normal</span>
                                                <span className="font-medium" style={{ color: '#22c55e' }}>&lt; 24 hours</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Channels</span>
                                <h2 className="text-2xl font-bold text-[#E8B058] mt-2">Contact Methods</h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Choose the best way to reach us
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {contactMethods.map((method) => (
                                <div
                                    key={method.title}
                                    className="rounded-xl border p-5 transition-all duration-200 hover:scale-[1.02]"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                                            background: 'rgba(232,176,88,0.1)',
                                            color: '#E8B058',
                                        }}>
                                            {method.icon}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                                        {method.title}
                                    </h3>
                                    <p className="text-xs mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {method.description}
                                    </p>
                                    {method.link ? (
                                        <Link
                                            to={method.link}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-[#E8B058] hover:underline no-underline"
                                            {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            {method.linkText}
                                            {method.external && <ExternalLink className="w-3 h-3" />}
                                        </Link>
                                    ) : (
                                        <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                            {method.linkText}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Send Message</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Contact Form
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Fill out the form below and we will get back to you
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="rounded-xl border p-6" style={{
                                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                            }}>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8B058]/30"
                                            style={{
                                                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8B058]/30"
                                            style={{
                                                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8B058]/30"
                                            style={{
                                                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8B058]/30 resize-none"
                                            style={{
                                                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                            placeholder="Describe your issue or question in detail..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200"
                                        style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border p-5" style={{
                                    background: isDark ? 'rgba(232,176,88,0.05)' : 'rgba(232,176,88,0.08)',
                                    borderColor: 'rgba(232,176,88,0.2)',
                                }}>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#E8B058' }} />
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                                                Before You Submit
                                            </h4>
                                            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                Check our <Link to="/docs/knowledge-base/faq" className="text-[#E8B058] hover:underline no-underline">FAQ section</Link> for quick answers to common questions. You might find your solution faster!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-5" style={{
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare className="w-4 h-4" style={{ color: '#E8B058' }} />
                                        <h4 className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                            What to Include
                                        </h4>
                                    </div>
                                    <ul className="space-y-2 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#E8B058' }}>•</span>
                                            Your account email or customer ID
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#E8B058' }}>•</span>
                                            Steps to reproduce the issue
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#E8B058' }}>•</span>
                                            Screenshots or error messages
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#E8B058' }}>•</span>
                                            Browser and device information
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border p-5" style={{
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Headphones className="w-4 h-4" style={{ color: '#E8B058' }} />
                                        <h4 className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                            Need Faster Help?
                                        </h4>
                                    </div>
                                    <p className="text-xs mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        For urgent issues, use the support portal for priority handling and real-time tracking.
                                    </p>
                                    <Link
                                        to="https://nxgen.cloud/support"
                                        className="inline-flex items-center gap-1 text-xs font-medium text-[#E8B058] hover:underline no-underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Support Portal
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Quick Answers</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Frequently Asked Questions
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Find quick answers to common questions
                                </p>
                            </div>
                            <Link
                                to="/docs/knowledge-base/faq"
                                className="inline-flex items-center gap-1.5 text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline group"
                            >
                                View All FAQs
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {faqItems.map((item) => {
                                const isExpanded = expandedFaq === item.question;
                                return (
                                    <div
                                        key={item.question}
                                        className="rounded-xl border overflow-hidden transition-all duration-200"
                                        style={{
                                            borderColor: isExpanded ? 'rgba(232,176,88,0.3)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleFaq(item.question)}
                                            className="w-full text-left p-5 flex items-center justify-between gap-4"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                                    background: 'rgba(232,176,88,0.1)',
                                                    color: '#E8B058',
                                                }}>
                                                    {item.icon}
                                                </div>
                                                <span className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                                    {item.question}
                                                </span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: '#E8B058' }} />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                                            )}
                                        </button>
                                        {isExpanded && (
                                            <div className="px-5 pb-5 pl-19 ml-14">
                                                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                    {item.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Locations</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Office Locations
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Our global support centers
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {officeLocations.map((office) => (
                                <div
                                    key={office.name}
                                    className="rounded-xl border p-6"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                            background: 'rgba(232,176,88,0.1)',
                                            color: '#E8B058',
                                        }}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                                {office.name}
                                            </h3>
                                            <div className="space-y-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                <p>{office.address}</p>
                                                {office.phone && (
                                                    <p className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" style={{ color: '#E8B058' }} />
                                                        {office.phone}
                                                    </p>
                                                )}
                                                {office.email && (
                                                    <p className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4" style={{ color: '#E8B058' }} />
                                                        <a href={`mailto:${office.email}`} className="text-[#E8B058] hover:underline no-underline">
                                                            {office.email}
                                                        </a>
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" style={{ color: '#E8B058' }} />
                                                    {office.hours}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="mt-20">
                        <div
                            className="relative overflow-hidden rounded-2xl border p-10"
                            style={{
                                background: 'var(--ifm-background-surface-color)',
                                borderColor: 'var(--ifm-color-emphasis-200)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/6 via-transparent to-[#E8B058]/6 pointer-events-none" />
                            <div
                                className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
                                }}
                            />

                            <div className="relative z-10 text-center">
                                <h2
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: 'var(--ifm-color-content)' }}
                                >
                                    Still need help?
                                </h2>
                                <p
                                    className="text-base mb-6 max-w-lg mx-auto"
                                    style={{ color: 'var(--ifm-color-content-secondary)' }}
                                >
                                    Browse our comprehensive documentation for detailed guides and tutorials
                                </p>
                                <Link
                                    to="/docs"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200 no-underline"
                                    style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Browse Documentation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
