import React, { ReactNode } from 'react';
import { useFeatureFlag } from '../../hooks/usePostHog';

interface FeatureFlagProps {
  flagKey: string;
  children: ReactNode;
  fallback?: ReactNode;
  showVariant?: boolean;
}

export function FeatureFlag({ flagKey, children, fallback = null, showVariant = false }: FeatureFlagProps) {
  const { isEnabled, variant } = useFeatureFlag(flagKey);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  if (showVariant && typeof children === 'function') {
    return <>{(children as (variant: string | boolean | null) => ReactNode)(variant)}</>;
  }

  return <>{children}</>;
}

interface FeatureFlagGateProps {
  flagKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureFlagGate({ flagKey, children, fallback = null }: FeatureFlagGateProps) {
  const { isEnabled } = useFeatureFlag(flagKey);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ABTestProps {
  flagKey: string;
  variantA: ReactNode;
  variantB: ReactNode;
  variantC?: ReactNode;
  variantD?: ReactNode;
}

export function ABTest({ flagKey, variantA, variantB, variantC, variantD }: ABTestProps) {
  const { variant } = useFeatureFlag(flagKey);

  switch (variant) {
    case 'b':
    case 'variant-b':
    case 'test':
      return <>{variantB}</>;
    case 'c':
    case 'variant-c':
      if (variantC) return <>{variantC}</>;
      return <>{variantB}</>;
    case 'd':
    case 'variant-d':
      if (variantD) return <>{variantD}</>;
      return <>{variantB}</>;
    case 'a':
    case 'variant-a':
    case 'control':
    default:
      return <>{variantA}</>;
  }
}

interface FeatureFlagLoaderProps {
  flagKey: string;
  children: ReactNode;
  loader?: ReactNode;
}

export function FeatureFlagLoader({ flagKey, children, loader = <div>Loading...</div> }: FeatureFlagLoaderProps) {
  return (
    <Suspense fallback={loader}>
      <FeatureFlag flagKey={flagKey}>{children}</FeatureFlag>
    </Suspense>
  );
}
