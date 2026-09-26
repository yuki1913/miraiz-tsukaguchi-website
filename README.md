# フリースクール MIRAIZ 阪急塚口校 公式サイト

SOFI株式会社が2026年9月に開校するフリースクール「MIRAIZ（ミライズ）阪急塚口校」の公式ホームページです。

ビルド不要の静的サイト（HTML / CSS / JavaScript のみ）。`index.html` をそのままサーバーに置けば公開できます。

```
miraiz-website/
├── index.html                        … 1ページ完結のサイト本体
├── assets/
│   ├── css/style.css                 … スタイル（MIRAIZロゴから採色したカラーパレット）
│   ├── js/main.js                    … ドロワー、スクロール演出、フォーム送信
│   └── img/                          … 画像一式（提供PDFから抽出・Web用に最適化）
├── robots.txt                        … 独自ドメイン公開までは検索エンジンをブロック
├── sitemap.xml                       … 検索エンジン向けサイトマップ
├── vercel.json                       … Vercel 用の設定（キャッシュ・セキュリティヘッダー）
├── .nojekyll                         … GitHub Pages で Jekyll 処理を無効化
└── README.md
```

## 掲載内容の出典

| 内容 | 出典 |
| --- | --- |
| キャッチコピー、コンテンツ、マイプロ、参加方法、1日の流れ、8つの特長 | `MIRIZ提案資料.pdf`（Canvaスライド10枚） |
| 「認められる環境で〜」本文、MIRAIZでできること、悩みチェックリスト | チラシ表面 `plusinnovation_miraizomote2026.pdf` |
| 料金、探究型学習、学び直し、安心サポート、I/N学院 | チラシ裏面 `plusinnovation_miraizura2026.pdf` |
| 開校月（2026年9月）、料金、対象年齢、2部制の時間 | Googleドキュメント「MIRAIZ フリースクール」 |
| 写真・ロゴ | 上記PDFに埋め込まれていた画像を抽出し、Web用に再圧縮 |

## 公開前に差し替えが必要な箇所

1. **電話番号・FAX**（`index.html` 内 5か所 / `main.js` 1か所）
   現在は公式チラシ記載の**株式会社プラスイノベーション本部窓口**（TEL 06-6415-6977 / FAX 06-6415-6978）を初期値にしています。
   SOFI株式会社の窓口が決まり次第、差し替えてください。
   - `<head>` の JSON-LD `telephone`
   - ヘッダーのナビ内ボタン
   - お問い合わせセクション（`.contact__tel` と `.contact__direct-note`）
   - フッター
   - 固定CTAバー
   - `assets/js/main.js` のフォーム送信失敗時メッセージ

2. **`https://example.com/`** → 独自ドメイン契約後に置き換え（手順は下記「独自ドメインへの切り替え」）

3. ~~**校舎の詳細住所**~~ → **確定済み**
   〒661-0012 兵庫県尼崎市南塚口町1丁目12-8
   お問い合わせ欄・アクセス欄・フッター・JSON-LDの `address` に反映済みです。

4. ~~**開校日と開校時間**~~ → **開校済み表記に変更済み**
   尼崎市の認定を受けたため、「開校予定／開校準備中」の表記をすべて「2026年9月 開校しました」「尼崎市認定フリースクール」に変更しました。
   開校月は **2026年9月** で表記しています（チラシの「8月1日開校」とは食い違いがあるため、必要なら修正してください）。

5. ~~**お問い合わせフォームの送信先**~~ → **設定済み**（`miraiz.tsukaguchi.info@gmail.com`／下記参照）

## お問い合わせフォームの設定

現在は、送信ボタンを押すと**入力内容を差し込んだメール作成画面が開く**フォールバック動作です。
宛先は `assets/js/main.js` 冒頭の定数で設定しています。

```js
const FALLBACK_MAIL_TO = 'miraiz.tsukaguchi.info@gmail.com';
```

この方式は送信者のメールソフトが立ち上がるため、**スマホやWebメール環境では送信が完了しないことがあります**。
確実に受信したい場合は、下記のフォームサービス連携をおすすめします。

