# zelda-i18n-lint

## What

用于检查本次代码工作区i18n的英文配置文件是否存在未完成翻译的字段

## Use

- pnpm add zelda-i180-lint -D
- npx lint-i180 -p="xxx"    xxx: 英文配置文件的路径，默认仅检查暂存区和版本区的diff
- npx lint-i180 -p="xxx" -a   检查整个英文配置文件,全部不限git工作区


