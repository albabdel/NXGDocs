import os
from PIL import Image

def generate_favicon():
    source_path = r"c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\img\xo-logo.png"
    dest_path = r"c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\img\favicon.png"

    if not os.path.exists(source_path):
        # Fallback if case sensitivity issues or slightly different name
        source_path = r"c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\img\Xo.png"
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    try:
        with Image.open(source_path) as img:
            # Resize to 32x32 for standard favicon
            favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
            favicon.save(dest_path, "PNG")
            print(f"Successfully generated favicon at {dest_path}")
    except Exception as e:
        print(f"Error generating favicon: {e}")

if __name__ == "__main__":
    generate_favicon()
