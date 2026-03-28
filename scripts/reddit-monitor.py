#!/usr/bin/env python3
"""
Reddit Astrology Subreddit Monitor
Finds threads where Sign Season could add value with a helpful comment.
READ-ONLY — does not post anything.

Usage:
  python3 reddit-monitor.py                    # Scan all target subs
  python3 reddit-monitor.py --sub astrology    # Scan specific sub
  python3 reddit-monitor.py --drafts           # Generate comment drafts for top threads

Requires: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET env vars
          (or set in 1Password and use `op run`)
"""

import praw
import os
import sys
import json
import argparse
from datetime import datetime, timezone

# Target subreddits (ordered by relevance)
TARGET_SUBS = [
    "astrology",          # 662K members, strict moderation
    "AskAstrology",       # 189K, Q&A format (great for helpful answers)
    "zodiacsigns",        # 54K, casual
    "Zodiac",             # 22K, general
    "astrologymemes",     # 371K, meme-heavy but huge engagement
    "tarot",              # 303K, adjacent audience
    "Crystals",           # 176K, crystals content overlap
    "spirituality",       # 524K, broader audience
]

# Keywords that signal threads where we can add value
ENGAGEMENT_KEYWORDS = [
    "compatibility", "compatible", "what sign",
    "birth chart", "rising sign", "moon sign", "sun sign",
    "which crystal", "best crystal", "crystal for",
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
    "relationship", "dating a", "partner is a",
    "traits", "personality", "characteristics",
]

def get_reddit():
    """Initialize Reddit API (read-only)."""
    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("ERROR: Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET env vars")
        print("  Option 1: export them directly")
        print("  Option 2: op run --env-file=.env -- python3 reddit-monitor.py")
        sys.exit(1)
    
    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="SignSeasonMonitor/1.0 (by u/stressblowfish)"
    )

def scan_subreddit(reddit, sub_name, limit=25):
    """Scan a subreddit for engagement-worthy threads."""
    sub = reddit.subreddit(sub_name)
    opportunities = []
    
    for post in sub.hot(limit=limit):
        title_lower = post.title.lower()
        body_lower = (post.selftext or "").lower()
        combined = title_lower + " " + body_lower
        
        # Check for keyword matches
        matches = [kw for kw in ENGAGEMENT_KEYWORDS if kw in combined]
        
        if matches and post.num_comments < 50:  # Under 50 comments = not buried
            age_hours = (datetime.now(timezone.utc).timestamp() - post.created_utc) / 3600
            
            if age_hours < 48:  # Only threads < 48 hours old
                opportunities.append({
                    "sub": sub_name,
                    "title": post.title,
                    "url": f"https://reddit.com{post.permalink}",
                    "score": post.score,
                    "comments": post.num_comments,
                    "age_hours": round(age_hours, 1),
                    "keywords": matches,
                    "body_preview": post.selftext[:200] if post.selftext else "",
                    "flair": str(post.link_flair_text) if post.link_flair_text else None,
                })
    
    return opportunities

def rank_opportunities(opportunities):
    """Rank threads by engagement potential."""
    for opp in opportunities:
        # Score: keyword count * recency * low-competition bonus
        keyword_score = len(opp["keywords"]) * 2
        recency_score = max(0, 10 - opp["age_hours"] / 5)
        competition_score = max(0, 10 - opp["comments"] / 5)
        engagement_score = min(opp["score"], 20) / 2  # Cap upvote influence
        
        opp["priority_score"] = round(
            keyword_score + recency_score + competition_score + engagement_score, 1
        )
    
    return sorted(opportunities, key=lambda x: x["priority_score"], reverse=True)

def format_output(opportunities, max_results=10):
    """Format opportunities for daily briefing."""
    top = opportunities[:max_results]
    
    output = f"# Reddit Engagement Opportunities — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
    output += f"Scanned {len(TARGET_SUBS)} subreddits, found {len(opportunities)} threads.\n"
    output += f"Top {min(max_results, len(opportunities))} by priority:\n\n"
    
    for i, opp in enumerate(top, 1):
        output += f"## {i}. r/{opp['sub']} — {opp['title']}\n"
        output += f"- **URL:** {opp['url']}\n"
        output += f"- **Score:** {opp['score']} | **Comments:** {opp['comments']} | **Age:** {opp['age_hours']}h\n"
        output += f"- **Keywords:** {', '.join(opp['keywords'][:5])}\n"
        output += f"- **Priority:** {opp['priority_score']}/30\n"
        if opp["body_preview"]:
            output += f"- **Preview:** {opp['body_preview'][:150]}...\n"
        output += "\n"
    
    return output

def main():
    parser = argparse.ArgumentParser(description="Reddit astrology subreddit monitor")
    parser.add_argument("--sub", help="Scan specific subreddit only")
    parser.add_argument("--limit", type=int, default=25, help="Posts per sub to scan")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--top", type=int, default=10, help="Number of top results")
    args = parser.parse_args()
    
    reddit = get_reddit()
    
    all_opportunities = []
    subs_to_scan = [args.sub] if args.sub else TARGET_SUBS
    
    for sub_name in subs_to_scan:
        try:
            opps = scan_subreddit(reddit, sub_name, limit=args.limit)
            all_opportunities.extend(opps)
            print(f"  r/{sub_name}: {len(opps)} threads found", file=sys.stderr)
        except Exception as e:
            print(f"  r/{sub_name}: ERROR — {e}", file=sys.stderr)
    
    ranked = rank_opportunities(all_opportunities)
    
    if args.json:
        print(json.dumps(ranked[:args.top], indent=2))
    else:
        print(format_output(ranked, max_results=args.top))

if __name__ == "__main__":
    main()
