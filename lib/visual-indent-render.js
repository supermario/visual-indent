'use babel';

import map from 'lodash/map';

const removePaint = (textEditor) => {
  const decorations = textEditor.getDecorations({
    type: 'text',
    class: 'visual-indent',
  });
  decorations.forEach(decoration => decoration.marker.destroy());
};

const paintTextEditorLine = (textEditor, { tabLength, line, preferredIndentWidth }) => {
  const lineIndentation = textEditor.indentationForBufferRow(line);
  const indentationLimit = lineIndentation * tabLength;

  if (preferredIndentWidth == tabLength) { return; }
  const markerWidth = (preferredIndentWidth / tabLength) * (textEditor.defaultCharWidth * tabLength);

  for (
    let indentation = 0, counter = 0;
    indentation < indentationLimit;
    indentation += tabLength, counter += 1
  ) {
    const initialPoint = [line, indentation];
    const finalPoint = [line, (indentation + tabLength)];
    const range = [initialPoint, finalPoint];

    const rangeText = textEditor.getTextInBufferRange(range);
    const marker = textEditor.markBufferRange(range);

    // Skip lines that aren't purely whitespace
    if (rangeText.match(/^\s+$/) == null) { continue; }

    try {
      textEditor.decorateMarker(marker, {
        type: 'text',
        class: 'visual-indent',
        style: {
          backgroundColor: '#21252b',
          width: markerWidth + 'px',
          display: 'inline-block'
        },
      });
    } catch (e) {
      console.log('e', e);
    }
  }
};

const readTextEditorLines = (textEditor, { tabLength, numberOfLines, preferredIndentWidth }) => {
  for (let line = 0; line < numberOfLines; line += 1) {
    paintTextEditorLine(textEditor, { tabLength, line, preferredIndentWidth });
  }
};

const paintTextEditor = (preferredIndentWidth, textEditor) => {
  const tabLength = textEditor.getTabLength();
  const numberOfLines = textEditor.getLineCount();

  readTextEditorLines(textEditor, { tabLength, numberOfLines, preferredIndentWidth });
};

const removePaintFromRange = (textEditor, range) => {
  const markers = textEditor.findMarkers({
    startBufferRow: range.start.row,
    endBufferRow: range.end.row,
  });
  markers.forEach(marker => marker.destroy());
};

const paintMultipleLines = (textEditor, {
  tabLength,
  fromLine,
  toLine,
  preferredIndentWidth,
}) => {
  for (let line = fromLine; line <= toLine; line += 1) {
    paintTextEditorLine(textEditor, { tabLength, line, preferredIndentWidth });
  }
};

export const onTextDidChange = (textEditor, preferredIndentWidth, changes) => {
  const tabLength = textEditor.getTabLength();
  return map(changes.changes, (change) => {
    removePaintFromRange(textEditor, change.newRange);

    const fromLine = change.newRange.start.row;
    const toLine = change.newRange.end.row;

    if (fromLine === toLine) {
      paintTextEditorLine(textEditor, {
        tabLength,
        line: fromLine,
        preferredIndentWidth,
      });
    } else {
      paintMultipleLines(textEditor, {
        tabLength,
        fromLine,
        toLine,
        preferredIndentWidth,
      });
    }
  });
};

export const paint = (atom, preferredIndentWidth) =>
  atom.workspace.getTextEditors().forEach(function(textEditor) { paintTextEditor(preferredIndentWidth, textEditor) });

export const clear = atom => atom.workspace.getTextEditors().forEach(removePaint);
