#!/usr/bin/env python3
"""
Complete theme fix for all landing pages
Replaces all color-specific styling with gold theme
"""

import re
import sys

def fix_feature_cards(content):
    """Fix feature card styling"""
    # Update card container
    content = re.sub(
        r'className="block h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-\w+-\d+ dark:hover:border-\w+-\d+ transition-all group"',
        '''className="block h-full rounded-xl shadow-md hover:shadow-xl transition-all group no-underline"
                                style={{
                                    backgroundColor: 'var(--ifm-background-surface-color)',
                                    border: '1px solid var(--ifm-color-emphasis-200)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#E8B058';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                                }}''',
        content
    )

    # Update card icon containers - remove specific colors
    content = re.sub(
        r'<div className="p-3 bg-\w+-\d+ dark:bg-\w+-\d+/\d+ rounded-lg text-\w+-\d+ dark:text-\w+-\d+ group-hover:scale-110 transition-transform">',
        '''<div className="p-3 rounded-lg group-hover:scale-110 transition-transform" style={{
                                            backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                            color: '#E8B058'
                                        }}>''',
        content
    )

    # Update card titles
    content = re.sub(
        r'<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-\w+-\d+ dark:group-hover:text-\w+-\d+ transition-colors">',
        '<h3 className="text-lg font-semibold mb-2 transition-colors" style={{ color: \'var(--ifm-color-content)\' }}>',
        content
    )

    # Update card descriptions
    content = re.sub(
        r'<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">',
        '<p className="text-sm mb-4 line-clamp-3" style={{ color: \'var(--ifm-color-content-secondary)\' }}>',
        content
    )

    # Update "Learn more" links
    content = re.sub(
        r'<div className="flex items-center text-sm text-\w+-\d+ dark:text-\w+-\d+ font-medium">',
        '<div className="flex items-center text-sm font-medium" style={{ color: \'#E8B058\' }}>',
        content
    )

    return content

def fix_empty_state(content):
    """Fix empty state styling"""
    content = re.sub(
        r'<AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />',
        '<AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: \'var(--ifm-color-emphasis-400)\' }} />',
        content
    )

    content = re.sub(
        r'<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">',
        '<h3 className="text-xl font-semibold mb-2" style={{ color: \'var(--ifm-color-content)\' }}>',
        content
    )

    content = re.sub(
        r'<p className="text-gray-600 dark:text-gray-400 mb-6">',
        '<p className="mb-6" style={{ color: \'var(--ifm-color-content-secondary)\' }}>',
        content
    )

    content = re.sub(
        r'className="px-6 py-3 bg-\w+-\d+ text-white rounded-lg hover:bg-\w+-\d+ transition-colors"',
        '''className="px-6 py-3 rounded-lg transition-colors font-medium"
                            style={{ backgroundColor: '#E8B058', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4A04E'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8B058'}''',
        content
    )

    return content

def fix_quick_links(content):
    """Fix quick links section styling"""
    # Update section container
    content = re.sub(
        r'className="mt-16 bg-gradient-to-br from-\w+-\d+ to-\w+-\d+ dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-\w+-\d+ dark:border-gray-700"',
        '''className="mt-16 rounded-2xl p-8"
                    style={{
                        backgroundColor: 'var(--ifm-color-emphasis-100)',
                        border: '1px solid var(--ifm-color-emphasis-200)'
                    }}''',
        content
    )

    # Update section title
    content = re.sub(
        r'<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">',
        '<h2 className="text-2xl font-bold mb-6" style={{ color: \'var(--ifm-color-content)\' }}>',
        content
    )

    # Update quick link cards
    content = re.sub(
        r'className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-\w+-\d+ dark:hover:border-\w+-\d+ hover:shadow-lg transition-all group"',
        '''className="flex items-start gap-4 p-6 rounded-xl hover:shadow-lg transition-all group no-underline"
                                style={{
                                    backgroundColor: 'var(--ifm-background-surface-color)',
                                    border: '1px solid var(--ifm-color-emphasis-200)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#E8B058';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                                }}''',
        content
    )

    # Update quick link icon containers
    content = re.sub(
        r'<div className="p-3 bg-\w+-\d+ dark:bg-\w+-\d+/\d+ rounded-lg text-\w+-\d+ dark:text-\w+-\d+ group-hover:scale-110 transition-transform flex-shrink-0">',
        '''<div className="p-3 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0" style={{
                                    backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                    color: '#E8B058'
                                }}>''',
        content
    )

    # Update quick link titles
    content = re.sub(
        r'<h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-\w+-\d+ dark:group-hover:text-\w+-\d+ transition-colors">',
        '<h3 className="font-semibold mb-1 transition-colors" style={{ color: \'var(--ifm-color-content)\' }}>',
        content
    )

    # Update quick link descriptions
    content = re.sub(
        r'<p className="text-sm text-gray-600 dark:text-gray-400">',
        '<p className="text-sm" style={{ color: \'var(--ifm-color-content-secondary)\' }}>',
        content
    )

    return content

def fix_page(filepath):
    """Fix all sections in a page"""
    print(f"Processing {filepath}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply all fixes
    content = fix_feature_cards(content)
    content = fix_empty_state(content)
    content = fix_quick_links(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ {filepath} fixed!")

# Fix all landing pages
pages = [
    'classic/src/pages/user-management.tsx',
    'classic/src/pages/device-monitoring.tsx',
    'classic/src/pages/download-integration.tsx'
]

for page in pages:
    try:
        fix_page(page)
    except Exception as e:
        print(f"Error processing {page}: {e}")

print("\n✓ All landing pages theme fixed!")
