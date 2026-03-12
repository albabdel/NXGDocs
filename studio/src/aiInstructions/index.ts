export const docWritingInstructions = {
  title: {
    instructions: `Generate a clear, concise title for a documentation page. 
The title should:
- Be 3-8 words long
- Use sentence case capitalization
- Be descriptive but not overly technical
- Start with action verbs for guides (e.g., "Configure", "Set up", "Install")
- Use nouns for reference pages (e.g., "API Reference", "Configuration Options")`,
  },
  
  description: {
    instructions: `Generate a brief description for SEO and search previews.
The description should:
- Be 120-160 characters
- Summarize the main purpose of the document
- Include relevant keywords naturally
- End with a period
- Be written for both technical and non-technical readers`,
  },
  
  body: {
    instructions: `Generate comprehensive documentation content following these guidelines:

## Structure
- Start with a brief introduction explaining what the user will learn
- Use clear headings (H2, H3) to organize content
- Include numbered steps for procedures
- Use bullet points for lists and options

## Formatting
- Use **bold** for key terms and UI elements
- Use \`code\` for commands, file names, and code references
- Use callouts for important notes, warnings, and tips

## Content Quality
- Write for the target audience (beginner to advanced)
- Include practical examples
- Explain "why" not just "how"
- Link to related documentation when relevant

## Tone
- Clear and direct
- Active voice preferred
- Avoid jargon unless necessary, then define it
- Inclusive language (avoid "simply", "just", "easy")`,
  },
}

export const articleWritingInstructions = {
  title: {
    instructions: `Generate an engaging article title that:
- Captures attention
- Clearly indicates the topic
- Is 5-10 words
- Uses title case
- Avoids clickbait language`,
  },
  
  excerpt: {
    instructions: `Generate a compelling article excerpt that:
- Hooks the reader in 1-2 sentences
- Summarizes the key insight or takeaway
- Is 100-150 characters
- Leaves the reader wanting more`,
  },
  
  body: {
    instructions: `Generate engaging article content that:
- Opens with a compelling hook or story
- Uses subheadings to break up long sections
- Includes practical examples and case studies
- Ends with clear takeaways or action items
- Balances technical depth with accessibility
- Includes relevant internal and external links`,
  },
}

export const releaseNoteInstructions = {
  title: {
    instructions: `Generate a release note title following semantic versioning:
- Format: " vX.Y.Z - [Brief Description]"
- Include version number
- Summarize the main change in 3-5 words`,
  },
  
  summary: {
    instructions: `Generate a release summary that:
- Lists key changes in bullet format
- Highlights breaking changes first
- Notes new features second
- Includes bug fixes last
- Mentions deprecations if any
- Is concise but complete`,
  },
  
  changes: {
    instructions: `Generate detailed change notes that:
- Group changes by category (Features, Fixes, Breaking Changes)
- Use clear, specific language
- Include issue/ticket references when available
- Explain impact on users
- Provide migration guidance for breaking changes`,
  },
}

export const allInstructions = {
  doc: docWritingInstructions,
  article: articleWritingInstructions,
  releaseNote: releaseNoteInstructions,
}
