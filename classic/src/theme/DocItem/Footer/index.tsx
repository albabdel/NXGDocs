import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof FooterType>;

// Simple pass-through wrapper - PageFeedback is handled in DocItem/Layout
export default function FooterWrapper(props: Props): JSX.Element {
  return <Footer {...props} />;
}
