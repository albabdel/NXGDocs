const fs = require('fs');

module.exports = function (source) {
    const callback = this.async();
    const filePath = this.resourcePath;

    try {
        const stats = fs.statSync(filePath);
        const lastModified = stats.mtime;

        // Inject last modified time into frontmatter if not already present
        const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = source.match(frontMatterRegex);

        if (match) {
            const frontMatter = match[1];
            if (!frontMatter.includes('last_update:')) {
                const newFrontMatter = `${frontMatter}\nlast_update:\n  date: ${lastModified.toISOString()}\n`;
                source = source.replace(frontMatterRegex, `---\n${newFrontMatter}---`);
            }
        }

        callback(null, source);
    } catch (error) {
        callback(error);
    }
};
