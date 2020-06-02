import config from "./config"
import { DockItem } from "./dock-item"
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

  update() {
    // this.screen.force_update()
    const windows = this.screen.get_windows()
    if (!windows) return log("No Windows!")

    // Remove closed windows
    const xids = new Set<number>(windows.map((x) => x.get_xid()))
    for (const [xid, item] of this.items.entries()) {
      if (!xids.has(xid)) {
        log(`- ${item.name}`)
        this.items.delete(xid)
        this.toolbar.remove(item.button)
      }
    }

    // Add opened windows
    windows.forEach((window) => {
      const xid = window.get_xid()
      if (!this.items.has(xid)) {
        window.connect("geometry-changed", () => this.toolbar.check_resize())
        window.connect("workspace-changed", () => this.update())
        log(`+ ${window.get_class_instance_name()}`)
        const item = new DockItem(this.screen, xid, this.horizontal)
        this.toolbar.add(item.button)
        this.items.set(xid, item)
      }
    })

    // Update window state
    const workspace = this.screen.get_active_workspace()
    const groups = new Map<string, DockItem>()
    for (const item of this.items.values()) {
      const groupKey = item.getGroupKey()
      let visible = true
      if (
        config.settings.behaviour.activeWorkspaceOnly &&
        !item.window.is_on_workspace(workspace)
      )
        visible = false
      if (!config.settings.behaviour.showHidden && item.isHidden())
        visible = false
      if (!config.settings.behaviour.showVisible && !item.isHidden())
        visible = false

      if (groupKey && groups.has(groupKey)) {
        visible = false
        groups.get(groupKey)?.addTooltipInfo(item.window)
      }

      if (visible && groupKey && !groups.has(groupKey)) {
        groups.set(groupKey, item)
        item.addTooltipInfo(item.window, true)
      }

      if (visible) item.button.show_all()
      else item.button.hide()
    }

    this.toolbar.check_resize()
  }
}
