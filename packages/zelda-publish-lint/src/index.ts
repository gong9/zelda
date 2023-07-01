#!/usr/bin/env node
import { cli } from 'cleye'

import packJson from '../package.json'
import initFunc from './init'
import runPublish from './run-publish'

const argv = cli({
  name: 'lint-publish',
  version: packJson.version,
  description: 'lint-publish',
  flags: {
    init: {
      type: Boolean,
      description: 'lint publish init',
      alias: 'p',
    },
  },
})

const { init } = argv.flags

if (init)
  initFunc()
else
  runPublish()
