import * as Gtk from "./types/Gtk-3.0"
import * as Wnck from "./types/Wnck-3.0"
import * as GdkPixbuf from "./types/GdkPixbuf-2.0"
import * as GLib from "./types/GLib-2.0"

import config, { WindowGrouping } from "./config"

export class DockItem {
  button = new Gtk.ToolButton()
  name: string
  tooltip = ""

  constructor(public window: Wnck.Window, public horizontal: boolean) {
    this.name = this.window.get_class_instance_name()
    this.update()

    this.window.connect("icon-changed", () => {
      this.updateIcon()
      this.button.get_icon_widget()?.show_all()
    })

    this.window.connect("state-changed", (_window, _changes, _newState) => {
      this.setClass("hidden", this.isHidden())
    })

    this.button.connect("clicked", () => this.activate())
  }

  getGroupWindows() {
    const group = this.getGroupKey()
    return this.window
      .get_screen()
      .get_windows()
      .filter((x) => this.getGroupKey(x) == group)
  }

  activate() {
    const activeId = this.window.get_screen().get_active_window()?.get_xid()
    const group = this.getGroupWindows()

    // Cycle though existing windows, if active window is part of group
    for (let g = 0; g < group.length; g++) {
      if (group[g].get_xid() == activeId) {
        if (g === group.length - 1) {
          this._activate(group[0])
        } else this._activate(group[g + 1])
        return
      }
    }
    this._activate()
  }

  _activate(window = this.window) {
    const timestamp = new Date().getTime() / 1000
    if (this.isHidden(window)) {
      if (config.settings.behaviour.unhideCommand) {
        const unhide = config.settings.behaviour.unhideCommand.replace(
          "{window}",
          `${window.get_xid()}`
        )
        log(`[unhide] ${unhide}`)
        GLib.spawn_command_line_async(unhide)
      }
    }
    window.activate(timestamp)
  }

  isHidden(window = this.window) {
    return (
      window.is_minimized() ||
      (window.get_state() & Wnck.WindowState.HIDDEN) === Wnck.WindowState.HIDDEN
    )
  }

  updateIcon() {
    const iconTheme = Gtk.IconTheme.get_default()
    let iconName = this.window.get_class_instance_name() || "application"

    // Load custom icons from config
    for (const [iconK, iconV] of Object.entries(config.settings.icons)) {
      if (
        iconName.toLowerCase().includes(iconV.toLowerCase()) &&
        iconTheme.has_icon(iconK)
      ) {
        iconName = iconK
        break
      }
    }

    let icon: GdkPixbuf.Pixbuf | null = this.window.get_icon()

    if (iconTheme.has_icon(iconName)) {
      icon = iconTheme.load_icon(
        iconName,
        config.settings.appearance.iconSize,
        Gtk.IconLookupFlags.FORCE_SIZE
      )
    } else {
      icon = icon.copy()
      if (icon)
        icon = icon.scale_simple(
          config.settings.appearance.iconSize,
          config.settings.appearance.iconSize,
          GdkPixbuf.InterpType.BILINEAR
        )
    }
    this.button.set_icon_widget(Gtk.Image.new_from_pixbuf(icon))
  }

  update() {
    this.updateIcon()
    this.setClass("hidden", this.isHidden())
    this.addTooltipInfo(this.window, true)
  }

  addTooltipInfo(window: Wnck.Window, clear = false) {
    if (clear) this.tooltip = ""
    if (this.tooltip.length) this.tooltip += "\n\n"
    this.tooltip += `<b>${window
      .get_workspace()
      .get_name()}: ${window.get_class_group_name()}</b>\n${window.get_name()}`
    this.button.set_tooltip_markup(this.tooltip)
  }

  setActive(value = true) {
    if (value) this.addClass("active-window")
    else this.removeClass("active-window")
  }

  addClass(klass: string) {
    this.button.get_style_context().add_class(klass)
  }

  toggleClass(klass: string) {
    this.button.get_style_context().has_class(klass)
      ? this.removeClass(klass)
      : this.addClass(klass)
  }

  setClass(klass: string, yeasNo: boolean) {
    yeasNo ? this.addClass(klass) : this.removeClass(klass)
  }

  removeClass(klass: string) {
    this.button.get_style_context().remove_class(klass)
  }

  getGroupKeyValue(window: Wnck.Window, groupBy: WindowGrouping) {
    switch (groupBy) {
      case "class":
        return window.get_class_group_name()
      case "instance":
        return window.get_class_instance_name()
      case "title":
        return window.get_name()
      case "visibility":
        return `hidden:${this.isHidden(window)}`
    }
  }

  getGroupKey(window = this.window) {
    const groupBy = config.settings.behaviour.groupBy

    if (!groupBy.length) return false

    return groupBy.map((g) => this.getGroupKeyValue(window, g)).join(".")
  }
}
