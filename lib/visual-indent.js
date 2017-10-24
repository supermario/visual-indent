'use babel';

import { CompositeDisposable } from 'atom';
import { paint, clear, onTextDidChange } from './visual-indent-render';

export default {

  subscriptions: null,

  config: {
    preferredIndentWidth: {
      type: 'integer',
      default: 2,
      description: 'Indent width will be visually adjusted to this width in files that have a different indentation depth'
    },
  },

  initialize() {
    this.startSubscriptions();
    this.activate();
  },

  activate() {
    const preferredIndentWidth = atom.config.get('visual-indent.preferredIndentWidth');
    paint(atom, preferredIndentWidth);

    this.subscribeToTextChange(preferredIndentWidth);
    this.subscribeToFileOpen(preferredIndentWidth);
    this.subscribeToConfigurationChange();
  },

  deactivate() {
    this.subscriptions.dispose();
    clear(atom);
  },

  startSubscriptions() {
    this.subscriptions = new CompositeDisposable();
  },

  subscribeToTextChange(preferredIndentWidth) {
    this.subscriptions.add(atom.workspace.observeTextEditors(textEditor =>
      this.subscriptions.add(
        textEditor.buffer.onDidChangeText(function(changes) {
          onTextDidChange(textEditor, preferredIndentWidth, changes)
        }),
      ),
    ));
  },

  subscribeToFileOpen(preferredIndentWidth) {
    atom.workspace.onDidOpen(function() {
      paint(atom, preferredIndentWidth);
    });
  },

  subscribeToConfigurationChange() {
    this.subscriptions.add(atom.config.onDidChange('visual-indent.preferredIndentWidth', {}, (event) => {
      const newPreferredIndentWidth = event.newValue;

      this.subscriptions.dispose();

      this.startSubscriptions();

      clear(atom);
      paint(atom, newPreferredIndentWidth);

      this.subscribeToTextChange(newPreferredIndentWidth);
      this.subscribeToFileOpen(newPreferredIndentWidth);
      this.subscribeToConfigurationChange();
    }));
  }
};
