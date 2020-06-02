import * as Gtk from "./types/Gtk-3.0"
import * as Wnck from "./types/Wnck-3.0"
import * as GdkPixbuf from "./types/GdkPixbuf-2.0"
import * as GLib from "./types/GLib-2.0"

import config from "./config"

export class DockItem {
  button = new Gtk.ToolButton()
  name: string

  constructor(public window: Wnck.Window, public horizontal: boolean) {
    this.name = window.get_class_instance_name()
    this.update()

    this.window.connect("icon-changed", () => {
      this.updateIcon()
      this.button.show_all()
    })

    this.window.connect("state-changed", (_window, _changes, _newState) => {
      this.setClass("hidden", this.isHidden())
    })

    this.button.connect("clicked", () => {
      const timestamp = new Date().getTime() / 1000
      if (this.isHidden()) {
        if (config.settings.behaviour.unhideCommand) {
          const unhide = config.settings.behaviour.unhideCommand.replace(
            "{window}",
            `${this.window.get_xid()}`
          )
          log(`[unhide] ${unhide}`)
          GLib.spawn_command_line_async(unhide)
        }
      }
      this.window.activate(timestamp)
    })
  }

  isHidden() {
    return (
      this.window.is_minimized() ||
      (this.window.get_state() & Wnck.WindowState.HIDDEN) ===
        Wnck.WindowState.HIDDEN
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
      icon = this.window
        .get_icon()
        .scale_simple(
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
    const tooltip = `<b>${this.window
      .get_workspace()
      .get_name()}: ${this.window.get_class_group_name()}</b>\n${this.window.get_name()}`
    this.button.set_tooltip_markup(tooltip)
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
}
