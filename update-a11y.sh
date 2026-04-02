#!/bin/bash
# Add accessibility improvements to all content pages
cd /Users/petunia1/.openclaw/workspace/signseason

UPDATED=0

for f in signs/*.html compatibility/*.html crystals/*.html; do
  [ -f "$f" ] || continue
  [[ "$f" == */index.html ]] && continue
  
  # 1. Add skip-nav link after <body> tag (if not already present)
  if ! grep -q "skip-nav" "$f"; then
    sed -i '' 's|<body class="has-site-nav">|<body class="has-site-nav">\n<a href="#main-content" class="skip-nav">Skip to content</a>|' "$f"
  fi
  
  # 2. Add aria-label to nav
  if grep -q '<nav class="site-nav">' "$f" && ! grep -q 'aria-label="Main navigation"' "$f"; then
    sed -i '' 's|<nav class="site-nav">|<nav class="site-nav" role="navigation" aria-label="Main navigation">|' "$f"
  fi
  
  # 3. Add aria-labels to email inputs (mid-cta-input)
  if grep -q 'class="mid-cta-input"' "$f" && ! grep -q 'aria-label=' "$f"; then
    sed -i '' 's|<input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email1">|<input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email1" aria-label="Email address for weekly reading">|' "$f"
    sed -i '' 's|<input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email2">|<input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email2" aria-label="Email address to subscribe">|' "$f"
  fi
  
  # 4. Add skip-nav CSS + focus-visible styles (inject before first </style>)
  if ! grep -q "skip-nav" "$f" 2>/dev/null || ! grep -q "focus-visible" "$f"; then
    sed -i '' '0,/<\/style>/{s|</style>|.skip-nav{position:absolute;top:-100px;left:16px;background:#C9AD6F;color:#1E1528;padding:8px 16px;border-radius:0 0 4px 4px;font-size:0.8rem;font-weight:700;text-decoration:none;z-index:9999;transition:top 0.2s;}.skip-nav:focus{top:0;}a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #C9AD6F;outline-offset:2px;}</style>|}' "$f"
  fi
  
  # 5. Add id="main-content" to the first <article> or main content area
  if ! grep -q 'id="main-content"' "$f"; then
    # Most sign pages use <article> as main content
    sed -i '' '0,/<article/{s|<article|<article id="main-content"|;}' "$f"
    # If no <article>, try the first content section
    if ! grep -q 'id="main-content"' "$f"; then
      sed -i '' '0,/<section class="hero\|<section class="sign-/{s|<section|<section id="main-content"|;}' "$f"
    fi
  fi
  
  UPDATED=$((UPDATED + 1))
done

echo "Updated $UPDATED files"
