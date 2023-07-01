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
        'lint-and-publish': 'npm run lint-and-publish',
      },
    } as Config)
  }

  else { consola.error('请先初始化package.json, 并且确保name和version存在') }
}
