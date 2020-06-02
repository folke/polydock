import { DockItem } from "./dockitem"
import * as config from "./config"

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
    this.screen.force_update()
    this.update()
    screen.connect("viewports-changed", () => this.update())
    screen.connect("active-workspace-changed", () => this.update())
    screen.connect("active-window-changed", () => this.update())
    screen.connect("window-opened", () => this.update())
    screen.connect("window-closed", () => this.update())
  }

  update() {
    const keep = new Set<number>()
    let windows = this.screen.get_windows()
    if (!windows) return
    if (config.settings.activeWorkspaceOnly) {
      const activeWorkspace = this.screen.get_active_workspace()
      windows = windows.filter((w) => w.is_on_workspace(activeWorkspace))
    }
    let changes = 0
    if (windows) {
      windows.forEach((window) => {
        const xid = window.get_xid()
        keep.add(xid)
        if (!this.items.has(xid)) {
          window.connect("geometry-changed", () => this.autoHide())
          changes++
          console.log(`+ ${window.get_class_instance_name()}`)
          const item = new DockItem(window, this.horizontal)
          this.toolbar.add(item.button)
          this.items.set(xid, item)
        }
      })

      const activeXid = this.screen.get_active_window()?.get_xid()

      for (const [xid, item] of this.items.entries()) {
        if (!keep.has(xid)) {
          changes++
          console.log(`- ${item.window.get_class_instance_name()}`)
          this.items.delete(xid)
          this.toolbar.remove(item.button)
        } else {
          item.setClass("active-window", item.window.get_xid() == activeXid)
          item.setClass("hidden", item.isHidden())
        }
      }
    }

    if (changes) {
      this.toolbar.show_all()
      const [, naturalSize] = this.toolbar.get_preferred_size()
      if (naturalSize) {
        this.toolbar.get_window()?.resize(naturalSize.width, naturalSize.height)
      }
      console.log("------")
      // console.log()
    }
    this.autoHide()
  }

  autoHide() {
    const active = this.screen.get_active_window()
    const window = this.toolbar.get_window()
    if (active && window) {
      const [ax1, ay1, aw, ah] = active.get_geometry()
      const [bx1, by1, bw, bh] = window.get_geometry()

      let show = false
      // No geometry
      if (bw === null || bh === null || bx1 === null || by1 === null)
        show = true
      // no horizontal overlap
      else if (ax1 >= bx1 + bw || bx1 >= ax1 + aw) show = true
      // no vertical overlap
      else if (ay1 >= by1 + bh || by1 >= ay1 + ah) show = true

      if (show && !window.is_visible()) {
        console.log("[no-overlap] showing dock")
        window.show()
      }

      if (!show && window.is_visible()) {
        console.log(
          `[overlap] overlapping with  ${active.get_class_instance_name()}. Hiding dock`
        )
        window.hide()
      }
    }
    return true
  }
}
