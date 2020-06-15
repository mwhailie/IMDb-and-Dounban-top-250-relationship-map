# -*- coding: UTF-8 -*-
import requests
from urlparse import urlparse
from bs4 import BeautifulSoup
import xlwt
import re
import json
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

# 把 user-agent 伪装成浏览器
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'


# 构造请求头部的 user-agent
header = {}
header['user-agent'] = user_agent

f = xlwt.Workbook()
sheet1 = f.add_sheet('Movies', cell_overwrite_ok=True)

row = ["id", "year", "score", "director", "link", "img", "actor1", "actor2", "actor3"]
for i in range(0, len(row)):
    sheet1.write(0, i, row[i])

cnt = 0

url = 'https://movie.douban.com/top250?start='

while cnt < 250:

	print("url = " + url + str(cnt) )
	res = requests.get(url + str(cnt), headers=header)
	res.encoding = 'utf-8'
	list_page = BeautifulSoup(res.text, "lxml")

	for num in range(0, 25):
		try:	
			item = list_page.select(".info")[num]
			title = item.span.text
			print title
			bd = item.select(".bd")[0].p.text
			year = bd.splitlines()[2].split()[0]
			diretor = bd.split("导演: ")[1].split()[0]
			link = item.a['href']
			score = item.select(".star")[0].select(".rating_num")[0].text
			img = list_page.select(".pic")[num].img['src']

			print("url = ", link)
			res1 = requests.get(link, headers=header)
			res1.encoding = 'utf-8'
			movie_page = BeautifulSoup(res1.text, "lxml")


			actor1 = movie_page.select(".actor")[0].select(".attrs")[0].select("a")[0].text
			actor2 = movie_page.select(".actor")[0].select(".attrs")[0].select("a")[1].text
			actor3 = movie_page.select(".actor")[0].select(".attrs")[0].select("a")[2].text
		except Exception as e:
			print e

		row = [title, year, score, diretor, link, img, actor1, actor2, actor3]
		for i in range(0, len(row)):
			sheet1.write(cnt + 1, i, row[i])
		cnt = cnt + 1

f.save('Top250_Douban.xls')
print(cnt, "title saved.")
