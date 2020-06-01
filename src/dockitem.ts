// import { execSync } from "child_process"

import * as Gtk from "./types/Gtk-3.0"
import * as Wnck from "./types/Wnck-3.0"
import * as GdkPixbuf from "./types/GdkPixbuf-2.0"
import * as GLib from "./types/GLib-2.0"

import * as config from "./config"

export class DockItem {
  button = new Gtk.ToolButton()
  popover = new Gtk.Popover()

  constructor(public window: Wnck.Window, public horizontal: boolean) {
    this.update()
    this.window.connect("icon-changed", () => {
      this.updateIcon()
      this.button.show_all()
    })
    this.button.connect("clicked", () => {
      this.showPopup()
      const timestamp = new Date().getTime() / 1000
      if (this.isHidden()) {
        if (config.settings.unhideCommand) {
          const unhide = config.settings.unhideCommand.replace(
            "{window}",
            `${this.window.get_xid()}`
          )
          console.log(`[unhide] ${unhide}`)
          GLib.spawn_command_line_async(unhide)
        }
      }
      this.window.activate(timestamp)
    })

    const box = new Gtk.Box()
    box.set_orientation(
      !horizontal ? Gtk.Orientation.HORIZONTAL : Gtk.Orientation.VERTICAL
    )
    box.pack_start(new Gtk.ModelButton({ label: "foo" }), true, false, 10)
    box.pack_start(new Gtk.Label({ label: "bar" }), true, false, 10)
    box.pack_start(new Gtk.Label({ label: "bar" }), true, false, 10)
    box.pack_start(new Gtk.Label({ label: "bar" }), true, false, 10)
    box.pack_start(new Gtk.Label({ label: "bar" }), true, false, 10)
    box.pack_start(new Gtk.Label({ label: "bar" }), true, false, 10)
    this.popover.add(box)
    this.popover.set_position(Gtk.PositionType.BOTTOM)
  }

  showPopup() {
    this.popover.set_relative_to(this.button)
    this.popover.show_all()
    this.popover.popup()
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

    // console.log(
    //   iconTheme
    //     .listIcons("Applications")
    //     .filter((x) => x.toLowerCase().includes("google"))
    // )

    if (iconName.startsWith("calendar.google.com")) iconName = "google-agenda"
    if (iconName.startsWith("mail.google.com")) iconName = "gmail"
    if (iconName.startsWith("keep.google.com")) iconName = "keep"

    let icon: GdkPixbuf.Pixbuf | null = this.window.get_icon()

    if (iconTheme.has_icon(iconName)) {
      icon = iconTheme.load_icon(
        iconName,
        config.settings.iconSize,
        Gtk.IconLookupFlags.FORCE_SIZE
      )
    } else {
      icon = this.window
        .get_icon()
        .scale_simple(
          config.settings.iconSize,
          config.settings.iconSize,
          GdkPixbuf.InterpType.BILINEAR
        )
    }
    this.button.set_icon_widget(Gtk.Image.new_from_pixbuf(icon))
  }

  update() {
    this.updateIcon()
    this.button.set_tooltip_text(this.window.get_name())
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
