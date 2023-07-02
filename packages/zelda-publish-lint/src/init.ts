import path from 'node:path'
import { consola } from 'consola'

import type { Config } from './utils'
import { createConfigFile, editPackageFile, packagePath, readJsonFile } from './utils'

export default () => {
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
  }
}
