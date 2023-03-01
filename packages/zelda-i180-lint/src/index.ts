#!/usr/bin/env node
import execDiff from "./exec";
const path = process.argv.slice(2)[0];

execDiff(path, true);


