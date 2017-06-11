import sys, os, argparse
import json, urllib2

try:
    argn = int(os.environ['ARGN'])
except KeyError:
    sys.exit("No proof given")
if argn != 2:
    sys.exit("No proof given")

try:
    username = os.environ['ARG0']
    address = os.environ['ARG1']
    proof_url = "https://api.twitter.com/1.1/search/tweets.json?q=" + address + "%20from%3A" + username
    request = urllib2.Request(proof_url)
    request.add_header('User-Agent', '')
    request.add_header('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAADvv0wAAAAAAPtC95msOlPg9FbyAMX%2BSgB6KwiU%3DF7dbielG8OKTcQVsZDsCXGmy98juX7axF8Ftbw31daoohpBP1U')
    json_data = json.load(urllib2.urlopen(request))
    print("[" + json.dumps(json_data['statuses'][0]['user']['screen_name']) + "," + json.dumps(json_data['statuses'][0]['text']) + "]")
except:
    print("Unable to query twitter")
