---
id: 0
title: "Markdown チートシート"
writeDate: "2025-05-27"
hidden : true
tags:
  - Markdown
  - Cheatsheet
---

# Markdown チートシート

---

## 見出し (Heading)

```markdown
# 見出し1 (H1)
## 見出し2 (H2)
### 見出し3 (H3)
#### 見出し4 (H4)
##### 見出し5 (H5)
###### 見出し6 (H6)

太字
**太字テキスト**
__太字テキスト__

斜体
*斜体テキスト*
_斜体テキスト_

太字+斜体
***太字斜体***
___太字斜体___

取り消し線
~~取り消し線~~

箇条書き(Unordered list)
- リスト項目1
* リスト項目2
+ リスト項目3

- ネスト
  - 子リスト1
  - 子リスト2

番号付きリスト (Ordered list)
1. 項目1
2. 項目2
   1. 子項目a
   2. 子項目b
3. 項目3

チェックリスト(Task list)
- [ ] 未完了タスク
- [x] 完了タスク

引用(Blockquote)
> これは引用です。
> 複数行もOK。

水平線(Horizontal rule)
---
***
___

リンク・画像
リンク
[表示テキスト](https://example.com)

自動リンク
<https://example.com>

画像
![代替テキスト](https://example.com/image.png)

テーブル
| 左寄せ   | 中央寄せ  | 右寄せ   |
| :------- | :-------: | -------: |
| セル1    | セル2     | セル3    |
| 長いテキストも自動折返し |

詳細表示/折り畳み
<details>
  <summary>クリックして展開</summary>
  
  隠しコンテンツをここに書く
</details>

絵文字
GitHub 形式で :smile: :+1: :heart: など

コード
インラインコード
`const x = 1;`

コードブロック (言語指定可)
```js
function sayHi() {
  console.log("Hello!");
}
```