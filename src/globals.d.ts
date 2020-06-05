import { Object } from "./types/GObject-2.0"
import { byteArray } from "./types/Gjs"

declare global {
  const ARGV: string[]
  const imports: {
    byteArray: byteArray
    system: {
      gc: () => void
      exit: (exitCode) => void
      refcount: (obj: GObject.Object) => number
      programInvocationName: string
    }
  }
}

export { imports }
