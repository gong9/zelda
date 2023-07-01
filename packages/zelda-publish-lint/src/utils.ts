import path from 'node:path'
import fs from 'fs-extra'
import { consola } from 'consola'

export const currentPath = 'publish.config.json'
export const packagePath = 'package.json'

export interface Config {
  name: string
  version: string
  [key: string]: any
}

enum ConfigFileType {
  'config',
  'package',
}

export async function isExists(path: string) {
  return await fs.pathExists(path)
}

export const createConfigFile = (config: Config, type = ConfigFileType.config) => {
  try {
    fs.writeFileSync(path.resolve(process.cwd(), type === ConfigFileType.config ? currentPath : packagePath), JSON.stringify(config, null, 2))
    if (type === ConfigFileType.config)
      consola.success('create publish.config.json success')
    else
      consola.success('add package.json scripts success')
  }
  catch (error) {
    consola.error('create publish.config.json fail')
  }
}

export const editConfigFile = createConfigFile

export const editPackageFile = (configData: Config) => createConfigFile(configData, ConfigFileType.package)

export function readJsonFile(path: string): Partial<Config> {
  const data = fs.readFileSync(path, 'utf8')

  try {
    return JSON.parse(data)
  }
  catch (error) {
    consola.error(error)
    return {}
  }
}
