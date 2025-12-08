// ... existing code ...

// Get sidebar config - Parse actual sidebars.ts file
app.get('/api/sidebar-config', authenticate, async (req, res) => {
  try {
    const sidebarsPath = path.join(__dirname, 'sidebars.ts');
    const content = await fs.readFile(sidebarsPath, 'utf-8');
    
    // Parse the refinedSidebars.tutorialSidebar array
    // Find the tutorialSidebar array in refinedSidebars
    const sidebarMatch = content.match(/const refinedSidebars[^=]*=\s*\{[\s\S]*?tutorialSidebar:\s*\[([\s\S]*?)\]\s*\};/);
    
    if (!sidebarMatch) {
      return res.status(500).json({ error: 'Could not parse sidebars.ts' });
    }

    const sidebarContent = sidebarMatch[1];
    const items = [];
    
    // Simple parser for sidebar items
    // This handles: type, label, href, link, collapsible, collapsed, items, dirName, id
    let currentPos = 0;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let currentItem = null;
    let itemStart = -1;
    
    const parseValue = (str) => {
      // Remove quotes and unescape
      if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1).replace(/\\(.)/g, '$1');
      }
      return str.trim();
    };
    
    const parseObject = (objStr) => {
      const item = {};
      // Match key-value pairs
      const pairs = objStr.match(/(\w+):\s*([^,}]+)/g);
      if (pairs) {
        pairs.forEach(pair => {
          const match = pair.match(/(\w+):\s*(.+)/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            
            // Handle different value types
            if (value.startsWith('{')) {
              // Object value (like link: { type: "generated-index" })
              const objMatch = value.match(/\{([^}]+)\}/);
              if (objMatch) {
                const innerPairs = objMatch[1].match(/(\w+):\s*([^,}]+)/g);
                if (innerPairs) {
                  const innerObj = {};
                  innerPairs.forEach(ip => {
                    const ipMatch = ip.match(/(\w+):\s*(.+)/);
                    if (ipMatch) {
                      innerObj[ipMatch[1].trim()] = parseValue(ipMatch[2].trim());
                    }
                  });
                  value = innerObj;
                }
              }
            } else if (value.startsWith('[')) {
              // Array value (like items: [...])
              const arrMatch = value.match(/\[([^\]]*)\]/);
              if (arrMatch && arrMatch[1]) {
                // Parse nested items recursively
                const nestedItems = [];
                let nestedContent = arrMatch[1];
                // Simple nested parsing - find complete objects
                let nestedBraceCount = 0;
                let nestedStart = -1;
                for (let i = 0; i < nestedContent.length; i++) {
                  if (nestedContent[i] === '{') {
                    if (nestedBraceCount === 0) nestedStart = i;
                    nestedBraceCount++;
                  } else if (nestedContent[i] === '}') {
                    nestedBraceCount--;
                    if (nestedBraceCount === 0 && nestedStart >= 0) {
                      const nestedObjStr = nestedContent.substring(nestedStart, i + 1);
                      const nestedItem = parseObject(nestedObjStr);
                      if (nestedItem.type) {
                        nestedItems.push(nestedItem);
                      }
                      nestedStart = -1;
                    }
                  }
                }
                value = nestedItems;
              } else {
                value = [];
              }
            } else {
              // Simple value (string, boolean, number)
              value = parseValue(value);
              // Convert boolean strings
              if (value === 'true') value = true;
              if (value === 'false') value = false;
            }
            
            item[key] = value;
          }
        });
      }
      return item;
    };
    
    // Find all top-level objects in the array
    let braceDepth = 0;
    let startPos = -1;
    
    for (let i = 0; i < sidebarContent.length; i++) {
      const char = sidebarContent[i];
      
      if (char === '{') {
        if (braceDepth === 0) {
          startPos = i;
        }
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0 && startPos >= 0) {
          const itemStr = sidebarContent.substring(startPos, i + 1);
          const item = parseObject(itemStr);
          if (item.type) {
            // Generate ID if not present
            if (!item.id) {
              item.id = `sidebar-${items.length}-${item.type}-${item.label || item.dirName || 'item'}`.toLowerCase().replace(/\s+/g, '-');
            }
            items.push(item);
          }
          startPos = -1;
        }
      }
    }
    
    res.json(items);
  } catch (error) {
    console.error('Error parsing sidebar config:', error);
    res.status(500).json({ error: error.message || 'Failed to parse sidebar config' });
  }
});

// ... rest of existing code ...
