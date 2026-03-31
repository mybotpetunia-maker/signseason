import os, re

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path) as fh:
                content = fh.read()
            pattern = r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']'
            m = re.search(pattern, content)
            if m:
                desc = m.group(1)
                if len(desc) > 155:
                    print(f'{path} | {len(desc)} chars | {desc}')
            else:
                print(f'{path} | NO META DESC FOUND')
