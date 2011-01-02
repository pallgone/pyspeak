#!/usr/bin/python
from Tkinter import *
import os,  sys, urllib, re, mad, ao

lang = "en"

#define some stuff
class AppURLopener(urllib.FancyURLopener):
    version = "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
urllib._urlopener = AppURLopener()
r = re.compile("[,.;?()\\d]+ *")


def output(text, lang):
    text = r.split(text)
    for x in text:
        #os.system("mpg123 -q 'http://translate.google.com/translate_tts?q=" + urllib.quote_plus(x) + "&tl=de'")
        mf = mad.MadFile(urllib.urlopen("http://translate.google.com/translate_tts?q=" + urllib.quote_plus(x) + "&tl=" + lang))
        dev = ao.AudioDevice('alsa', rate=mf.samplerate())
        while 1:
            buf = mf.read()
            if buf is None:
                break
            dev.play(buf, len(buf))
    return

if len(sys.argv) > 1:
    text = sys.argv[1]
    output(text, lang)
    sys.exit()

class mywidgets:
    def __init__(self,root):
        frame = Frame(root)
        frame.pack()
        self.txtfr(frame)
        self.makeButton(frame)
        return

    def txtfr(self,frame):
        #define a new frame and put a text area in it
        textfr = Frame(frame)
        self.text = Text(textfr, height = 10, width = 50,background = 'white')
        # put a scroll bar in the frame
        scroll = Scrollbar(textfr)
        self.text.configure(yscrollcommand = scroll.set)
        #pack everything
        self.text.pack(side = LEFT)
        scroll.pack(side = RIGHT,fill = Y)
        textfr.pack(side = TOP)
        return

    def makeButton (self, frame):
        w = Button(text = 'TTS english', command = self.tts_en)
        w.pack(padx = 8, pady = 8)
        w = Button(text = 'TTS deutsch', command = self.tts_de)
        w.pack(padx = 8, pady = 8)
        return
    
    def tts_en(self):
        output(self.text.get('1.0', 'end').encode('utf-8'), "en")
        return
    def tts_de(self):
        output(self.text.get('1.0', 'end').encode('utf-8'), "de")
        return

    
def main():
    root = Tk()
    root.tk.call('encoding', 'system', 'utf-8')
    s = mywidgets(root)
    root.title('Text to Speech')
    root.mainloop()

main()
