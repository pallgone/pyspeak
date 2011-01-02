#!/usr/bin/python
from Tkinter import *
import os, sys, time, urllib, re, mad, ao, pygst, gst

import time

lang = "en"

#define some stuff
class AppURLopener(urllib.FancyURLopener):
    version = "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
urllib._urlopener = AppURLopener()
r = re.compile("[,.;?()\\d]+ *")


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
        self.player = gst.element_factory_make("playbin2", "player")
        bus = self.player.get_bus()
        bus.add_signal_watch()
        bus.connect("message", self.on_message)
        return

    def output(self, text, lang):
        text = r.split(text)
        for x in text:
            self.playmode = True
            self.player.set_property('uri', "http://translate.google.com/translate_tts?q=" + urllib.quote_plus(x) + "&tl=" + lang)
            self.player.set_state(gst.STATE_PLAYING)
            while self.playmode:
                time.sleep(1)
        #os.system("mpg123 -q 'http://translate.google.com/translate_tts?q=" + urllib.quote_plus(x) + "&tl=de'")
        # mf = mad.MadFile(urllib.urlopen("http://translate.google.com/translate_tts?q=" + urllib.quote_plus(x) + "&tl=" + lang))
        # dev = ao.AudioDevice('alsa', rate=mf.samplerate())
        # while 1:
        #     buf = mf.read()
        #     if buf is None:
        #         break
        #     dev.play(buf, len(buf))
        return

    def on_message(self, bus, message):
        t = message.type
        if t == gst.MESSAGE_EOS:
            player.set_state(gst.STATE_NULL)
            self.playmode = False
        elif t == gst.MESSAGE_ERROR:
            player.set_state(gst.STATE_NULL)
            err, debug = message.parse_error()
            print "Error: %s" % err, debug
            self.playmode = False


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
        self.output(self.text.get('1.0', 'end').encode('utf-8'), "en")
        return
    def tts_de(self):
        self.output(self.text.get('1.0', 'end').encode('utf-8'), "de")
        return

    
def main():
    root = Tk()
    root.tk.call('encoding', 'system', 'utf-8')
    s = mywidgets(root)
    root.title('Text to Speech')
    root.mainloop()

main()
