import * as GLib from "./types/GLib-2.0"

/**
 * https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
 * https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
 */
export const setInterval = (func: () => unknown, delay: number) => {
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
    func()
    return GLib.SOURCE_CONTINUE
  })
}

export const clearInterval = GLib.source_remove

/**
 * https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 * https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout
 */
export const setTimeout = (func: () => unknown, delay: number) => {
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
    func()
    return GLib.SOURCE_REMOVE
  })
}

export const clearTimeout = GLib.source_remove

export function fileExists(file: string) {
  return (
    GLib.file_test(file, GLib.FileTest.EXISTS) &&
    !GLib.file_test(file, GLib.FileTest.IS_DIR)
  )
}

export function resolve(path: string) {
  let parts: string[] = []
  for (const p of path.split("/")) {
    if (p === ".") {
      if (parts.length) continue
      parts = GLib.get_current_dir().split("/")
    } else if (p == "..") parts.pop()
    else if (p == "~") {
      parts = GLib.get_home_dir().split("/")
    } else parts.push(p)
  }
  return parts.join("/")
}
