import { Gtk, Gdk } from "./libs"
import { resolve } from "path"
import { Dock } from "./dock"
import config from "./config"

export class App {
  window: Gtk.Window
  dock: Dock

  constructor() {
    const win = new Gtk.Window({
      title: "Polydock",
      type: Gtk.WindowType.TOPLEVEL,
    })
    this.window = win

    win.setWmclass("polydock", "Polydock")
    win.setDecorated(false)
    win.setTypeHint(Gdk.WindowTypeHint.DOCK)
    win.stick()
    win.setKeepAbove(true)
    win.setSkipTaskbarHint(true)
    win.on("show", Gtk.main)
    win.on("destroy", Gtk.mainQuit)
    win.on("delete-event", () => false)

    win.setResizable(true)

    this.loadStyles()

    win.on("size-allocate", () => this.updatePosition())

    this.dock = new Dock(["top", "bottom"].includes(config.settings.position))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    win.add(this.dock.toolbar)
    win.showAll()
  }

  loadStyles() {
    // Make window transparent if possible
    const haveAlpha = this.window.getScreen().getRgbaVisual() ? true : false

    console.log(`Alpha Visuals: ${haveAlpha}`)
    console.log(`Composited: ${this.window.isComposited()}`)

    if (haveAlpha) {
      this.window.setVisual(this.window.getScreen().getRgbaVisual())
      this.window.setAppPaintable(true)
    }

    // Load CSS
    const css = new Gtk.CssProvider()
    css.loadFromPath(resolve(__dirname, "../config/theme.css"))
    Gtk.StyleContext.addProviderForScreen(
      this.window.getScreen(),
      css,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )
  }

  updatePosition() {
    let x = 0
    let y = 0

    const screenSize = {
      width: this.window.getScreen().getWidth(),
      height: this.window.getScreen().getHeight(),
    }
    const size = {
      width: this.window.getAllocatedWidth(),
      height: this.window.getAllocatedHeight(),
    }

    if (["top", "bottom"].includes(config.settings.position)) {
      if (config.settings.position == "top") y = 0
      if (config.settings.position == "bottom")
        y = screenSize.height - size.height

      if (config.settings.alignment == "start") x = 0
      if (config.settings.alignment == "center")
        x = Math.round(screenSize.width / 2 - size.width / 2)
      if (config.settings.alignment == "end")
        x = Math.round(screenSize.width - size.width)
    }

    if (["left", "right"].includes(config.settings.position)) {
      if (config.settings.position == "left") x = 0
      if (config.settings.position == "right") x = screenSize.width - size.width

      if (config.settings.alignment == "start") y = 0
      if (config.settings.alignment == "center")
        y = Math.round(screenSize.height / 2 - size.height / 2)
      if (config.settings.alignment == "end")
        y = Math.round(screenSize.height - size.height)
    }

    x += config.settings.offset?.[0] ?? 0
    y += config.settings.offset?.[1] ?? 0

    const pos = this.window.getPosition()
    if (pos[0] != x || pos[1] != y) {
      this.window.move(x, y)
      console.log(
        `position updated to ${config.settings.position}:${config.settings.alignment} => [${x}, ${y}]`
      )
    }
  }
}
new App()
