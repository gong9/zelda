# zelda

## What

some npm packages used to improve efficiency

## packages

### zelda-en-lint

#### What

用于检查本次代码工作区 i18n 的英文配置文件是否存在未完成翻译的字段

#### Use

> 注意：path 参数是相对于根项目的相对地址而不是某个文件 eg: -p="./src/i18n/en.json"

- pnpm add zelda-en-lint -D
- pnpm lint-en -p="xxx" xxx: 英文配置文件的路径，默认仅检查暂存区和版本区的 diff
- pnpm lint-en -p="xxx" -a 检查整个英文配置文件,全部不限 git 工作区

#### Example

您可以在 git pre-commit hook 中使用 lint-en 来检查您的代码是否存在未完成翻译的字段

pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

other lint && pnpm lint-en -p="xxx"
```

#### zelda-image-compression

由于有时候我们为了方便，不会将所有的图片资源都上传到 cdn 服务器，而是放进项目中。但是又由于图片资源大小问题导致我们的项目越来越大

此工具就是用来压缩项目暂存区的图片资源

目前主要支持 jpg 和 png

#### usage

> notes: 最好使用 cnpm 安装，因为依赖问题其他安装方式可能会出现问题

```bash
cnpm i zelda-image-compression -D
```

git add . 之后执行

```bash
pnpm image-compression
```

git commit ...

后续：

针对于 apng 格式的图片，目前支持 apng 拆解成 png 序列帧，png 序列帧合成 apng

但是由于 apng 拆解对导致图片的尺寸发生一些微笑变化，目前暂不可使用。故针对于 apng 的压缩可以直接给出 png 序列帧，在交由`assembleApng` 方法压缩

但是此种方式因为需要 png 序列帧资源，比较不不方便。所以后续计划写成 electron 桌面应用，方便设计同学直接生成 apng

### zelda-publish-lint

由于 cicd 中，我们一般会直接配置`npm run build`,`npm publish` 但是很多时候我们的代码并没有版本改动，这样会导致无效的发包，所以我们需要一个工具来校验此次操作是否需要真正发包，避免 cicd 行为中的无效发包导致的错误提醒

#### Use

- pnpm add lint-and-publish
- npx lint-and-publish --init
- 将用`lint-publish`替换掉`npm publish`

MIT
