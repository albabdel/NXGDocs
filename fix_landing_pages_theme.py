#!/usr/bin/env python3
"""
Fix landing pages to match GCXONE site theme
- Remove bright gradients
- Use gold accent (#E8B058)
- Use CSS variables for backgrounds and colors
"""

import re

def fix_hero_section(content, page_name, icon):
    """Replace gradient hero with clean theme-aware hero"""

    # Pattern to match the hero section
    hero_pattern = r'(            \{/\* Hero Section \*/\}\s+<div className="relative overflow-hidden bg-gradient-to-br[^>]+>.*?</div>\s+</div>)'

    replacement = f'''            {{/* Hero Section */}}
            <div className="relative overflow-hidden border-b transition-colors duration-500" style={{{{
                backgroundColor: 'var(--ifm-background-color)',
                borderColor: 'var(--ifm-color-emphasis-200)'
            }}}}>
                <div className="absolute inset-0 opacity-5" style={{{{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}}} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    {{/* Breadcrumb */}}
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{{{ color: 'var(--ifm-color-content-secondary)' }}}}>
                        <Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{{{ color: 'inherit' }}}}>
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#E8B058] font-medium">{page_name}</span>
                    </nav>

                    <motion.div
                        initial={{{{ opacity: 0, y: 20 }}}}
                        animate={{{{ opacity: 1, y: 0 }}}}
                        transition={{{{ duration: 0.5 }}}}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-2xl" style={{{{
                                backgroundColor: 'var(--ifm-color-emphasis-100)',
                                border: '1px solid var(--ifm-color-emphasis-200)'
                            }}}}>
                                <{icon} className="w-16 h-16 text-[#E8B058]" />
                            </div>
                        </div>'''

    content = re.sub(hero_pattern, replacement, content, flags=re.DOTALL)
    return content

# This is a simplified version - the actual implementation would need to handle all sections
print("This script needs to be expanded to handle all sections")
print("Due to complexity, manually applying the pattern is more reliable")
