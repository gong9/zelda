# zelda-image-compression

放到 husky pre-commit 中，用于压缩项目暂存区的图片资源

## usage

> notes: 最好使用 cnpm 安装，因为依赖问题其他安装方式可能会出现问题

```bash
cnpm i zelda-image-compression -D
```

pre-commit 中

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx zelda-image-compression
```
