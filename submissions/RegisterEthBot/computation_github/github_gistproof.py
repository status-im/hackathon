import sys, os, argparse
import json, urllib2

try:
    argn = int(os.environ['ARGN'])
except KeyError:
    sys.exit("No proof given")
if argn != 1:
    sys.exit("No proof given")

try:
    proof = os.environ['ARG0']
    proof_url = "https://gist.github.com/" + proof + ".json"
    request = urllib2.Request(proof_url)
    request.add_header('User-Agent', '')
    json_data = json.load(urllib2.urlopen(request))
    print("[" + json.dumps(json_data['owner']) + "," + json.dumps(json_data['description']) + "]")
except:
    print("Unable to query github")
