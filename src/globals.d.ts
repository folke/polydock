declare global {
  const ARGV: string[]
  const imports: {
    system: {
      exit: (exitCode) => void
      programInvocationName: string
    }
  }
}

export { imports }
