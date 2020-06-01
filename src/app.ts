import * as config from "./config"
import * as dock from "./dock"

import * as Gtk from "./types/Gtk-3.0"
import * as Gdk from "./types/Gdk-3.0"

export class App {
  window: Gtk.Window
  dock: dock.Dock

  constructor() {
    const win = new Gtk.Window({
      title: "Polydock",
      type: Gtk.WindowType.TOPLEVEL,
    })
    this.window = win

    win.set_wmclass("polydock", "Polydock")
    win.set_decorated(false)
    win.set_type_hint(Gdk.WindowTypeHint.DOCK)
    win.stick()
    win.set_keep_above(true)
    win.set_skip_taskbar_hint(true)
    win.connect("show", () => Gtk.main())
    win.connect("destroy", () => Gtk.main_quit())
    win.connect("delete-event", () => false)

    win.set_resizable(true)

    this.loadStyles()

    win.connect("size-allocate", () => this.updatePosition())

    this.dock = new dock.Dock(
      ["top", "bottom"].includes(config.settings.position)
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    win.add(this.dock.toolbar)
    win.show_all()
  }

  loadStyles() {
    // Make window transparent if possible
    const haveAlpha = this.window.get_screen().get_rgba_visual() ? true : false

    console.log(`Alpha Visuals: ${haveAlpha}`)
    console.log(`Composited: ${this.window.is_composited()}`)

    if (haveAlpha) {
      this.window.set_visual(this.window.get_screen().get_rgba_visual())
      this.window.set_app_paintable(true)
    }

    // Load CSS
    const css = new Gtk.CssProvider()
    css.load_from_path("./config/theme.css")
    Gtk.StyleContext.add_provider_for_screen(
      this.window.get_screen(),
      css,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )
  }

  updatePosition() {
    let x = 0
    let y = 0

    const screenSize = {
      width: this.window.get_screen().get_width(),
      height: this.window.get_screen().get_height(),
    }
    const size = {
      width: this.window.get_allocated_width(),
      height: this.window.get_allocated_height(),
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

    const pos = this.window.get_position()
    if (pos[0] != x || pos[1] != y) {
      this.window.move(x, y)
      console.log(
        `position updated to ${config.settings.position}:${config.settings.alignment} => [${x}, ${y}]`
      )
    }
  }
}
