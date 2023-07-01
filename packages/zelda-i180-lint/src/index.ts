#!/usr/bin/env node
import { cli } from 'cleye'
import { consola } from 'consola'
import packJson from '../package.json'
import execDiff from './exec'
import findAllDiff from './findAllDiff'

const argv = cli({
  name: 'zelda-en-lint',
  version: packJson.version,
  description: 'lint-en',
  flags: {
    path: {
      type: String,
      description: 'Input your file path',
      alias: 'p',
    },
    all: {
      type: Boolean,
      alias: 'a',
    },
  },
})

const curPath = argv.flags.path

if (curPath) {
  if (argv.flags.all)
    findAllDiff(curPath)

  else
    execDiff(curPath, true)
}
else {
  consola.warn('请输入文件路径')
  consola.info('example: pnpm lint-en -p="xxx"')
}
