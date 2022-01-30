# ejs-template
テンプレートエンジン「EJS」を使用したテンプレート


## バージョン

### ver. 1.0.0

- 基本的なテンプレートセット

### ver. 1.0.1

- デモの追加  
- css, jsの読み込み条件変更。指定が無い時は何も記述しない。  
- ページ毎にファイルパスを指定出来るように変更

### ver. 2.0.0

- PC/SPの振り分け追加  

[コマンド]  

```
gulp：PCのビルドと監視  
gulp sp：SPのビルドと監視  
```

### ver. 2.0.1

- cssとjs複数読み込みの記述を修正  

### ver. 3.0.0

- CoffeeScriptの自動コンパイル追加  

### ver. 4.0.0

- 画像コピーをタスクに追加

### ver 5.0.0

- 開発環境用と本番環境用にファイルを分けるタスクを追加

### ver 5.0.1

- コマンド変更

### ver 6.0.0

- ビルドタスク修正  
- ビルド後にリロードが走るように変更  

### ver 7.0.0

- プラグインのファイルを１ファイルにまとめる機能を追加  
- cssのベンダープレフィックス自動付与の機能を追加

### ver 7.0.1

- パッケージのバージョンアップデート  
- EJSのバージョンの変更に伴い、タスクを修正  

### ver 8.0.0

- webpack追加。coffeeのタスク削除。ejsと画像タスク修正。    
- jsファイルを1ファイルにまとめられるように変更。  

### ver 9.0.0

- es2015対応  

### ver 9.0.1

- webpackのエラーの際にwatchが停止しないようにタスクを修正。  

### ver 9.0.2

- 不要なパッケージ削除。easingのscss追加。

### ver 9.0.3

- easingのscss修正

### ver 10.0.0

- gulpのバージョンをv3.9.1からv4.0.0にアップデート  
- 他のパッケージもアップデート  
- gulpのバージョンアップに伴い、ビルドコマンドが変更になりました。

### ver 10.0.1

- ビルドコマンド変更  

### ver 10.0.2

- stylelintを導入

### ver 10.0.3

- jestを導入  
- babel-polyfillを追加  
- 不要なパッケージを削除

### ver 10.0.4

- gulp-ejsのバージョンを4系にアップデート

### ver 10.0.5

- svgのスプライトのタスクを追加

### ver 10.0.6

- パッケージのバージョンをアップデート  
- Sassのバージョンアップに伴い、Sassのタスクを修正。対象ブラウザ変更。

### ver 10.0.7

- 画像・css・jsファイルの出力先を「assets/」以下に変更

### ver 11.0.0

- spディレクトリを削除  
- 不要なパッケージを削除  
- devDependenciesのみにする  
- パッケージのバージョンを固定

### ver 11.0.1

- ejsの構成変更

### ver 11.0.2

- パッケージのバージョン更新  
- babel-polyfillを削除。代わりにcore-jsを追加。  
- パッケージからjquery・imagesloadedを削除。

### ver 11.0.3

- パッケージのバージョン更新

### ver 11.0.4

- jestの設定更新  
- サンプルスクリプトの修正  
- README更新

### ver 12.0.0.

- gulp-ejs のメジャーバージョンを5系にアップデート
- サンプルejsファイル更新
- SCSSのコード一部削除・画像ファイル削除

### ver 12.0.1

- webpackのバージョンを5系にアップデート
- core-js削除

### ver 12.0.2

- sass, gulp-sass, webpack, jest, babelのバージョンアップデート

#### ローカル開発用ソースのビルド

```
npm run dev
```

or

```
yarn run dev
```

#### scssのlintチェック

```
npm run lint:style
```

or

```
yarn run lint:style
```

#### jsのtest

```
npm run test
```

or

```
yarn run test
```

#### 本番環境(サーバーアップ用)ソースのビルド

```
npm run prod
```

or

```
yarn run prod
```

#### ローカル開発用のビルドと監視
##### PCディレクトリ

```
npm run start
```

or

```
yarn run start
```

### 使い方と仕様


#### ＜使い方＞
  - htdocs/を一旦空にする「 `npx gulp clean` 」
  - 本番環境用のソースをビルド「 `npm run prod` 」  
  ＊ htdocs/以下にminifyしたcssやjsが入ります。

#### ＜仕様＞
  * /src/templates/pages/以下の.ejsファイル、/src/styles/以下の.scssファイル、/src/js/以下のjsファイルを上書き保存すると、自動ビルドとブラウザリロードが始まります。  
  * /src/以下のファイルを編集すると、/src/と同じ階層に「/dist/」フォルダが自動的に生成されます。  
  * 画像ファイルは/src/images/内で管理。  
  ＊ サーバーにアップロードするのは/htdocs/内のファイルのみ。
