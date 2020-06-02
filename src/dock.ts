import { DockItem } from "./dock-item"
import config from "./config"

import * as Gtk from "./types/Gtk-3.0"
import * as Wnck from "./types/Wnck-3.0"

export class Dock {
  items = new Map<number, DockItem>()
  toolbar = new Gtk.Toolbar()
  screen: Wnck.Screen

  constructor(public horizontal = true) {
    const screen = Wnck.Screen.get_default()
    if (!screen) throw new Error("No screens detected!")
    this.screen = screen
    this.toolbar.set_show_arrow(false)
    this.toolbar.set_orientation(
      horizontal ? Gtk.Orientation.HORIZONTAL : Gtk.Orientation.VERTICAL
    )
    this.toolbar.show_all()
    this.screen.force_update()
    this.update()
    screen.connect("viewports-changed", () => this.update())
    screen.connect("active-workspace-changed", () => this.update())
    screen.connect("active-window-changed", (screen, prev) => {
      if (prev) this.items.get(prev.get_xid())?.setClass("active-window", false)
      this.items
        .get(screen.get_active_window()?.get_xid())
        ?.setClass("active-window", true)
      this.update()
    })
    screen.connect("window-opened", () => this.update())
    screen.connect("window-closed", () => this.update())

    // this.toolbar.connect("add", () => this.toolbar.check_resize())
    // this.toolbar.connect("remove", () => this.toolbar.check_resize())
  }

  getWorkspaceXids(windows: Wnck.Window[]) {
    const activeWorkspace = this.screen.get_active_workspace()
    return new Set(
      windows
        .filter((w) => w.is_on_workspace(activeWorkspace))
        .map((x) => x.get_xid())
    )
  }

  update() {
    const windows = this.screen.get_windows()
    if (!windows) return log("No Windows!")

    // Add opened windows
    windows.forEach((window) => {
      const xid = window.get_xid()
      if (!this.items.has(xid)) {
        window.connect("geometry-changed", () => this.toolbar.check_resize())
        window.connect("workspace-changed", () => this.update())
        log(`+ ${window.get_class_instance_name()}`)
        const item = new DockItem(window, this.horizontal)
        this.toolbar.add(item.button)
        this.items.set(xid, item)
      }
    })

    // Remove closed windows
    const xids = new Set<number>(windows.map((x) => x.get_xid()))
    for (const [xid, item] of this.items.entries()) {
      if (!xids.has(xid)) {
        log(`- ${item.window.get_class_instance_name()}`)
        this.items.delete(xid)
        this.toolbar.remove(item.button)
      }
    }

    // Update window state
    if (config.settings.behaviour.activeWorkspaceOnly) {
      const workspace = this.getWorkspaceXids(windows)
      for (const [xid, item] of this.items.entries()) {
        if (workspace.has(xid)) {
          item.button.show_all()
        } else item.button.hide()
      }
    } else this.toolbar.show_all()

    this.toolbar.check_resize()
  }
}
