#! /usr/bin/env python3
import sys, json
import requests
import collections
from bs4 import BeautifulSoup


url = ""
for line in sys.stdin:
	url = line[:-1]
headers = requests.utils.default_headers()
headers.update(
        {
                'User-Agent': 'LyriaBot',
        }
)
page = requests.get(url, headers=headers)
soup = BeautifulSoup(page.content, "html.parser")

table = soup.findAll(text="Support Skills")[1].find_parent("table")
try:
        table
except NameError:
        sys.stdout.write("err")
else:
        output = []
        trs = table.find_all("tr")
        for row in trs:
	        output.append([cell.get_text(strip=True) for cell in row.find_all("td")])
        possibleSkills = []
        for i in output:
                if (len(i) == 4):
                        possibleSkills.append(i)
        skills = {}
        names = []
        description = []
        key_value_pairs = []
        for item in possibleSkills:
                if (len(item[3]) > 4 and (item[1] not in names)):
                        description.append([item[2],item[3]])
                        names.append(item[1])
        skills = collections.OrderedDict(zip(names, description))
        charName = soup.find("h1", {"id":"firstHeading"}).get_text(strip=True)
        outputString = ""
        outputString += charName + "\n" + url + "\n"
        for key in skills:
                value = skills[key]
                outputString += key + "\n"
                outputString += "*Obtained*: " + value[0] + "\n"
                outputString += value[1] + "\n"
        sys.stdout.write(outputString)
