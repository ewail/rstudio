/*
 * sweave.js
 *
 * Copyright (C) 2009-12 by RStudio, Inc.
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */
define("mode/sweave", function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
var SweaveBackgroundHighlighter = require("mode/sweave_background_highlighter").SweaveBackgroundHighlighter;
var SweaveHighlightRules = require("mode/sweave_highlight_rules").SweaveHighlightRules;
var RCodeModel = require("mode/r_code_model").RCodeModel;
var RMatchingBraceOutdent = require("mode/r_matching_brace_outdent").RMatchingBraceOutdent;
var unicode = require("ace/unicode");
var Utils = require("mode/utils");

var Mode = function(suppressHighlighting, session) {
   if (suppressHighlighting)
      this.$tokenizer = new Tokenizer(new TextHighlightRules().getRules());
   else
      this.$tokenizer = new Tokenizer(new SweaveHighlightRules().getRules());

   this.codeModel = new RCodeModel(
      session,
      this.$tokenizer,
      /^r-/,
      /<<(.*?)>>/,
      /^\s*@\s*$/
   );
   
   this.foldingRules = this.codeModel;
   this.$sweaveBackgroundHighlighter = new SweaveBackgroundHighlighter(
         session,
         /^\s*\<\<.*\>\>=.*$/,
         /^\s*@(?:\s.*)?$/,
         false);
   this.$session = session;
};
oop.inherits(Mode, TextMode);

(function() {

   oop.implement(this, RMatchingBraceOutdent);

   this.tokenRe = new RegExp("^["
       + unicode.packages.L
       + unicode.packages.Mn + unicode.packages.Mc
       + unicode.packages.Nd
       + unicode.packages.Pc + "_]+", "g"
   );

   this.nonTokenRe = new RegExp("^(?:[^"
       + unicode.packages.L
       + unicode.packages.Mn + unicode.packages.Mc
       + unicode.packages.Nd
       + unicode.packages.Pc + "_]|\s])+", "g"
   );

   this.$complements = {
            "(": ")",
            "[": "]",
            '"': '"',
            "'": "'",
            "{": "}"
         };
   this.$reOpen = /^[(["'{]$/;
   this.$reClose = /^[)\]"'}]$/;

   this.insertChunkInfo = {
      value: "<<>>=\n\n@\n",
      position: {row: 0, column: 2}
   };

   this.getLanguageMode = function(position)
   {
      var state = Utils.getPrimaryState(this.$session, position.row);
      return state.match(/^r-/) ? 'R' : 'TeX';
   };

   this.getNextLineIndent = function(state, line, tab)
   {
      state = Utils.primaryState(state);
      return this.codeModel.getNextLineIndent(state, line, tab);
   };

   this.allowAutoInsert = this.smartAllowAutoInsert;

}).call(Mode.prototype);

exports.Mode = Mode;
});
