/* eslint-disable @typescript-eslint/ban-ts-comment */
import GLib from "./types/GLib-2.0"
import { fileExists, resolve, realpath } from "./util"

export type WindowGrouping = "class" | "instance" | "title" | "visibility"

const defaults = {
  appearance: {
    position: "top" as "top" | "bottom" | "left" | "right",
    alignment: "center" as "start" | "center" | "end",
    offsetX: 0,
    offsetY: 0,
    iconSize: 40,
    theme: "default",
    iconTheme: "default",
  },
  behavior: {
    groupBy: ["instance", "visibility"] as WindowGrouping[],
    activeWorkspaceOnly: false,
    showHidden: true,
    showVisible: true,
  },
  commands: {
    hide: "bspc node {window} -g hidden=on -f",
    unhide: "bspc node {window} -g hidden=off -f",
  },
  icons: {
    "google-agenda": "calendar.google.com",
    gmail: "mail.google.com",
    keep: "keep.google.com",
    messengerfordesktop: "www.messenger.com",
    whatsapp: "whatsapp",
  } as Record<string, string>,
}

export type Settings = typeof defaults

class Config {
  path: string
  settings: Settings
  theme: string
  file?: string
  verbose = true
  themePath: string[] = []

  constructor() {
    this.settings = { ...defaults }
    this.path = GLib.path_get_dirname(
      realpath(imports.system.programInvocationName)
    )
    this.path = resolve(GLib.path_get_dirname(this.path))
    this.themePath.push(`${this.path}/config/themes`)
    this.theme = resolve(`${this.path}/config/themes/default.css`)
  }

  update() {
    this.load(`${GLib.get_user_config_dir()}/polydock/settings.ini`) ||
      this.load(`${this.path}/config/settings.ini`)
    if (this.file)
      this.themePath.unshift(
        resolve(`${GLib.path_get_dirname(this.file)}/themes`)
      )

    for (const p of this.themePath) {
      this.theme = resolve(
        `${p}/${this.settings.appearance.theme || "default"}.css`
      )
      if (fileExists(this.theme)) break
    }

    if (!fileExists(this.theme)) {
      log(`Theme file not found! ${this.theme}`)
      imports.system.exit(1)
    }
    this.verbose && log(`[theme] ${this.theme}`)
  }

  load(file: string): boolean {
    file = resolve(file)
    if (!fileExists(file)) return false
    this.verbose && log(`[settings] ${file}`)
    this.file = file
    const ini = GLib.KeyFile.new()
    ini.load_from_file(file, GLib.KeyFileFlags.KEEP_COMMENTS)
    for (const [group, items] of Object.entries(this.settings)) {
      if (!ini.has_group(group)) continue
      let entries = Object.entries(items)
      if (group == "icons")
        entries = (ini.get_keys("icons")?.[0] || []).map((x) => [x, ""])
      const [haveKeys] = ini.get_keys(group)
      for (const [key, value] of entries) {
        if (!haveKeys || !haveKeys.includes(key)) continue

        const data = ini.get_value(group, key)
        if (data) {
          if (Array.isArray(value)) {
            // @ts-ignore
            this.settings[group][key] = ini.get_string_list(group, key)
          } else if (typeof value == "boolean")
            // @ts-ignore
            this.settings[group][key] = ini.get_boolean(group, key)
          else if (typeof value == "number")
            // @ts-ignore
            this.settings[group][key] = ini.get_integer(group, key)
          // @ts-ignore
          else this.settings[group][key] = ini.get_string(group, key)
        }
      }
    }
    return true
  }

  dump() {
    const ini = GLib.KeyFile.new()
    for (const [group, items] of Object.entries(this.settings)) {
      for (const [key, value] of Object.entries(items)) {
        if (Array.isArray(value)) ini.set_string_list(group, key, value)
        else ini.set_string(group, key, `${value}`)
      }
    }

    ini.set_comment(
      "appearance",
      "offsetX",
      "Additional offsets to further fine-tune the position of the dock"
    )
    ini.set_comment("appearance", "position", "One of top, bottom, left, right")
    ini.set_comment("appearance", "alignment", "One of start, center, end")
    // ini.set_string("appearance", "theme", this.theme)
    ini.set_comment(
      "appearance",
      "theme",
      `Full path to a css file, or 'default'.\nSee config/themes/default.css`
    )
    ini.set_comment(
      "appearance",
      "iconTheme",
      `An gtk icon theme name, or 'default'`
    )
    ini.set_comment(
      "behavior",
      "groupBy",
      "Specify a list of keys to group windows on: class;instance;title;visibility"
    )
    ini.set_comment(
      "icons",
      // eslint-disable-next-line unicorn/no-null
      null,
      `Rules for custom icons matching the class::instance of windows
icon-name=string to be part of class::instance`
    )
    return ini.to_data()[0]
  }
}

export default new Config()
