/* eslint-disable unicorn/no-null */
import config from "./config"
import { DockGroup } from "./group"
import Gdk from "./types/Gdk-3.0"
import GdkPixbuf from "./types/GdkPixbuf-2.0"
import Gtk from "./types/Gtk-3.0"
import Wnck from "./types/Wnck-3.0"
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
      this.setClass("hidden", this.window.is_minimized())
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
          DockGroup.doAction(this.window, config.settings.behavior.click)
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
    this.setClass("hidden", this.window.is_minimized())
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
      DockGroup.doAction(item.window, config.settings.behavior["menu-click"])
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
}
