import path from 'node:path'
import { spawn } from 'node:child_process'
import { consola } from 'consola'

import type { Config } from './utils'
import { currentPath, editConfigFile, isExists, packagePath, readJsonFile } from './utils'

export default async () => {
  const currentCwd = process.cwd()

  if (!await isExists(path.resolve(currentCwd, 'publish.config.json'))) {
    consola.error('publish.config.json not exists, please run `npx lint-and-publish init`')
    return
  }

  const packageInfo = readJsonFile(path.resolve(currentCwd, packagePath))
  const configInfo = readJsonFile(path.resolve(currentCwd, currentPath))

  if (packageInfo.name && packageInfo.version && configInfo.name && configInfo.version) {
    if (packageInfo.name === configInfo.name && packageInfo.version !== configInfo.version) {
      editConfigFile(packageInfo as Config)
      spawn('npm', ['publish'], {
        stdio: 'inherit',
      })
    }
    else {
      consola.info('not need publish')
    }
  }
}
