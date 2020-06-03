import { App } from "./app"

import Gtk from "./types/Gtk-3.0"
import Wnck from "./types/Wnck-3.0"

log(imports.system.programInvocationName)
Wnck.set_client_type(Wnck.ClientType.PAGER)
Wnck.set_default_icon_size(128)

log("Loading Gtk")
// eslint-disable-next-line unicorn/no-null
Gtk.init(null)

log("Starting App")
new App()
Gtk.main()
