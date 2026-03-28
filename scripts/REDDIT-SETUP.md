# Reddit API Setup — One-Time (5 min)

## Tara's Action: Create Reddit API App

1. Log in to Reddit as **stressblowfish**
2. Go to: https://www.reddit.com/prefs/apps
3. Scroll to bottom, click **"create another app..."**
4. Fill in:
   - **Name:** SignSeasonMonitor
   - **Type:** Select **"script"**
   - **Description:** Monitoring astrology subreddits
   - **About URL:** (leave blank)
   - **Redirect URI:** http://localhost:8080
5. Click **Create app**
6. You'll see:
   - **Client ID** (under the app name, short alphanumeric string)
   - **Client Secret** (labeled "secret")
7. Save both to 1Password as "Reddit API - Sign Season"

That's it. Once those two values are in 1Password, I handle everything else.