サーバーやフォームサービス（Formspree、Google Apps Script など）に POST したい場合は、
`index.html` のフォームタグに送信先URLを設定します。設定すると自動的に `fetch` での非同期送信に切り替わります。

```html
<form class="contact__form" id="contact-form" data-endpoint="https://…" novalidate>
```

`FormData` として、`name` / `role` / `grade` / `tel` / `email` / `purpose`（複数）/ `message` / `agree` が送信されます。

## 公開方法

静的ファイルのみなので、置くだけで動きます。

- **レンタルサーバー**：このディレクトリの中身をドキュメントルートにアップロード
- **Netlify / Vercel / Cloudflare Pages**：このディレクトリを公開ディレクトリに指定（ビルドコマンドなし）
- **GitHub Pages**：下記の通り、`main` ブランチから直接公開されます

ローカルで確認する場合：

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

### GitHub Pages で関係者に共有する

この一式を**公開リポジトリのルート**に置いて `main` へ push し、
リポジトリの **Settings → Pages → Source** で「Deploy from a branch」を選び、
`main` / `/ (root)` を指定して Save すると、
`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

以降は `main` に push するだけで自動的に反映されます（1〜2分）。

GitHub Actions を使う方法もありますが、Pages機能の初回有効化にはリポジトリ管理者の権限が必要で、
アプリ連携経由のpushでは `Resource not accessible by integration` で失敗します。
静的サイトならブランチ公開のほうが構成がシンプルなので、こちらを採用しています。

**注意：業務ファイルが入っているプライベートリポジトリを公開設定に変えないでください。**
サイト専用の公開リポジトリを分けて運用してください。

### Vercel で公開する

1. Vercel で **Add New → Project** からこのリポジトリをインポート
2. **Framework Preset** は「Other」、**Build Command** と **Output Directory** は空欄のまま（ルートをそのまま配信）
3. Deploy を押すと `https://<プロジェクト名>.vercel.app/` で公開されます

以降は `main` への push で本番、その他のブランチへの push でプレビューURLが自動発行されます。
独自ドメインは Vercel の **Settings → Domains** で追加します（GitHub Pages 用の `CNAME` ファイルは不要）。

`vercel.json` では次の設定をしています。

| 対象 | 設定 | 意図 |
| --- | --- | --- |
| `/assets/css/*`・`/assets/js/*` | `Cache-Control: public, max-age=0, must-revalidate` | 毎回サーバーに更新確認（変更なしなら 304 で軽量）。修正が即反映される |
| `/assets/img/*` | `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` | 1日キャッシュ。以後7日間は古い画像を表示しつつ裏で更新 |
| 全ページ | `X-Content-Type-Options` / `X-Frame-Options` / `Referrer-Policy` | 基本的なセキュリティヘッダー |
| — | `cleanUrls: true`・`trailingSlash: false` | URL末尾の `.html` や `/` を省いた形に統一 |

**画像を差し替えたときの注意**：同じファイル名で上書きすると、訪問済みの人には最大1日ほど古い画像が表示されることがあります。
すぐに反映させたい場合は、ファイル名を変える（例：`hero-2.jpg`）か、参照側に `?v=2` を付けてください。

> ファイル名にハッシュが付かない構成のため、`immutable`（1年キャッシュ）は使っていません。
> 付けると、CSS・JS・画像を修正しても訪問済みの人のブラウザに古いファイルが残り続けます。

### 独自ドメインへの切り替え

SEO用のURL（canonical・OGP・構造化データ・サイトマップ）は、すべて仮の `https://example.com/` で書いてあります。
ドメインを契約したら、次の順に作業します（例：`miraiz-tsukaguchi.jp`）。

1. **URLを一括置換**（`index.html` と `sitemap.xml`）
   ```bash
   grep -rl 'https://example.com' index.html sitemap.xml | xargs sed -i 's#https://example.com#https://miraiz-tsukaguchi.jp#g'
   ```
2. **ドメインを接続**
   - Vercel：**Settings → Domains** でドメインを追加し、表示されるDNSレコードをドメイン会社の管理画面に設定
   - GitHub Pages：ルートに `CNAME` ファイル（中身はドメイン名だけ）を作って push
