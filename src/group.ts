/* eslint-disable unicorn/no-null */
import config, { DockAction, WindowGrouping } from "./config"
import Wnck from "./types/Wnck-3.0"
import { run } from "./util"

export class DockGroup {
  static getGroupKeyValue(window: Wnck.Window, groupBy: WindowGrouping) {
    switch (groupBy) {
      case "class":
        return window.get_class_group_name()
      case "instance":
        return window.get_class_instance_name()
      case "title":
        return window.get_name()
      case "visibility":
        return `hidden:${window.is_minimized()}`
    }
  }

  static getGroupKey(window: Wnck.Window) {
    const groupBy = config.settings.behavior.groupBy

    if (!groupBy.length) return false

    return groupBy.map((g) => this.getGroupKeyValue(window, g)).join(".")
  }

  static getGroupWindows(window: Wnck.Window) {
    const group = this.getGroupKey(window)
    return window
      .get_screen()
      .get_windows()
      .filter((x) => this.getGroupKey(x) == group)
  }

  static doAction(window: Wnck.Window, action: DockAction) {
    log(`[action] ${action}`)
    const timestamp = new Date().getTime() / 1000

    const activeId = window.get_screen().get_active_window()?.get_xid()

    if (action == "show") {
      if (window.is_minimized() && config.settings.commands.unhide)
        run(config.settings.commands.unhide, { window: window.get_xid() })
      window.activate(timestamp)
    } else if (action == "hide") {
      if (!window.is_minimized() && config.settings.commands.hide)
        run(config.settings.commands.hide, { window: window.get_xid() })
      window.minimize()
    } else if (action == "toggle") {
      if (window.get_xid() == activeId) this.doAction(window, "hide")
      else this.doAction(window, "show")
    } else if (action == "cycle") {
      const group = this.getGroupWindows(window)
      // Cycle though existing windows, if active window is part of group
      for (let g = 0; g < group.length; g++) {
        if (group[g].get_xid() == activeId) {
          if (g === group.length - 1) this.doAction(group[0], "show")
          else this.doAction(group[g + 1], "show")
          return
        }
      }
      this.doAction(window, "show")
    } else if (action == "toggle-cycle") {
      if (this.getGroupWindows(window).length > 1)
        this.doAction(window, "cycle")
      else this.doAction(window, "toggle")
    }
  }
}
