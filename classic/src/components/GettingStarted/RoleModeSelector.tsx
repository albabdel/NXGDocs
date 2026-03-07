import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { UserRole } from '../../types/onboarding';

const roles: { value: UserRole; label: string; description: string }[] = [
    { value: UserRole.ADMIN, label: 'Administrator', description: 'Full platform access' },
    { value: UserRole.OPERATOR, label: 'Operator', description: 'Daily alarm monitoring' },
    { value: UserRole.INSTALLER, label: 'Installer', description: 'Device setup & config' },
    { value: UserRole.MANAGER, label: 'Manager', description: 'Reports & oversight' },
];

export function RoleModeSelector(): React.JSX.Element {
    const { selectedRole, setSelectedRole } = useOnboarding();

    return (
        <div className="mb-8">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Filter by your role:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {roles.map((role) => {
                    const isActive = selectedRole === role.value;
                    return (
                        <button
                            key={role.value}
                            onClick={() => setSelectedRole(role.value)}
                            className="text-left p-3 rounded-lg border transition-all"
                            style={{
                                backgroundColor: isActive
                                    ? 'rgba(232, 176, 88, 0.1)'
                                    : 'var(--ifm-background-surface-color)',
                                borderColor: isActive ? '#E8B058' : 'var(--ifm-color-emphasis-200)',
                                color: 'var(--ifm-color-content)',
                            }}
                        >
                            <div
                                className="font-medium text-sm"
                                style={{ color: isActive ? '#E8B058' : 'var(--ifm-color-content)' }}
                            >
                                {role.label}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                {role.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
