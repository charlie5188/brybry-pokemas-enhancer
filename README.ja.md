# Brybry Pokemas Enhancer

[English](README.md) | [简体中文](README.zh-CN.md) | 日本語

`pokemon.brybry.ch` のバディーズページを使いやすくする、プレーン JavaScript 製の userscript です。開発用ソースは役割ごとに `src/` に分割されていますが、利用者がインストールするのはリポジトリ直下の単一ファイルだけです。

[Brybry Pokemas Enhancer をインストール](https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js)

> `brybry-enhancer.user.js` は自動生成ファイルです。直接編集せず、`src/` を変更してから `npm run build` を実行してください。

## インストール

### Safari

1. App Store から Userscripts for Safari をインストールします。
2. Safari の拡張機能設定で有効にし、`pokemon.brybry.ch` へのアクセスを許可します。
3. 上のインストールリンクを開き、Userscripts for Safari に追加します。
4. Brybry Pokemas のバディーズページを開くか、再読み込みします。

### Tampermonkey

1. 対応ブラウザに Tampermonkey をインストールします。
2. 上のインストールリンクを開き、インストールを確認します。
3. Brybry Pokemas のバディーズページを開くか、再読み込みします。

リポジトリ直下の生成ファイルは、metadata header を先頭に含む自己完結型 userscript です。既存の Codex／Playwright 開発フローでも、userscript マネージャーを使わず同じファイルをページへ直接注入できます。

## 開発

Node.js 20 以降が必要です。

```sh
npm ci
npm run dev
```

`npm run dev` は `src/` を監視し、保存するたびにルートの userscript を再生成します。

利用できるコマンド：

- `npm run build`：esbuild でソース、CSS、データを `brybry-enhancer.user.js` にまとめます。
- `npm run dev`：一度ビルドした後、watch モードを開始します。
- `npm run check`：メモリ上で再ビルドし、metadata の位置、JavaScript 構文、コミット済み生成ファイルが最新かを確認します。
- `npm test`：`npm run check` のエイリアスです。
- `npm run update:pomatools -- /path/to/pomatools.github.io`：ローカルの PomaTools checkout から8言語分の略語データを再生成します。

Pull Request を作成する前に実行してください：

```sh
npm run build
npm run check
```

ソース変更と、再生成されたルート userscript の両方をコミットしてください。CI でも再ビルドし、生成物に差分があれば失敗します。

## プロジェクト構成

```text
src/
  index.js                 初期化と機能の組み立て
  config.js                URL、ストレージキー、共通設定
  i18n.js                  言語判定データと UI 文言
  state.js                 共有ランタイム状態と初期値
  storage.js               Picker 設定とバディーズ別 Sync Grid 保存
  spoiler-protection.js    ネタバレ防止の遷移、設定、対象セクション
  styles.css               注入する全スタイル
  styles.js                style 要素のマウント
  data/
    index.js               Brybry データ読込、索引、スキル検索テキスト
    pomatools-abbreviations/
      *-skills.json        言語別の手動作成 Grid スキル略語
      *-moves.json         言語別の手動作成わざ略語
  grid/
    index.js               ラベル、折返し、レスポンシブ表示、Tooltip
  picker/
    index.js               Dialog、フィルタ、ソート、リスト／アイコン表示
scripts/
  build.js                 決定的な esbuild パイプラインと watch モード
  check.js                 生成物、metadata、構文のチェック
```

JavaScript ファイルは `scripts/build.js` に記載された固定順序で結合され、userscript の単一ランタイムスコープを共有します。フレームワークや実行時モジュールローダーは導入していません。変更は最も関係するソースファイルに置き、大きな静的データは `src/data/` に置いてください。

## 主な機能

- Sync Grid のマスに最大4行のレスポンシブテキストを表示。最大16pxで、必要に応じて PomaTools の略語を使用。
- Grid Tooltip に関連わざの説明を表示。Grid は画面幅に合わせて拡大し、バディーズごとの設定を保存。
- アイコン／リスト表示、多言語検索、スキル検索、フィルタ、ソートを備えた2カラムのバディーズ選択画面。
- タイプ、ロール、EXロール、ロール組み合わせ、弱点、初期★、入手方法、スカウト種別、地方、トレーナーグループ、超覚醒のフィルタ。
- 未実装バディーズと Grid 更新を隠す任意のネタバレ防止機能。
- Sync Grid セクションを Stats より前に配置。
- 既存のストレージキーを使った Picker 設定とバディーズ別 Sync Grid 設定の保存。

バディーズ名とフィルタ用 metadata は常に Brybry の最新データから読み込み、独自のバディーズ一覧は管理しません。

Brybry のコンテンツ言語 URL／Cookie に従い、同じ8言語（英語、フランス語、ドイツ語、スペイン語、イタリア語、日本語、韓国語、繁体字中国語）に対応します。ゲーム用語とスキル文は Brybry、手動作成の Grid 略語は PomaTools を参照しています。

現在の略語スナップショットは PomaTools commit `47943a730951580152bae7fa3d223c9ac97f80b1` から生成されています。

## ライセンスと帰属

プロジェクトのソースコードは [MIT License](LICENSE) で公開しています。生成済み PomaTools 略語データはこのライセンスの対象外です。出典と帰属は [NOTICE.md](NOTICE.md) を参照してください。

本プロジェクトは非公式のファンプロジェクトです。Pokémon、Pokémon Masters EX、および関連する名称・素材の権利は各権利者に帰属します。Pokémon、DeNA、Nintendo、Creatures、GAME FREAK、Brybry、PomaTools とは関係がなく、公式の承認も受けていません。
