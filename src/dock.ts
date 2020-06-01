import gi from "node-gtk"
import { DockItem } from "./dock-item"

const Gtk = gi.require("Gtk", "3.0")
const Wnck = gi.require("Wnck", "3.0")

Wnck.setClientType(Wnck.ClientType.PAGER)
Wnck.setDefaultIconSize(128)

export class Dock {
  items = new Map<number, DockItem>()
  toolbar = new Gtk.Toolbar()
  screen: Wnck.Screen
  active = 0

  constructor() {
    const screen = Wnck.Screen.getDefault()
    if (!screen) throw new Error("No screens detected!")
    this.screen = screen
    this.toolbar.setShowArrow(false)

    this.update()
    screen.on("active-window-changed", () => this.update())
    screen.on("window-opened", () => this.update())
    screen.on("window-closed", () => this.update())
  }

  update() {
    // this.screen.forceUpdate()
    const keep = new Set<number>()
    const windows = this.screen.getWindows()
    let changes = 0
    if (windows) {
      windows.forEach((window) => {
        const xid = window.getXid()
        keep.add(xid)
        if (!this.items.has(xid)) {
          changes++
          console.log(`+ ${window.getClassInstanceName()}`)
          const item = new DockItem(window)
          this.toolbar.add(item.button)
          this.items.set(xid, item)
        }
      })
      for (const [xid, item] of this.items.entries()) {
        if (!keep.has(xid)) {
          changes++
          console.log(`- ${item.window.getClassInstanceName()}`)
          this.items.delete(xid)
          this.toolbar.remove(item.button)
        }
      }
    }

    const activeXid = this.screen.getActiveWindow()?.getXid()
    if (activeXid !== this.active) {
      this.items.get(this.active)?.setActive(false)
      this.items.get(activeXid)?.setActive(true)
      this.active = activeXid
    }

    if (changes) {
      this.toolbar.showAll()
      const [, naturalSize] = this.toolbar.getPreferredSize()
      if (naturalSize) {
        this.toolbar.getWindow()?.resize(naturalSize.width, naturalSize.height)
      }
      console.log("------")
      console.log()
    }
  }
}
