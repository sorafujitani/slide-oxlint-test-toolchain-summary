---
title: Oxlint eslint-plugin rule implementation
subtitle: node/prefer-global-console と PR #23610 を例に
author: fujitani sora
event: TSKaigi 2026事後勉強会
social:
  github: sorafujitani
  twitter: sorafujitani
---

# Introduction

[oxc-project/oxc](https://github.com/oxc-project/oxc) の Oxlint eslint-plugin rule実装 PR #23610 の概要について。

Issue: https://github.com/oxc-project/oxc/issues/493

PR: https://github.com/oxc-project/oxc/pull/23610

# 今日の話

- ESLint で使っていた rule と同じ感覚で使えるか
- `.oxlintrc.json` にどう書くか
- TypeScript / JavaScript のコードをちゃんと見てくれるか
- CI や editor で同じように検出できるか

# Oxlint と eslint-plugin rule

Oxlint は TypeScript / JavaScript の lint を高速に実行するツールです。

既存の ESLint plugin の rule と同じ名前・同じ挙動に寄せて実装される rule もあります。

今回の `node/prefer-global-console` も、eslint-plugin-n の `n/prefer-global/console` 相当の rule です。

# 例: prefer-global-console

`console` をグローバル変数として使うか、`console` module から import / require して使うかを揃える style rule です。

Node.js では `console` はグローバルにあります。

```ts
console.log("hello")
```

一方で、module として読み込む書き方もできます。

```ts
import console from "node:console"
console.log("hello")
```

# 何を揃える rule なのか

`"always"` と `"never"` の2モードがあります。

- `"always"`: グローバル `console` を使う
- `"never"`: `require("console")` / module import 側を使う
- デフォルトは `"always"`

TypeScript プロジェクトでは、多くの場合 `"always"` のほうが自然です。

# 設定例

`.oxlintrc.json` から有効化します。

```json
{
  "plugins": ["node"],
  "rules": {
    "node/prefer-global-console": ["warn", "always"]
  }
}
```

# `"always"` の例

グローバル `console` を使う設定です。

```ts
// NG
import console from "node:console"
console.log("hello")

// OK
console.log("hello")
```

CommonJS でも同じです。

```js
// NG
const console = require("console")
```

# 実装ポイント

module 経由の `console` を見つけます。

- 変数宣言を見る
  - `const console = require("console")`
  - `const console = require("node:console")`
- import 宣言を見る
  - `import console from "node:console"`
  - `import * as console from "node:console"`

# PR #23610 で追加されたもの

PR #23610 では `node/prefer-global-console` が追加されています。

- rule 本体、診断、検出ロジック、テストを実装する
  - `prefer_global_console.rs`
- rule を Oxlint の実行経路に登録する
  - `rules_enum.rs` / `rule_runner_impls.rs`
- `.oxlintrc.json` から設定できるようにする
  - `configuration_schema.json` / `config.generated.ts`

# 設定ファイル用の生成物

`.oxlintrc.json` から読めるようにする生成物です。

- 生成コマンド
  - `cargo lintgen && just linter-schema-json && just linter-config-ts`
- 生成されるもの
  - `config.generated.ts`: TS 側の rule 名と option 型
  - `configuration_schema.json`: JSON schema 側の rule 名と option 型

```ts
// apps/oxlint/src-js/package/config.generated.ts:1227
"node/prefer-global-console"?: RuleNoConfig | [
  AllowWarnDeny,
  PreferGlobalConsoleMode,
];

// npm/oxlint/configuration_schema.json:5758
"node/prefer-global-console": { ... }
```

# PR内容

`crates/oxc_linter/src/rules/node/prefer_global_console.rs:90-102`

- `Always` のときだけ module 経由の `console` を検出
- 前のページの「変数宣言」と「import 宣言」を分岐して見る

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

# テストと信頼性

PR本文の test plan では以下が実行されています。

- rule の pass / fail case を確認する
  - `cargo test -p oxc_linter --lib prefer_global_console`
- 生成物と設定schemaの更新漏れを確認する
  - `cargo lintgen && just linter-schema-json && just linter-config-ts && git diff --exit-code`
- formatting を確認する
  - `just fmt`

# まとめ

- eslint plugin rule 実装では、rule 本体だけを見れば終わりではない
- Oxlint の実行経路、設定ファイル、生成物までつなげる
- test plan では rule 挙動、生成物、formatting をまとめて確認する
