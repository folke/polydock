/* eslint-disable unicorn/no-null */
import config, { WindowGrouping } from "./config"
import Gdk from "./types/Gdk-3.0"
import GdkPixbuf from "./types/GdkPixbuf-2.0"
import Gtk from "./types/Gtk-3.0"
import Wnck from "./types/Wnck-3.0"
import { run } from "./util"
import { getXProp, XPropType } from "./xutil"

export class DockItem {
  name: string
  button = new Gtk.ToolItem()
  iconWidget = new Gtk.Image()
  menu = new Gtk.Menu()

  constructor(public window: Wnck.Window, public horizontal: boolean) {
    this.name = this.window.get_class_instance_name()

    this.setClass("dock-item")

    const eventBox = new Gtk.EventBox()
    eventBox.add(this.iconWidget)
    eventBox.set_events(
      Gdk.EventMask.BUTTON_PRESS_MASK & Gdk.EventMask.ENTER_NOTIFY_MASK
    )
    this.button.add(eventBox)
    this.update()

    this.window.connect("icon-changed", () => {
      this.updateIcon()
      this.iconWidget.show_all()
    })

    this.window.connect("state-changed", (_window, _changes, _newState) => {
      this.setClass("hidden", this.isHidden())
    })

    // Add hover states
    eventBox.connect("enter-notify-event", () => {
      this.iconWidget.set_state_flags(Gtk.StateFlags.PRELIGHT, false)
    })
    eventBox.connect("leave-notify-event", () => {
      this.iconWidget.unset_state_flags(Gtk.StateFlags.PRELIGHT)
    })

    this.menu.attach_to_widget(this.button, null)
    eventBox.connect("button-press-event", (_button, event: Gdk.Event) => {
      if (event.get_event_type() == Gdk.EventType.BUTTON_PRESS) {
        if (event.get_button()?.[1] == 3) {
          this.popup()
        } else if (event.get_button()?.[1] == 1) {
          this.cycle()
        }
      }
    })
  }

  popup() {
    this.menu.show_all()
    this.menu.popup_at_widget(
      this.button,
      Gdk.Gravity.SOUTH,
      Gdk.Gravity.NORTH,
      null
    )
  }

  getGroupWindows() {
    const group = this.getGroupKey()
    return this.window
      .get_screen()
      .get_windows()
      .filter((x) => this.getGroupKey(x) == group)
  }

  cycle() {
    const activeId = this.window.get_screen().get_active_window()?.get_xid()
    const group = this.getGroupWindows()

    if (group.length > 1) {
      // Cycle though existing windows, if active window is part of group
      for (let g = 0; g < group.length; g++) {
        if (group[g].get_xid() == activeId) {
          if (g === group.length - 1) {
            this.activate(group[0])
          } else this.activate(group[g + 1])
          return
        }
      }
    }
    this.activate(this.window, true)
  }

  activate(window: Wnck.Window, toggle = false) {
    log(`activate: ${toggle}`)
    const timestamp = new Date().getTime() / 1000

    // Unhide the window if it's minimized / hidden
    if (this.isHidden(window)) {
      if (config.settings.commands.unhide) {
        log(run(config.settings.commands.unhide, { window: window.get_xid() }))
      }
      window.activate(timestamp)
    }
    // Toggle it if it's the only one in the group and if it's the active window
    else if (
      toggle &&
      window.get_screen().get_active_window()?.get_xid() == window.get_xid()
    ) {
      log("minimizing")
      window.minimize()
      if (config.settings.commands.hide) {
        log(run(config.settings.commands.hide, { window: window.get_xid() }))
      }
    }
    // Else, just show it
    else window.activate(timestamp)
  }

  isHidden(window = this.window) {
    return (
      window.is_minimized() ||
      (window.get_state() & Wnck.WindowState.HIDDEN) === Wnck.WindowState.HIDDEN
    )
  }

