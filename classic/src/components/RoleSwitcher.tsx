import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

type UserRole = 'admin' | 'manager' | 'operator' | 'operator-minimal';

interface Role {
    id: UserRole;
    label: string;
    path: string;
}

const roles: Role[] = [
    { id: 'admin', label: 'Company Admin', path: '/docs' },
    { id: 'manager', label: 'Manager', path: '/docs' },
    { id: 'operator', label: 'Operator', path: '/docs' },
    { id: 'operator-minimal', label: 'Operator Minimal', path: '/docs' },
];

interface Props {
    type?: 'navbar' | 'sidebar';
}

export default function RoleSwitcher({ type = 'navbar' }: Props): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const [currentRole, setCurrentRole] = useState<UserRole>('admin');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detect current role from URL on mount and location change
    useEffect(() => {
        const path = location.pathname;
        const detectedRole = roles.find(r => path.startsWith(r.path));

        if (detectedRole) {
            setCurrentRole(detectedRole.id);
            localStorage.setItem('selectedRole', detectedRole.id);
        } else {
            // Load from localStorage if not on a role path
            const savedRole = localStorage.getItem('selectedRole') as UserRole || 'admin';
            setCurrentRole(savedRole);
        }
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleRoleChange = (newRoleId: UserRole) => {
        const newRole = roles.find(r => r.id === newRoleId);
        if (newRole) {
            setCurrentRole(newRoleId);
            localStorage.setItem('selectedRole', newRoleId);
            
            // Dispatch custom event to notify sidebar of role change
            window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role: newRoleId } }));
            
            // Only navigate if we're not already on a docs page, or navigate to docs root
            if (!location.pathname.startsWith('/docs')) {
                history.push(newRole.path);
            }
            setIsOpen(false);
        }
    };

    const activeRoleLabel = roles.find(r => r.id === currentRole)?.label || 'Select Role';

    if (type === 'sidebar') {
        return (
            <div style={{ marginBottom: '0.5rem', padding: '0 1.5rem' }} ref={dropdownRef}>
                <label style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--ifm-color-content-secondary)',
                    marginBottom: '0.625rem',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: 'var(--ifm-font-family-base)'
                }}>
                    View As
                </label>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: '100%',
                            background: 'var(--ifm-color-emphasis-100)',
                            border: '1px solid var(--ifm-color-emphasis-200)',
                            color: 'var(--ifm-color-content)',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            padding: '0.625rem 0.875rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'var(--ifm-font-family-base)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--ifm-color-emphasis-200)';
                            e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
                            e.currentTarget.style.color = 'var(--ifm-color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
                            e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                            e.currentTarget.style.color = 'var(--ifm-color-content)';
                        }}
                    >
                        <span>{activeRoleLabel}</span>
                        <ChevronDown 
                            size={14} 
                            style={{
                                transition: 'transform 0.2s ease',
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </button>

                    {isOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            marginTop: '0.25rem',
                            background: 'var(--ifm-background-surface-color)',
                            border: '1px solid var(--ifm-color-emphasis-200)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 50,
                            overflow: 'hidden'
                        }}>
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(role.id)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.625rem 1rem',
                                        fontSize: '0.8125rem',
                                        background: currentRole === role.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        color: currentRole === role.id ? 'var(--ifm-color-primary)' : 'var(--ifm-color-content)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontFamily: 'var(--ifm-font-family-base)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentRole !== role.id) {
                                            e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
                                            e.currentTarget.style.color = 'var(--ifm-color-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentRole !== role.id) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--ifm-color-content)';
                                        }
                                    }}
                                >
                                    {role.label}
                                    {currentRole === role.id && (
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'var(--ifm-color-primary)'
                                        }}></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Navbar implementation (Dropdown)
    return (
        <div className="navbar__item dropdown dropdown--hoverable">
            <a className="navbar__link" href="#">
                {activeRoleLabel}
            </a>
            <ul className="dropdown__menu">
                {roles.map((r) => (
                    <li key={r.id}>
                        <a
                            className={clsx('dropdown__link', {
                                'dropdown__link--active': currentRole === r.id,
                            })}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange(r.id);
                            }}
                        >
                            {r.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
