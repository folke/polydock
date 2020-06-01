import gi from "node-gtk"
import { execSync } from "child_process"

const Gtk = gi.require("Gtk", "3.0")
const Wnck = gi.require("Wnck", "3.0")
const GdkPixbuf = gi.require("GdkPixbuf", "2.0")

export class DockItem {
  button = new Gtk.ToolButton()

  constructor(public window: Wnck.Window) {
    this.update()
    this.window.on("icon-changed", () => {
      this.updateIcon()
      this.button.showAll()
    })
    this.button.on("clicked", () => {
      const timestamp = new Date().getTime()
      if (
        (this.window.getState() & Wnck.WindowState.HIDDEN) ===
        Wnck.WindowState.HIDDEN
      ) {
        console.log("HIDDEN")
        execSync(`bspc node ${this.window.getXid()} -g hidden=off -f`)
      }
      this.window.activate(timestamp)
    })
  }

  updateIcon() {
    const iconTheme = Gtk.IconTheme.getDefault()
    const iconSize = 40
    let iconName = this.window.getClassInstanceName()

    // console.log(
    //   iconTheme
    //     .listIcons("Applications")
    //     .filter((x) => x.toLowerCase().includes("google"))
    // )

    if (iconName.startsWith("calendar.google.com")) iconName = "google-agenda"
    if (iconName.startsWith("mail.google.com")) iconName = "gmail"
    if (iconName.startsWith("keep.google.com")) iconName = "keep"

    let icon: GdkPixbuf.Pixbuf | null = this.window.getIcon()

    if (iconTheme.hasIcon(iconName)) {
      icon = iconTheme.loadIcon(
        iconName,
        iconSize,
        Gtk.IconLookupFlags.FORCE_SIZE
      )
    } else {
      icon = this.window
        .getIcon()
        .scaleSimple(iconSize, iconSize, GdkPixbuf.InterpType.BILINEAR)
    }
    this.button.setIconWidget(Gtk.Image.newFromPixbuf(icon))
    console.log(this.button.getIconSize())
  }

  update() {
    this.updateIcon()
    this.button.setTooltipText(this.window.getName())
  }

  setActive(value = true) {
    if (value) this.addClass("active-window")
    else this.removeClass("active-window")
  }

  addClass(klass: string) {
    this.button.getStyleContext().addClass(klass)
  }

  toggleClass(klass: string) {
    this.button.getStyleContext().hasClass(klass)
      ? this.removeClass(klass)
      : this.addClass(klass)
  }

  removeClass(klass: string) {
    this.button.getStyleContext().removeClass(klass)
  }
}