  updateIcon() {
    let iconTheme = Gtk.IconTheme.get_default()
    if (
      config.settings.appearance.iconTheme &&
      config.settings.appearance.iconTheme !== "default"
    ) {
      iconTheme = new Gtk.IconTheme()
      iconTheme.set_custom_theme(config.settings.appearance.iconTheme)
    }

    const cleanup = (iconName: string) => {
      if (iconName) {
        return iconName.replace(/\s+/gu, "").toLowerCase()
      }
    }

    const lookup: (string | undefined)[] = []

    const groupIcon = cleanup(this.window.get_class_group_name())
    const instanceIcon = cleanup(this.window.get_class_instance_name())

    lookup.push(
      getXProp(
        this.window.get_xid(),
        "_GTK_APPLICATION_ID",
        XPropType.UTF8_STRING
      ),
      instanceIcon
    )

    const noGroupIcons = ["brave-browser", "chromium-browser", "chrome-browser"]
    if (groupIcon && !noGroupIcons.includes(groupIcon)) {
      lookup.push(groupIcon)
    }

    // // Load custom icons from config
    for (const [iconK, iconV] of Object.entries(config.settings.icons)) {
      if (
        iconTheme.has_icon(iconK) &&
        lookup.some((x) => `${x}`.includes(iconV.toLowerCase()))
      ) {
        lookup.unshift(iconK)
      }
    }

    let icon: GdkPixbuf.Pixbuf | null = this.window.get_icon()

    const iconNames = lookup.filter((x) => x) as string[]

    const iconInfo = iconTheme.choose_icon(
      iconNames,
      config.settings.appearance.iconSize,
      Gtk.IconLookupFlags.FORCE_SIZE
    )

    if (iconInfo) {
      log(`[icon] ${iconInfo.get_filename()}`)
      icon = iconInfo.load_icon()
    } else {
      icon = icon.copy()
      if (icon)
        icon = icon.scale_simple(
          config.settings.appearance.iconSize,
          config.settings.appearance.iconSize,
          GdkPixbuf.InterpType.BILINEAR
        )
    }
    this.iconWidget.set_from_pixbuf(icon)
    this.iconWidget.show()
  }

  update() {
    this.updateIcon()
    this.setClass("hidden", this.isHidden())
    this.addMenuItem(this, true)
  }

  addMenuItem(item: DockItem, clear = false) {
    let label = `${
      item.window.get_workspace()?.get_name() ?? "?"
    }: ${item.window.get_name()}`
    if (label.length > 60) label = `${label.slice(0, 60)}...`

    if (clear) {
      this.menu.get_children().forEach((c) => this.menu.remove(c))
    }
    const menuItem = Gtk.ImageMenuItem.new_with_label(label)
    menuItem.set_always_show_image(true)
    menuItem.set_image(
      Gtk.Image.new_from_pixbuf(
        item.iconWidget
          .get_pixbuf()
          ?.copy()
          ?.scale_simple(24, 24, GdkPixbuf.InterpType.BILINEAR)
      )
    )
    menuItem.connect("activate", () => {
      item.activate(item.window, true)
    })
    this.menu.append(menuItem)

    this.iconWidget.set_tooltip_text(label)
  }

  setActive(value = true) {
    if (value) this.addClass("active")
    else this.removeClass("active")
  }

  addClass(klass: string) {
    this.iconWidget.get_style_context().add_class(klass)
  }

  toggleClass(klass: string) {
    this.iconWidget.get_style_context().has_class(klass)
      ? this.removeClass(klass)
      : this.addClass(klass)
  }

  setClass(klass: string, yeasNo = true) {
    yeasNo ? this.addClass(klass) : this.removeClass(klass)
  }

  removeClass(klass: string) {
    this.iconWidget.get_style_context().remove_class(klass)
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
    const groupBy = config.settings.behavior.groupBy

    if (!groupBy.length) return false

    return groupBy.map((g) => this.getGroupKeyValue(window, g)).join(".")
  }
}
