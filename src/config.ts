export type Settings = {
  position: "top" | "bottom" | "left" | "right"
  alignment: "start" | "center" | "end"
  offset: [number, number]
  iconSize: number
  activeWorkspaceOnly: boolean
  unhideCommand?: string
}

const defaults: Settings = {
  position: "top",
  alignment: "center",
  offset: [0, 0],
  iconSize: 40,
  activeWorkspaceOnly: false,
  unhideCommand: "bspc node {window} -g hidden=off -f",
}

export const settings = { ...defaults }
