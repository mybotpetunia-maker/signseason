#!/usr/bin/env python3
"""Post a tweet to @signseason via X API v2 (OAuth 1.0a)"""
import sys, json, time, hmac, hashlib, base64, urllib.parse, urllib.request, secrets

CONSUMER_KEY = "yr6AE6FclHuN0hDF4SmWCqzrX"
CONSUMER_SECRET = "fMa9Cyj7cy97WUhlsVm4jG2gTG3rITsPFhxE97ZnQvR5OuXQ9P"
ACCESS_TOKEN = "2039071310769217536-vuB6BXlnZnax2AeB3ZaFkII8qUQAJq"
ACCESS_SECRET = "YYA4hqWnQizKlWAd11ddKaTBRwmRwTsVcTT3UEOl2GoSe"

def oauth_sign(method, url, params, consumer_secret, token_secret):
    base = method.upper() + "&" + urllib.parse.quote(url, safe="") + "&" + urllib.parse.quote(urllib.parse.urlencode(sorted(params.items())), safe="")
    key = urllib.parse.quote(consumer_secret) + "&" + urllib.parse.quote(token_secret)
    return base64.b64encode(hmac.new(key.encode(), base.encode(), hashlib.sha1).digest()).decode()

def post_tweet(text):
    url = "https://api.x.com/2/tweets"
    oauth_params = {
        "oauth_consumer_key": CONSUMER_KEY,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": ACCESS_TOKEN,
        "oauth_version": "1.0",
    }
    oauth_params["oauth_signature"] = oauth_sign("POST", url, oauth_params, CONSUMER_SECRET, ACCESS_SECRET)
    auth_header = "OAuth " + ", ".join(f'{k}="{urllib.parse.quote(v)}"' for k, v in sorted(oauth_params.items()))

    body = json.dumps({"text": text}).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Authorization", auth_header)
    req.add_header("Content-Type", "application/json")

    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        tweet_id = data["data"]["id"]
        print(f"Posted: https://x.com/signseason/status/{tweet_id}")
        return data
    except urllib.request.HTTPError as e:
        print(f"Error {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: post-tweet.py 'tweet text'", file=sys.stderr)
        sys.exit(1)
    post_tweet(sys.argv[1])
