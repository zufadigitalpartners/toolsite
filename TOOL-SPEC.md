# How to get a tool made for Tools In Pocket

Hand this whole file to whoever is writing the tool, or paste it to an AI.
Everything it needs to know is here. What comes back should be three blocks
of code that you paste into Tina under **Tools → Create New → Tool code**.

---

## The brief to give them

> Write a small self-contained web tool as three separate blocks: HTML, CSS
> and JavaScript. It will be pasted into a CMS and run inside a sandboxed
> iframe on toolsinpocket.com. Follow every rule below exactly.
>
> **What the tool should do:** _(describe it here in one or two sentences)_
>
> ### Rules
>
> 1. **Three separate blocks.** Plain HTML with no `<html>`, `<head>`,
>    `<body>`, `<style>` or `<script>` tags. Plain CSS rules with no
>    `<style>` wrapper. Plain JavaScript with no `<script>` wrapper.
> 2. **Vanilla JavaScript only.** No React, no jQuery, no npm packages, and
>    no `<script src="...">` to a CDN. Everything must be in the one block.
> 3. **Nothing may leave the device.** No `fetch`, no XMLHttpRequest, no
>    uploads, no analytics. The whole promise of this site is that files and
>    text stay in the browser. (The only exception is a tool that genuinely
>    needs an online service, and that has to be switched on deliberately in
>    the CMS.)
> 4. **These are blocked and will throw if used:** `localStorage`,
>    `sessionStorage`, `indexedDB`, Web Workers, `navigator.clipboard`, and
>    the File System Access API. Do not use them, and do not write copy that
>    implies settings are remembered between visits.
> 5. **Use the helpers instead:**
>    - `WT.copy(text)` copies to the clipboard and returns true or false.
>    - `WT.resize()` tells the page the tool changed height. Call it after
>      anything that adds, removes or reveals content.
>    - `WT.config.apiKey` and `WT.config.apiBaseUrl` hold values typed into
>      the CMS, if the tool needs a service.
> 6. **No `position: fixed`, and no `vh` or `dvh` units.** The frame measures
>    its own height, so those fight the measurement and make the page jump.
>    Anything that must be a fixed size uses `aspect-ratio` plus
>    `overflow: hidden`.
> 7. **Do not style from scratch.** The site's own stylesheet is already
>    applied inside the frame. Use these class names and it will look native
>    with no CSS at all:
>
>    | Class | What it is |
>    |---|---|
>    | `.row` `.row-2` | one column / two column layout blocks |
>    | `<label><span>Name</span><input></label>` | a labelled field |
>    | `.btn-row` | the row of action buttons, draws its own divider |
>    | `.btn-primary` | the main action button |
>    | `.stats` and `.stat` with `.num` and `.label` | the row of result figures |
>    | `.out` | the dark monospace result box |
>    | `.note` | one line of quiet helper text |
>    | `.error` | a red error message |
>    | `.tabs` with `button.active` | mode switcher |
>
>    Only add CSS for things that genuinely have no class above, and prefix
>    those class names so they cannot collide.
> 8. **Mobile rules, not optional.** Every `input`, `select` and `textarea`
>    must be `font-size: 16px` or larger, otherwise iOS zooms the page when
>    someone taps it. Every button must be at least 44px tall. Nothing may
>    overflow sideways at 375px wide.
> 9. **Handle failure out loud.** Empty input, wrong file type, a file that
>    cannot be read, a number where text was expected. Say what went wrong in
>    plain language in a `.error` or `.note`, and keep the rest working.
> 10. **No em dashes anywhere**, in code comments or in visible text.
>
> ### Return format
>
> Three fenced code blocks, labelled HTML, CSS and JS, in that order, and
> nothing else. If CSS is not needed, return an empty CSS block.

---

## What you do with it

1. In Tina, go to **Tools → Create New**.
2. The form arrives already filled in with a small working tool. That is
   there so you can see the shape; replace it.
3. Set the filename. It becomes the address, so `pdf-splitter` gives you
   `/tools/pdf-splitter/`.
4. Paste the three blocks into **Tool code → HTML / CSS / JavaScript**.
5. Pick a **Category** and an **Icon**.
6. Fill in **Short description**, **SEO meta**, and **Page content**. The
   content is what brings people from Google, so it is worth the time. Aim
   for 700 words or more across the intro, how-to, why, who and FAQs.
7. Save. The site rebuilds itself and the tool is live in a few minutes.

## If a tool needs an online service

Most should not. If one genuinely does:

- Turn on **This tool calls an API** in Tool code.
- Fill in **Which API**, **API docs link** and **Free limits** so you can
  see later what each tool depends on.
- Put the key in **API key** and read it in the code as `WT.config.apiKey`.

One warning worth repeating: that key is published in the page source and
anyone can read it. Only ever use a key that the provider lets you lock to
your own domain, and never a secret or billing key.

## Checking it worked

Open the tool's page and try it, including the awkward cases: empty input, a
huge input, the wrong kind of file. Then look at it on a phone. If the panel
grows and shrinks oddly as you type, the tool is missing a `WT.resize()`
call somewhere.
