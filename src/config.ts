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
  alignment: "start",
  offset: [400, 0],
  iconSize: 40,
  activeWorkspaceOnly: true,
  unhideCommand: "bspc node {window} -g hidden=off -f",
}

export const settings = { ...defaults }
