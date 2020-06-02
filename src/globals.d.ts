declare global {
  const ARGV: string[]
  const imports: {
    system: {
      gc: () => void
      exit: (exitCode) => void
      programInvocationName: string
    }
  }
}

export { imports }
