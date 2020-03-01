from PIL import Image
import os
import sys
import time
from urllib import FancyURLopener
import urllib2
import simplejson


class MyOpener(FancyURLopener):
    version = 'Chrome (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) WebKit/20071127 Chrome/2.0.0.11'


def convertImages(filename):
    print "[+] Resizing ", filename, "...",
    try:
        im = Image.open(filename)
        im = im.resize((44, 25), Image.ANTIALIAS)
        im.save(os.path.splitext(os.path.basename(filename))
                [0] + ".png", "PNG")
        print "OK"
    except:
        print "Err"


def findImage(name, id):
    print "[+] Finding logo for ", name
    name = name + " logo"
    name = name.replace(' ', '%20')
    myopener = MyOpener()
    url = ('https://ajax.googleapis.com/ajax/services/search/images?' +
           'v=1.0&q=' + name + '&userip=myipaddr&imgc=color&imgsz=large')
    request = urllib2.Request(url, None, {'Referer': 'http://tvcountdown.com'})
    response = urllib2.urlopen(request)
    results = simplejson.load(response)
    data = results['responseData']
    dataInfo = data['results']
    for myUrl in dataInfo:
        myopener.retrieve(myUrl['unescapedUrl'], id + ".png")
        return str(id) + ".png"


def findIds():
    print "[+] Getting tvcountdown page"
    myopener = MyOpener()
    url = ('http://tvcountdown.com')
    request = urllib2.Request(url, None, {'Referer': 'http://www.google.com'})
    response = urllib2.urlopen(request).read()
    print "[+] Parsing tv shows ...",
    series = []
    pos = response.find('id="show_list"')
    pos = response.find('class="si_td2"', pos)
    while pos != -1:
        pos = response.find('<input', pos)
        id = response[response.find('name', pos) +
                      7:response.find('class', pos) - 2]
        pos = response.find('<a', pos)
        name = response[response.find('">', pos) + 2:response.find('</a', pos)]
        if name.find("(") != -1:
            name = name[:name.find("(") - 1]
        series.append((id, name))
        pos = response.find('class="si_td2"', pos)
    print len(series), "found"
    return series

for serie in findIds():
    if not os.path.isfile(serie[0] + ".png"):
        convertImages(findImage(serie[1], serie[0]))
        time.sleep(10)
    else:
        print "[-] Skipping ", serie[1]
