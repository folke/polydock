import gi from "node-gtk"
const Gtk = gi.require("Gtk", "3.0")
const Gdk = gi.require("Gdk", "3.0")
gi.require("GdkX11", "3.0")

import { resolve } from "path"
import { Dock } from "./dock"

gi.startLoop()
Gtk.init()
Gdk.init([])

const win = new Gtk.Window({
  title: "Polydock",
  type: Gtk.WindowType.TOPLEVEL,
})
// const iconSizes = win.getScreen().geticin
// win.setDefaultSize(0, 80)
win.move(600, 0)
win.setWmclass("polydock", "Polydock")
win.setDecorated(false)
win.setTypeHint(Gdk.WindowTypeHint.DOCK)
win.stick()
win.setKeepAbove(true)
win.setSkipTaskbarHint(true)
win.on("show", () => {
  Gtk.main()
})
win.on("destroy", Gtk.mainQuit)
win.on("delete-event", () => false)

win.setResizable(true)
// win.setResizeMode(Gtk.ResizeMode.)

const css = new Gtk.CssProvider()
css.loadFromPath(resolve(__dirname, "../config/theme.css"))

Gtk.StyleContext.addProviderForScreen(
  win.getScreen(),
  css,
  Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
)

const haveAlpha = win.getScreen().getRgbaVisual() ? true : false

console.log(`Alpha: ${haveAlpha}`)
console.log(`Composited: ${win.isComposited()}`)

if (haveAlpha) {
  win.setVisual(win.getScreen().getRgbaVisual())
  win.setAppPaintable(true)
}

win.on("size-allocate", () => {
  const offsetX = Math.round(
    win.getScreen().getWidth() / 2 - win.getAllocatedWidth() / 2
  )
  if (offsetX != win.getPosition()[0]) {
    win.move(offsetX, 0)
    console.log("resized")
  }
})

const dd = new Dock()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
win.add(dd.toolbar)
win.showAll()
