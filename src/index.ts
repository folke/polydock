imports.gi.versions.Gtk = "3.0"
imports.gi.versions.Wnck = "3.0"
imports.gi.versions.GdkX11 = "3.0"

import { App } from "./app"

import * as Gtk from "./types/Gtk-3.0"
import * as Wnck from "./types/Wnck-3.0"

Wnck.set_client_type(Wnck.ClientType.PAGER)
Wnck.set_default_icon_size(128)

console.log("Loading Gtk")
// eslint-disable-next-line unicorn/no-null
Gtk.init(null)

console.log("Starting App")
new App()
