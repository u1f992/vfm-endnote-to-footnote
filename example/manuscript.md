VFM[^vfm-version]で採用されている`[^n]`記法の脚注は、いわゆる章末脚注（Endnote）です。この形式では、以下の通りファイル内のすべてのコンテンツの後に注釈が列挙されます。

[^vfm-version]: 執筆時点（v2.2.1）。

```html
<p>
  VFM<a id="fnref1" href="#fn1" class="footnote-ref" role="doc-noteref"
    ><sup>1</sup></a
  >で採用されている<code>[^n]</code>記法の脚注は、いわゆる章末脚注（Endnote）です。
</p>

<section class="footnotes" role="doc-endnotes">
  <hr />
  <ol>
    <li id="fn1" role="doc-endnote">
      執筆時点（v2.2.1）。<a
        href="#fnref1"
        class="footnote-back"
        role="doc-backlink"
        >↩</a
      >
    </li>
  </ol>
</section>
```

一方、書籍ではページ末脚注が多用されます。単に「脚注」といった場合、こちらをイメージすることが多いのではないでしょうか。ページ末脚注はVFMの機能ではなく、Markdown原稿内にHTMLで`<span style="float: footnote;"> ... </span>`と、CSSで`::footnote-marker`・`::footnote-call`を記述することで実現します[^css-footnote]。

[^css-footnote]: CSS Generated Content for Paged Media Module, &sect;2. Footnotes, https://www.w3.org/TR/css-gcpm-3/#footnotes

章末脚注とページ末脚注の両方を使用できる現在の仕様には、十分な納得感があります。しかし、実用上いくつかの問題が発生していました。

- 著者にMarkdown原稿を依頼すると、ほぼ間違いなく`[^n]`記法で記述されている
- `span`直接入力では、GitHub上のMarkdownプレビューが簡易組版見本として機能しなくなる
- 文末の脚注において、脚注内にも句点を打つためには「`<span> ...。</span>。`」とする必要があり、ミスが発生しやすい

これらの問題を解消するため、rehypeプラグインで`[^n]`記法を`<span class=" ... ">`に置き換えることを目指します。
