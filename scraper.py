import sys, json
import requests
import collections
from bs4 import BeautifulSoup

url = "https://gbf.wiki/Percival"
for line in sys.stdin:
	url = line[:-1]
# url2 = "https://gbf.wiki/main_page"
# url3 = "https://gbf.wiki/weapon_skills"
page = requests.get(url)
soup = BeautifulSoup(page.content, "html.parser")
# page2 = requests.get(url2)
# soup2 = BeautifulSoup(page2.content, "html.parser")
# page3 = requests.get(url3)
# soup3 = BeautifulSoup(page3.content, "html.parser")

table = soup.find(text="Skills").find_parent("table")
output = []
index = 0;
trs = table.find_all("tr")
for row in trs[17:]:
	output.append([cell.get_text(strip=True) for cell in row.find_all("td")])
	index += 1
# print(output)
# print(len(output))
# print(len(table.find_all("tr")))
# for i in output:
#         print(len(i))
possibleSkills = []
for i in output:
        if (len(i) == 6):
                possibleSkills.append(i)
#print(possibleSkills)
skills = {}
names = []
description = []
key_value_pairs = []
i = 1
for item in possibleSkills:
        if (len(item[5]) > 4 and (item[1] not in names)):
                description.append([item[2],item[3],item[5]])
                names.append(item[1])
                #print("Skill " + str(i) + " populated.")
        i += 1
skills = collections.OrderedDict(zip(names, description))
row = trs[0]
charName = ([cell.get_text(strip=True) for cell in row.find_all("td")])[0]
outputString = ""
outputString += charName + "(" + url + "):\n"
for key in skills:
        value = skills[key]
        outputString += key + "\n"
        outputString += "CD: " + value[0] + "\n"
        outputString += "Duration: " + value[1] + "\n"
        outputString += value[2] + "\n"
sys.stdout.write(json.dumps(outputString))
#sys.stdout.write(outputString)