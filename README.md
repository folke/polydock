# ✨ Polydock

**Polydock** is a fast and hackable application dock for your desktop.

## Why another dock

I recently started using [bspwm](https://github.com/baskerville/bspwm) as my main window manager. Since **bspwm** is a tiling wm, most navigation is done using the keyboard. The only thing I really missed was the ability to quickly glance at a list of open, hidden, and grouped windows.

[Polybar](https://github.com/polybar/polybar) is a beautiful status bar, but unfortunatly lacks the ability to show a window list. Since I couldn't find a good looking, customizable dock, I decided to build one myself, that can easily be styled to blend into any existing status bar. *(I'm also terrible coming up with great project names)*

## Features

* highly customizable (see [settings.ini](https://github.com/folke/polydock/blob/master/config/settings.ini))
* themeable with [Gtk+ CSS](https://developer.gnome.org/gtk3/stable/chap-css-overview.html) (see  [themes/default.css](https://github.com/folke/polydock/blob/master/config/themes/default.ini))
* window grouping by window class, instance, title, visibility or any combination of the above
* limit the dock to windows on the current workspace or all workspaces
* show only visible windows, hidden windows, or both
* updates icon when it changes in the application (great for google chrome web application windows)
* rules to define custom icons
* clicking on a group cycles throuhg the windows in that group
* right click to get a popup with all open windows in that group

## Installation

Make sure you have the following libraries on your system:

* `gtk3`
* `libwnck3`
* `gdk-pixbuf2`

Grab the [latest release](https://github.com/folke/polydock/releases) and unzip it somehwere on your system.

You can start using `polydock` right away from the bin folder:

```shell
$ bin/polydock
```

or, copy the binary and config files to your local directories.

For example:

```shell
$ cp bin/polydock ~/.local/bin

$ cp -rv config ~/.config/polydock
```

## Usage

## Building from source

**Polydock** is written in Typescript and needs some nodejs packages to transform the source into code that works with [GJS](https://gitlab.gnome.org/GNOME/gjs/-/blob/master/doc/Home.md)

Installing and building has been tested with the package manager **pnpm**, but should also work with **npm** or **yarn**

```shell
$ cd polydock

# Install dependencies
$ pnpm i

# Build bundle
$ pnpm run build
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[Apache 2.0](https://github.com/folke/polydock/blob/master/LICENSE)

<!-- markdownlint-disable-file MD014 -->
