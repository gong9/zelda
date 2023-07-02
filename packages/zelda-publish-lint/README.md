# lint-publish

### zelda-publish-lint

由于cicd中，我们一般会直接配置`npm run build`,`npm publish` 但是很多时候我们的代码并没有版本改动，这样会导致无效的发包，所以我们需要一个工具来校验此次操作是否需要真正发包，避免cicd行为中的无效发包导致的错误提醒

#### Use

- pnpm add lint-and-publish
- npx lint-and-publish --init
- 将用`lint-publish`替换掉`npm publish`





