# Visual Indentation for Atom

Prefer 2-spaced, 3-spaced, 4-spaced or 42-spaced code layouts? Working on code (maybe at work, or open source) with a different indentation that you can't / shouldn't change?

`visual-indent` lets you set your preferred _visual_ indent width, and work in it without changing the physical indentation in a file. Indentation markers get a dynamically calculated width based on the indentation settings of the file.

Have your indentation :cake:, and eat it too!

:warning: `visual-indent` is rough around the edges and thus unreleased. It currently has a 10% black opacity background that shows for all resized indents for clarity on when resizing is occurring.

There are some performance impacts for the way I'm approaching things here, as it uses undocumented Atom APIs. If you have Atom plugin development knowledge and know how to help, PRs/discussion is welcome!

### Alternative

A more blunt solution is to simply inject this into your Atom config `styles.less`

```css
[data-grammar="source elm"] .leading-whitespace {
  font-size: 50%
}
```

Here I'm fixing to 50% for Elm as I use `elm-format` which I know will also be 4-spaced, and I want to see a visual width of 2-spaces when I code.

### Install

`apm install supermario/visual-indent`

Note: you may find [`auto-detect-indentation`](https://atom.io/packages/auto-detect-indentation) with "Show spacing in status bar" enabled to be useful if you frequently swap between indentation sizings.

### Settings

![visual-indent configuration screenshot](screenshot-config.png)
