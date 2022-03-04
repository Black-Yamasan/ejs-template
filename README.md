# ejs-template
テンプレートエンジン「EJS」を使用したテンプレート

## コマンド

### ローカル開発用ソースのビルド

```
npm run dev
```

or

```
yarn run dev
```

### scssのlintチェック

```
npm run lint:style
```

or

```
yarn run lint:style
```

### jsのtest

```
npm run test
```

or

```
yarn run test
```

### 本番環境(サーバーアップ用)ソースのビルド

```
npm run prod
```

or

```
yarn run prod
```

### ローカル開発用のビルドと監視

```
npm run start
```

or

```
yarn run start
```

## 使い方と仕様


### ＜使い方＞
  - htdocs/を一旦空にする「 `npx gulp clean` 」
  - 本番環境用のソースをビルド「 `npm run prod` 」  
  ＊ htdocs/以下にminifyしたcssやjsが入ります。

### ＜仕様＞
  * /src/templates/pages/以下の.ejsファイル、/src/styles/以下の.scssファイル、/src/js/以下のjsファイルを上書き保存すると、自動ビルドとブラウザリロードが始まります。  
  * /src/以下のファイルを編集すると、/src/と同じ階層に「/dist/」フォルダが自動的に生成されます。  
  * 画像ファイルは/src/images/内で管理。  
  ＊ サーバーにアップロードするのは/htdocs/内のファイルのみ。
