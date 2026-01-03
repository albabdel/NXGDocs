import * as LucideIcons from 'lucide-react';
import React from 'react';

// Helper to get icon component by name string
export function getIconComponent(iconName: string, size: number = 24): React.ReactNode {
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) {
    // Fallback to a default icon
    const DefaultIcon = LucideIcons.FileText;
    return <DefaultIcon size={size} />;
  }
  return <IconComponent size={size} />;
}

