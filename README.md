# ejs-template
テンプレートエンジン「EJS」を使用したテンプレート


## バージョン

### ver. 1.0.0
基本的なテンプレートセット

### ver. 1.0.1
デモの追加  
css, jsの読み込み条件変更。指定が無い時は何も記述しない。  
ページ毎にファイルパスを指定出来るように変更

### ver. 2.0.0
PC/SPの振り分け追加  
[コマンド]  
```
gulp：PCのビルドと監視  
gulp sp：SPのビルドと監視  
```

### ver. 2.0.1
cssとjs複数読み込みの記述を修正  

### ver. 3.0.0
CoffeeScriptの自動コンパイル追加  

### ver. 4.0.0
画像コピーをタスクに追加

### ver 5.0.0
開発環境用と本番環境用にファイルを分けるタスクを追加

### ver 5.0.1
コマンド変更

### ver 6.0.0
ビルドタスク修正  
ビルド後にリロードが走るように変更  

### ver 7.0.0
プラグインのファイルを１ファイルにまとめる機能を追加  
cssのベンダープレフィックス自動付与の機能を追加

### ver 7.0.1
パッケージのバージョンアップデート  
EJSのバージョンの変更に伴い、タスクを修正  

### ver 8.0.0
webpack追加。coffeeのタスク削除。ejsと画像タスク修正。    
jsファイルを1ファイルにまとめられるように変更。  

### ver 9.0.0
es2015対応  

### ver 9.0.1
webpackのエラーの際にwatchが停止しないようにタスクを修正。  

### ver 9.0.2
不要なパッケージ削除。easingのscss追加。

### ver 9.0.3
easingのscss修正

### ver 10.0.0
gulpのバージョンをv3.9.1からv4.0.0にアップデート  
他のパッケージもアップデート  
gulpのバージョンアップに伴い、ビルドコマンドが変更になりました。

### ver 10.0.1
ビルドコマンド変更  

### ver 10.0.2
stylelintを導入

### ver 10.0.3
jestを導入  
babel-polyfillを追加  
不要なパッケージを削除

### ver 10.0.4
gulp-ejsのバージョンを4系にアップデート

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
##### SPディレクトリ

```
npm run start-sp
```

or

```
yarn run start-sp
```


### 使い方と仕様


#### ＜使い方＞
  1. nodeとwebpackをグローバルにインストール
  2. 作業ディレクトリに移動し、コマンド「 `npm install` 」で必要なパッケージをインストール
  3. 開発用ソースのビルド「 `npx gulp build --env dev` 」
  4. コマンド「 `npx gulp` 」でローカルサーバー起動（/sp以下を監視する場合は `npx gulp-sp` ）
  5. 開発が終わったら本番環境用にソースをビルド
  - htdocs/を一旦空にする「 `npx gulp clean` 」
  - 本番環境用のソースをビルド「 `npx gulp build --env prod` 」  
  ＊ htdocs/以下にminifyしたcssやjsが入ります。

#### ＜仕様＞
  * /src/templates/pages/以下の.ejsファイル、/src/styles/以下の.scssファイル、/src/js/以下のjsファイルを上書き保存すると、自動ビルドとブラウザリロードが始まります。  
  ＊/src/templates/の/pages/以外を編集した場合には、ターミナル上で「Ctr+C」で一旦gulpを止めてから、再びターミナル上で「`npx gulp` 」コマンドを叩いて下さい。  
  ＊処理が重い場合やPCのスペック・メモリの都合でリロードしても変更が反映しきれない場合があります。  
  その場合には手動でブラウザをリロードして下さい。  
  * /src/以下のファイルを編集すると、/src/と同じ階層に「/dist/」フォルダが自動的に生成されます。  
  * ejsのエラーが出ると、/dist/内に「.ejs」のファイルが出力されます。
  エラーは開発時点で必ず取り除いてください。  
  * 画像ファイルは/src/images/内で管理。  
  ＊ サーバーにアップロードするのは/htdocs/内のファイルのみ。
