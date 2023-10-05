#!/usr/bin/env node
import { cli } from 'cleye'
import packJson from '../package.json'
import execDiff from './exec'

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

execDiff()
