import { execSync } from 'child_process'
import {
  TextEdit,
  languages,
  window,
  workspace
} from 'vscode'

export function activate() {
  languages.registerDocumentRangeFormattingEditProvider("nix", {
    provideDocumentRangeFormattingEdits(document, range) {
      const text = document.getText(range);
      try {
        const config = workspace.getConfiguration("nixfmt");
        const nixfmt = execSync(config.path, { input: text });
        const formattedText = nixfmt.toString();
        return [TextEdit.replace(range, formattedText)];
      } catch (e) {
        window.showErrorMessage(
          "nixfmt failed to format the code. " + e.stderr.toString()
        );
        console.log(e.stdout.toString());
      }
    }
  });
}
