#!/usr/bin/env python3
import re

# Fix device-monitoring.tsx hero
with open('classic/src/pages/device-monitoring.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace gradient hero
content = re.sub(
    r'<div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900">',
    '<div className="relative overflow-hidden border-b transition-colors duration-500" style={{ backgroundColor: "var(--ifm-background-color)", borderColor: "var(--ifm-color-emphasis-200)" }}>',
    content
)

content = content.replace(
    '<div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />',
    '<div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)", backgroundSize: "32px 32px" }} />'
)

# Update hero content
content = re.sub(
    r'<nav className="flex items-center gap-2 text-sm text-white/80 mb-8">',
    '<nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ifm-color-content-secondary)" }}>',
    content
)

content = re.sub(
    r'<Link href="/" className="hover:text-white transition-colors flex items-center gap-1">',
    '<Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{ color: "inherit" }}>',
    content
)

content = re.sub(
    r'<span className="text-white font-medium">Device Monitoring</span>',
    '<span className="text-[#E8B058] font-medium">Device Monitoring</span>',
    content
)

content = re.sub(
    r'<div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">',
    '<div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ifm-color-emphasis-100)", border: "1px solid var(--ifm-color-emphasis-200)" }}>',
    content
)

content = re.sub(
    r'<Activity className="w-16 h-16 text-white" />',
    '<Activity className="w-16 h-16 text-[#E8B058]" />',
    content
)

content = re.sub(
    r'<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">',
    '<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "var(--ifm-color-content)" }}>',
    content
)

content = re.sub(
    r'<p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">',
    '<p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">',
    content
)

content = re.sub(
    r'<p className="text-lg text-white/80 max-w-2xl mx-auto">',
    '<p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ifm-color-content-secondary)" }}>',
    content
)

# Stats
content = re.sub(
    r'<div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">',
    '<div key={index} className="rounded-xl shadow-lg p-6" style={{ backgroundColor: "var(--ifm-background-surface-color)", border: "1px solid var(--ifm-color-emphasis-200)" }}>',
    content
)

content = re.sub(
    r'<div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">',
    '<div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(232, 176, 88, 0.1)", color: "#E8B058" }}>',
    content
)

content = re.sub(
    r'<div className="text-3xl font-bold text-gray-900 dark:text-white">{stat\.value}</div>',
    '<div className="text-3xl font-bold" style={{ color: "var(--ifm-color-content)" }}>{stat.value}</div>',
    content
)

content = re.sub(
    r'<div className="text-sm text-gray-600 dark:text-gray-400">{stat\.label}</div>',
    '<div className="text-sm" style={{ color: "var(--ifm-color-content-secondary)" }}>{stat.label}</div>',
    content
)

with open('classic/src/pages/device-monitoring.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('device-monitoring.tsx hero updated!')

# Fix download-integration.tsx hero
with open('classic/src/pages/download-integration.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">',
    '<div className="relative overflow-hidden border-b transition-colors duration-500" style={{ backgroundColor: "var(--ifm-background-color)", borderColor: "var(--ifm-color-emphasis-200)" }}>',
    content
)

content = content.replace(
    '<div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />',
    '<div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)", backgroundSize: "32px 32px" }} />'
)

content = re.sub(
    r'<nav className="flex items-center gap-2 text-sm text-white/80 mb-8">',
    '<nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ifm-color-content-secondary)" }}>',
    content
)

content = re.sub(
    r'<Link href="/" className="hover:text-white transition-colors flex items-center gap-1">',
    '<Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{ color: "inherit" }}>',
    content
)

content = re.sub(
    r'<span className="text-white font-medium">Download Integration Tools</span>',
    '<span className="text-[#E8B058] font-medium">Download Integration Tools</span>',
    content
)

content = re.sub(
    r'<div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">',
    '<div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ifm-color-emphasis-100)", border: "1px solid var(--ifm-color-emphasis-200)" }}>',
    content
)

content = re.sub(
    r'<Download className="w-16 h-16 text-white" />',
    '<Download className="w-16 h-16 text-[#E8B058]" />',
    content
)

content = re.sub(
    r'<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">',
    '<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "var(--ifm-color-content)" }}>',
    content
)

content = re.sub(
    r'<p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">',
    '<p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">',
    content
)

content = re.sub(
    r'<p className="text-lg text-white/80 max-w-2xl mx-auto">',
    '<p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ifm-color-content-secondary)" }}>',
    content
)

content = re.sub(
    r'<div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">',
    '<div key={index} className="rounded-xl shadow-lg p-6" style={{ backgroundColor: "var(--ifm-background-surface-color)", border: "1px solid var(--ifm-color-emphasis-200)" }}>',
    content
)

content = re.sub(
    r'<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">',
    '<div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(232, 176, 88, 0.1)", color: "#E8B058" }}>',
    content
)

content = re.sub(
    r'<div className="text-3xl font-bold text-gray-900 dark:text-white">{stat\.value}</div>',
    '<div className="text-3xl font-bold" style={{ color: "var(--ifm-color-content)" }}>{stat.value}</div>',
    content
)

content = re.sub(
    r'<div className="text-sm text-gray-600 dark:text-gray-400">{stat\.label}</div>',
    '<div className="text-sm" style={{ color: "var(--ifm-color-content-secondary)" }}>{stat.label}</div>',
    content
)

with open('classic/src/pages/download-integration.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('download-integration.tsx hero updated!')
print('All heroes fixed!')
