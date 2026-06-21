---
theme: default
colorSchema: light
background: false
class: text-center
highlighter: shiki
lineNumbers: true
shikiConfig:
  theme: 'nord'
drawings:
  persist: false
transition: slide-left
title: Oxlint eslint-plugin rule implementation
mdc: true
fonts:
  sans: 'Noto Sans JP'
  serif: 'Noto Serif JP'
  mono: 'Menlo'
---

<CoverSlide
  title="Oxlint eslint-plugin rule implementation"
  event="TSKaigi 2026事後勉強会 / #tskaigi_smarthr"
  author="fujitani sora"
/>

---

<div style="padding: 0 8%">

<div class="grid grid-cols-[1fr_1fr] items-start gap-8">
  <div style="padding-top: 7rem">
    <p class="text-3xl font-bold mb-6" style="color: oklch(0.52 0.16 215)">fujitani sora</p>
    <div class="flex flex-col gap-3 text-lg font-semibold">
      <div class="flex items-center gap-2">
        <carbon-calendar class="text-lg" />
        <span>2001 (25)</span>
      </div>
      <div class="flex items-center gap-2">
        <carbon-building class="text-lg" />
        <span>toridori inc engineer</span>
      </div>
      <div class="flex items-center gap-2">
        <carbon-logo-x class="text-lg" />
        <a href="https://x.com/sorafujitani">x.com/sorafujitani</a>
      </div>
      <div class="flex items-center gap-2">
        <carbon-logo-github class="text-lg" />
        <a href="https://github.com/sorafujitani">github.com/sorafujitani</a>
      </div>
      <div class="flex items-center gap-2">
        <carbon-globe class="text-lg" />
        <a href="https://sorafujitani.me/">sorafujitani.me</a>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-center gap-4" style="margin-top: -1.25rem">
    <CenteredImage
      src="https://raw.githubusercontent.com/fs0414/imgs/main/fs0414_dot_image.png"
      alt="プロフィール画像"
      width="250px"
    />
    <img
      :src="'/oh-rivals.png'"
      alt="Oh, rivals"
      style="width: 255px; max-height: 240px; object-fit: contain; border-radius: 8px;"
    />
  </div>
</div>

</div>

---
layout: center
---

# <span class="gradient-heading text-3xl">話すこと</span>

[oxc-project/oxc](https://github.com/oxc-project/oxc) の Oxlint eslint-plugin rule実装 PR #23610 の概要について

Issue: https://github.com/oxc-project/oxc/issues/493

PR: https://github.com/oxc-project/oxc/pull/23610

---

- Oxlint は TypeScript / JavaScript の lint を高速に実行するツール。
- 既存の ESLint plugin の rule と同じ名前・同じ挙動に寄せて実装される rule群 とその移行計画がある
  - [Linter Product Plan and Progress](https://github.com/oxc-project/oxc/issues/481)
- `node/prefer-global-console` も、eslint-plugin-n の `n/prefer-global/console` 相当の rule

---

`node/prefer-global-console` は `console` の使い方を揃える rule。

```ts
// グローバル console
console.log("hello")

// console module から import
import console from "node:console"
console.log("hello")
```

Node.js では `console` はグローバルにも module にもある。

---

`.oxlintrc.json` から有効化する。

```json
{
  "plugins": ["node"],
  "rules": {
    "node/prefer-global-console": ["warn", "always"]
  }
}
```

`"always"` はグローバル `console`、`"never"` は module 側を使う設定。

---

`"always"` では、console module からの import / require を避ける。

```ts
// NG
import console from "node:console"
console.log("hello")

// OK
console.log("hello")
```

CommonJS でも同じ。

```js
// NG
const console = require("console")
```
---

PR #23610 で追加されたもの。

- rule 本体、診断、検出ロジック、テストを実装する
  - `prefer_global_console.rs`
- rule を Oxlint の実行経路に登録する
  - `rules_enum.rs` / `rule_runner_impls.rs`
- `.oxlintrc.json` から設定できるようにする
  - `configuration_schema.json` / `config.generated.ts`

---

`.oxlintrc.json` から読めるようにする生成物。

- 生成コマンド
  - `cargo lintgen && just linter-schema-json && just linter-config-ts`
- 生成されるもの
  - `config.generated.ts`: TS 側の rule 名と option 型
  - `configuration_schema.json`: JSON schema 側の rule 名と option 型

<div style="--slide-code-font-size: clamp(0.72rem, 1.35vw, 0.9rem)">

```ts
// apps/oxlint/src-js/package/config.generated.ts:1227
"node/prefer-global-console"?: RuleNoConfig | [
  AllowWarnDeny,
  PreferGlobalConsoleMode,
];

// npm/oxlint/configuration_schema.json:5758
"node/prefer-global-console": { ... }
```

</div>

---

module 経由の `console` を見つける

- 変数宣言を見る
  - `const console = require("console")`
  - `const console = require("node:console")`
- import 宣言を見る
  - `import console from "node:console"`
  - `import * as console from "node:console"`

---

`crates/oxc_linter/src/rules/node/prefer_global_console.rs:90-102`

- `Always` のときだけ module 経由の `console` を検出
- 前のページの「変数宣言」と「import 宣言」を分岐して見る

<div style="--slide-code-font-size: clamp(0.72rem, 1.35vw, 0.9rem)">

```rust
PreferGlobalConsoleMode::Always => match node.kind() {
    AstKind::VariableDeclarator(var_decl) => {
        if let Some(span) = module_console_binding_span(var_decl) {
            ctx.diagnostic(prefer_global_diagnostic(span));
        }
    }
    AstKind::ImportDeclaration(import_decl) => {
        if let Some(span) = imported_console_span(import_decl) {
            ctx.diagnostic(prefer_global_diagnostic(span));
        }
    }
    _ => {}
},
```

</div>

---

PR本文の test plan。

- rule の pass / fail case を確認する
  - `cargo test -p oxc_linter --lib prefer_global_console`
- 生成物と設定schemaの更新漏れを確認する
  - `cargo lintgen && just linter-schema-json && just linter-config-ts && git diff --exit-code`
- formatting を確認する
  - `just fmt`

---

- eslint plugin rule 実装では、rule 本体だけを見れば終わりではない
- Oxlint の実行経路、設定ファイル、生成物までつなげる
- test plan では rule 挙動、生成物、formatting をまとめて確認する

---
layout: center
class: text-center
---

<h1 class="gradient-heading text-4xl font-bold">see you later 👋</h1>
