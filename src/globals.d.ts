import * as GObject from "./types/GObject-2.0"

declare global {
  const ARGV: string[]
  const imports: {
    system: {
      gc: () => void
      exit: (exitCode) => void
      refcount: (obj: GObject.Object) => number
      programInvocationName: string
    }
  }
}

export { imports }
