export const batchInit = (packages: string[], initAction: () => void) => {
  for (let i = 0; i < packages.length; i++) {
    process.chdir(packages[i])
    initAction()
  }
  process.chdir(process.cwd())
}
