import * as Gjs from "./Gjs";
import * as Atk10 from "./Atk-1.0";
import * as Atspi20 from "./Atspi-2.0";
import * as DBus10 from "./DBus-1.0";
import * as DBusGLib10 from "./DBusGLib-1.0";
import * as GIRepository20 from "./GIRepository-2.0";
import * as GL10 from "./GL-1.0";
import * as GLib20 from "./GLib-2.0";
import * as GModule20 from "./GModule-2.0";
import * as GObject20 from "./GObject-2.0";
import * as Gdk30 from "./Gdk-3.0";
import * as GdkPixbuf20 from "./GdkPixbuf-2.0";
import * as GdkPixdata20 from "./GdkPixdata-2.0";
import * as GdkX1130 from "./GdkX11-3.0";
import * as Gio20 from "./Gio-2.0";
import * as Gtk30 from "./Gtk-3.0";
import * as HarfBuzz00 from "./HarfBuzz-0.0";
import * as ICal30 from "./ICal-3.0";
import * as ICalGLib30 from "./ICalGLib-3.0";
import * as Notify07 from "./Notify-0.7";
import * as Pango10 from "./Pango-1.0";
import * as PangoCairo10 from "./PangoCairo-1.0";
import * as PangoFT210 from "./PangoFT2-1.0";
import * as PangoFc10 from "./PangoFc-1.0";
import * as PangoOT10 from "./PangoOT-1.0";
import * as PangoXft10 from "./PangoXft-1.0";
import * as Vulkan10 from "./Vulkan-1.0";
import * as Wnck30 from "./Wnck-3.0";
import * as Xfconf0 from "./Xfconf-0";
import * as Cairo10 from "./cairo-1.0";
import * as Fontconfig20 from "./fontconfig-2.0";
import * as Freetype220 from "./freetype2-2.0";
import * as Libxfce4ui20 from "./libxfce4ui-2.0";
import * as Libxfce4util10 from "./libxfce4util-1.0";
import * as Libxml220 from "./libxml2-2.0";
import * as Win3210 from "./win32-1.0";
import * as Xfixes40 from "./xfixes-4.0";
import * as Xft20 from "./xft-2.0";
import * as Xlib20 from "./xlib-2.0";
import * as Xrandr13 from "./xrandr-1.3";


declare global {
    function print(...args: any[]): void;
    function printerr(...args: any[]): void
    function log(message?: string): void
    function logError(exception: any, message?: string): void
    const ARGV: string[]
    const imports: typeof Gjs & {
        [key: string]: any
        gi: {
                    Atk: typeof Atk10;
                    Atspi: typeof Atspi20;
                    DBus: typeof DBus10;
                    DBusGLib: typeof DBusGLib10;
                    GIRepository: typeof GIRepository20;
                    GL: typeof GL10;
                    GLib: typeof GLib20;
                    GModule: typeof GModule20;
                    GObject: typeof GObject20;
                    Gdk: typeof Gdk30;
                    GdkPixbuf: typeof GdkPixbuf20;
                    GdkPixdata: typeof GdkPixdata20;
                    GdkX11: typeof GdkX1130;
                    Gio: typeof Gio20;
                    Gtk: typeof Gtk30;
                    HarfBuzz: typeof HarfBuzz00;
                    ICal: typeof ICal30;
                    ICalGLib: typeof ICalGLib30;
                    Notify: typeof Notify07;
                    Pango: typeof Pango10;
                    PangoCairo: typeof PangoCairo10;
                    PangoFT2: typeof PangoFT210;
                    PangoFc: typeof PangoFc10;
                    PangoOT: typeof PangoOT10;
                    PangoXft: typeof PangoXft10;
                    Vulkan: typeof Vulkan10;
                    Wnck: typeof Wnck30;
                    Xfconf: typeof Xfconf0;
                    cairo: typeof Cairo10;
                    fontconfig: typeof Fontconfig20;
                    freetype2: typeof Freetype220;
                    libxfce4ui: typeof Libxfce4ui20;
                    libxfce4util: typeof Libxfce4util10;
                    libxml2: typeof Libxml220;
                    win32: typeof Win3210;
                    xfixes: typeof Xfixes40;
                    xft: typeof Xft20;
                    xlib: typeof Xlib20;
                    xrandr: typeof Xrandr13;
                  }
        searchPath: string[];
    }
}

export { imports }
