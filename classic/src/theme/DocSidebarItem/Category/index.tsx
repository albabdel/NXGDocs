import React from 'react';
import DocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';
import type {WrapperProps} from '@docusaurus/types';
import type {Props} from '@theme/DocSidebarItem/Category';

type CategoryProps = WrapperProps<typeof DocSidebarItemCategory>;

export default function DocSidebarItemCategoryWrapper(props: CategoryProps): JSX.Element {
  return <DocSidebarItemCategory {...props} />;
}
