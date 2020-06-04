/* eslint-disable unicorn/no-null */
import { AppWindow } from "./app-window"
import config from "./config"

import Gtk from "./types/Gtk-3.0"
import Gio from "./types/Gio-2.0"
import GObject from "./types/GObject-2.0"
import GLib from "./types/GLib-2.0"

export let PolydockApp = class extends Gtk.Application {
  window?: AppWindow

  _init() {
    const props: Gtk.Application_ConstructProps = {
      application_id: "org.polydock",
      flags: Gio.ApplicationFlags.FLAGS_NONE,
    }
    super._init(props)
    super.add_main_option(
      "version",
      0,
      GLib.OptionFlags.NONE,
      GLib.OptionArg.NONE,
      "Show polydock version",
      null
    )
    super.add_main_option(
      "dump-config",
      0,
      GLib.OptionFlags.NONE,
      GLib.OptionArg.NONE,
      "Show the loaded configuration. Useful to create your own config.",
      null
    )
    GLib.set_application_name("Polydock")
    GLib.set_prgname("polydock")
  }

  vfunc_handle_local_options(options: GLib.VariantDict) {
    if (options.contains("version")) {
      print("__version__")
    } else if (options.contains("dump-config")) {
      config.update()
      print(config.dump())
    } else return -1
    return 0
  }

  vfunc_startup() {
    log("[app] startup")
    super.vfunc_startup?.()
  }

  vfunc_activate() {
    log("[app] activate")
    if (!this.window) {
      config.update()
      this.window = new AppWindow(this)
    }
    this.window.window.present()
    super.vfunc_activate?.()
  }
}

PolydockApp = GObject.registerClass(
  {
    GTypeName: "PolydockApp",
    CssName: "polydock",
  },
  PolydockApp
) as typeof PolydockApp