3. **検索エンジンに公開**：`robots.txt` を次の内容に書き換えます（削除ではなく書き換え）。
   ```
   User-agent: *
   Allow: /
   Sitemap: https://miraiz-tsukaguchi.jp/sitemap.xml
   ```
4. **Google Search Console** にドメインを登録し、`sitemap.xml` を送信。「URL検査」でトップページのインデックス登録をリクエスト
5. **Googleビジネスプロフィール**（Googleマップ）に校舎を登録し、Webサイト欄に独自ドメインを設定。
   「尼崎 フリースクール」のような地域検索では、マップ枠の表示が非常に効きます

> ドメインの置き換えより先に `robots.txt` を開けないでください。canonical が `example.com` のままだと、
> Googleに「本体は example.com」と伝えてしまいます。

`*.vercel.app` のURLには `vercel.json` で `X-Robots-Tag: noindex` を付けているため、
`robots.txt` を開けたあとも、検索結果に出るのは独自ドメインだけになります（重複コンテンツ対策）。

### SEO対策の内容

| 項目 | 内容 |
| --- | --- |
| タイトル・説明文 | 「尼崎市認定」「フリースクール」「塚口駅」「不登校」「小中学生」など、検索されやすい語を自然に含めています |
| 構造化データ（JSON-LD） | `School` + `LocalBusiness`（住所・営業時間・料金・対象・運営会社）、`WebSite`、`FAQPage`（よくある質問8問）|
| OGP | 絶対URLの `og:url`・`og:image`（LINE・SNSでシェアしたときのカード表示） |
| サイトマップ | `sitemap.xml`。内容を大きく更新したら `<lastmod>` の日付を更新 |
| 重複対策 | `canonical` と、`*.vercel.app` への `noindex` |

`meta keywords` は Google が使っていないため削除しました。
今後の効果が大きい施策は、**Googleビジネスプロフィールの登録と口コミ**、**尼崎市や地域メディアからのリンク**、
**お知らせ・ブログページの追加**（体験会の様子、マイプロ事例など）です。

## 実装メモ

- **カラー**：MIRAIZロゴの風車（9枚羽）から実際の色を抽出し、CSS変数として定義しています（`--c-red` 〜 `--c-magenta`）。カード類のパステルカラーは提案スライドの配色に合わせています。飛鳥みらい学校のような明るい多色構成を意識しました。
- **フォント**：見出しに丸ゴシックの Zen Maru Gothic、本文に Noto Sans JP（Google Fonts）。読み込めない環境では、ヒラギノ丸ゴ／ヒラギノ角ゴ／メイリオへフォールバックします。
- **レスポンシブ**：1080px以下でグローバルナビをドロワー＋下部固定CTAに、900px以下で1カラム、760px以下でマイプロ例の表をカード表示に切り替えます。
- **アクセシビリティ**：スキップリンク、キーボード操作対応のドロワー（Escで閉じる）、フォームの `aria-invalid` とライブリージョン、`prefers-reduced-motion` でのアニメーション停止に対応。
- **画像**：写真はJPEG、切り抜き人物は透過WebP。ファーストビュー以外は遅延読み込み。全画像で合計約1.1MB。
- **構造化データ**：`School`・`LocalBusiness`・`WebSite`・`FAQPage` のJSON-LDを埋め込み済み（上記「SEO対策の内容」参照）。FAQの文言を変えたときは JSON-LD 側も合わせて更新してください。

## 今後追加できる素材

- **4コマまんが**：Googleドキュメントに記載がありましたが、データが未提供のため未掲載です。いただければ「MIRAIZとは」の後などに追加できます。
- **教室の完成写真**：現在は開校準備中（工事中）に撮影した写真を使用しています。完成後の写真に差し替えると訴求力が上がります。
- **在校生・保護者の声、スタッフ紹介（氏名・大学・ひとこと）**：開校後に追加すると信頼感が高まります。現在の大学生スタッフ写真は名前なしで掲載しています。
