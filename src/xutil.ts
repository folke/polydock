import Gdk from "./types/Gdk-3.0"
import GdkX11 from "./types/GdkX11-3.0"

export enum XPropType {
  "STRING",
  "UTF8_STRING",
  "CARDINAL",
  "ATOM",
}

export function getXProp(xid: number, prop: string, type: XPropType) {
  const window: Gdk.Window = GdkX11.X11Window.foreign_new_for_display(
    Gdk.Display.get_default() as GdkX11.X11Display,
    xid
  )
  if (window) {
    const [found, _actualType, _actualFormat, data] = Gdk.property_get(
      window,
      Gdk.atom_intern(prop, false),
      Gdk.Atom.intern(XPropType[type], false),
      0,
      2048,
      0
    )

    if (found) return imports.byteArray.toString(data) as string
  }
}
