import path from 'node:path'
import fs from 'fs-extra'
import { consola } from 'consola'
import YAML from 'yaml'

import type { Config } from './utils'
import { createConfigFile, editPackageFile, isExists, matchPackages, packagePath, readJsonFile } from './utils'
import { batchInit } from './monorepo-init'

export default async (workspacePath = 'pnpm-workspace.yaml') => {
  const monorepoConfigPath = path.resolve(process.cwd(), workspacePath)

  const initAction = () => {
    const configData = readJsonFile(path.resolve(process.cwd(), packagePath))
    const { name, version } = configData

    if (name && version) {
      createConfigFile({ name, version })
      editPackageFile({
        ...configData,
        scripts: {
          ...(configData.scripts || {}),
          'lint-publish': 'lint-and-publish',
        },
      } as Config)
    }
    else {
      consola.error('please check package.json, name and version is required')
      process.exit(1)
    }
  }

  if (await isExists(monorepoConfigPath)) {
    const workspaceFile = fs.readFileSync(monorepoConfigPath, 'utf8')
    const workspaceData = YAML.parse(workspaceFile)
    const packagesPath = (workspaceData.packages as string[])[0]
    const packagesPathArr = matchPackages(path.resolve(process.cwd(), packagesPath)).map(item => path.resolve(process.cwd(), packagesPath, item))
    batchInit(
      packagesPathArr,
      initAction,
    )
  }
  else {
    initAction()
  }
}
