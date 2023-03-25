# zelda

## What

some npm packages used to improve efficiency


## packages

### zelda-en-lint

#### What

用于检查本次代码工作区i18n的英文配置文件是否存在未完成翻译的字段

#### Use
> 注意：path参数是相对于根项目的相对地址而不是某个文件 eg: -p="./src/i18n/en.json" 

- pnpm add zelda-en-lint -D
- pnpm lint-en -p="xxx" xxx: 英文配置文件的路径，默认仅检查暂存区和版本区的diff
- pnpm lint-en -p="xxx" -a 检查整个英文配置文件,全部不限git工作区

#### Example

您可以在git pre-commit hook中使用lint-en来检查您的代码是否存在未完成翻译的字段

pre-commit
```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

other lint && pnpm lint-en -p="xxx"
```

MIT
