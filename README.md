# ejs-template

テンプレートエンジン「EJS」を使用したテンプレート

## Requirements

- Node.js: `24.13.0`
- pnpm: `12.x`

## Files

`src/` 以下を利用する。

### Directories

- `__test__/` テストコード用
- `assets/images/` 画像ファイル用
- `scripts/` スクリプトファイル(TypeScript)用
- `styles/` cssファイル用
- `templates/` ejsファイル用

```bash
├── src
│   ├── __test__
│   ├── assets
│   │   ├── favicon.ico
│   │   └── images
│   ├── scripts
│   │   ├── index.ts
│   │   └── plugins
│   ├── styles
│   │   ├── components
│   │   ├── global.css
│   │   └── pages
│   └── templates
│       ├── components
│       ├── include
│       └── pages
```

## commands

### install

```bash
pnpm i
```

### build for development

```bash
pnpm build:dev
```

### build for production

```bash
pnpm build:prod
```

### run server for development

```bash
pnpm start
```

### run test for javascript

```bash
pnpm test
```

### format

#### check

```bash
pnpm prettier:check
```

#### write

```bash
pnpm prettier:write
```

### eslint

※ typescript-eslint対応後に利用できるように修正予定

```bash
pnpm lint
```
