import gi from "node-gtk"

export const Gtk = gi.require("Gtk", "3.0")
export const Gdk = gi.require("Gdk", "3.0")
export const GdkPixbuf = gi.require("GdkPixbuf", "2.0")
gi.require("GdkX11", "3.0") // Needed to Gdk to work

export const Wnck = gi.require("Wnck", "3.0")
Wnck.setClientType(Wnck.ClientType.PAGER)
Wnck.setDefaultIconSize(128)

gi.startLoop()
Gtk.init()
Gdk.init([])
