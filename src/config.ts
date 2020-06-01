export type Settings = {
  position: "top" | "bottom" | "left" | "right"
  alignment: "start" | "center" | "end"
  offset?: [number, number]
}

const defaults: Settings = {
  position: "top",
  alignment: "start",
  offset: [400, 0],
}

export class Config {
  settings: Settings

  constructor() {
    this.settings = { ...defaults }
  }
}

export default new Config()
