import requests
from urlparse import urlparse
from bs4 import BeautifulSoup
import xlwt
import re
import json


url = 'https://www.imdb.com/chart/top/'

f = xlwt.Workbook()
sheet1 = f.add_sheet('Movies', cell_overwrite_ok=True)

row = ["id", "year", "score", "director", "actor1", "actor2", "link", "img"]
for i in range(0, len(row)):
    sheet1.write(0, i, row[i])

cnt = 1

print("url = ", url)
res = requests.get(url)
res.encoding = 'utf-8'
soup = BeautifulSoup(res.text, "lxml")

items = soup.select(".lister-list")[0]

for num in range(0, 250):
    item = items.select(".titleColumn")[num]
    title = item.a.text
    year = item.span.text[1:-1]
    diretor = item.a['title'].split("(dir.), ")[0]
    actor1 = item.a['title'].split("(dir.), ")[1].split(", ")[0]
    actor2 = item.a['title'].split("(dir.), ")[1].split(", ")[1]
    link = item.a['href']
    score = items.select(".imdbRating")[num].strong.text
    img = items.select(".posterColumn")[num].img['src']

    row = [title, year, score, diretor, actor1, actor2, link, img]
    for i in range(0, len(row)):
        sheet1.write(cnt, i, row[i])
    cnt = cnt + 1

f.save('250_1.xls')
print(cnt, "title saved.")
