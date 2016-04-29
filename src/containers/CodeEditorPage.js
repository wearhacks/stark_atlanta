import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
/*import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/lint/html-lint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';*/
window.$ = $;
window.jQuery = $;
import '../../node_modules/semantic-ui/dist/semantic.min.js';
import * as actions from '../actions/codeEditActions';
import Instruction from '../components/Instruction';


export class CodeEditorPage extends Component {
  componentDidMount() {
    $('.menu .item').tab();
    this.refreshResult();
    let self = this;
    this.htmlEditor.getCodeMirror().on('cursorActivity', () => self.refreshResult())
    let cm = this.htmlEditor.getCodeMirror();
    cm.markText({line:0, ch:0}, {line:2, ch:0}, {readOnly:true});
    cm.markText({line:4, ch:0}, {line:5, ch:0}, {readOnly:true});
    cm.refresh();

    let css_cm = this.cssEditor.getCodeMirror();
    setTimeout(() => {
        cm.refresh();
        css_cm.refresh();
    },1);
    [0,1,2,4,5].forEach((i) => cm.addLineClass(i, 'text', 'readonly'));
  }
  updateHTMLCode(newCode) {
    this.props.actions.saveHTMLCodeEdits(newCode);
  }
  updateCSSCode(newCode) {
    this.props.actions.saveCSSCodeEdits(newCode);

    this.cssEditor.getCodeMirror().refresh();
    this.iframe.contentWindow.postMessage(newCode, 'http://localhost:3000');
  }
  refreshResult() {
   let cm = this.htmlEditor.getCodeMirror();
   let doc = cm.getDoc().copy();
   let cursor = cm.getDoc().getCursor(); // gets the line number in the cursor position
   let line = cm.getDoc().getLine(cursor.line); // get the line contents
   let pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: cursor.ch // set the character position to the end of the line
    }
   doc.replaceRange('<span id="cursor-pos-dynamic"></span>', pos); // adds a new line
   //this.props.actions.saveCodeEdits(cm.getDoc().getValue());
   this.iframe.contentWindow.postMessage(doc.getValue(), 'http://localhost:3000');
  }
  
  render() {
    let options = {
        lineNumbers: true,
        mode: "text/html"
    };  
    let optionsCss = {
        lineNumbers: true,
        mode: "text/css",
        fixedGutter: true
    };  
    return (
      <div className="ui grid celled">
        <div id="instructions" className="seven wide column">
          <Instruction appState={this.props.instructions} />
        </div>

        <div id="editor" className="nine wide column">
          <h5>Code Editor</h5>
          <div className="ui top attached tabular menu">
            <a className="active item" data-tab="first">index.html</a>
            <a className="item" data-tab="second">style.css</a>
            <a className="item" data-tab="third">script.js</a>
          </div>
          <div className="ui bottom attached active tab segment" data-tab="first">
            <Codemirror ref={(ref) => this.htmlEditor = ref} value={this.props.appState.htmlCode} onChange={this.updateHTMLCode.bind(this)} options={options} />
          </div>
          <div className="ui bottom attached tab segment" data-tab="second">
            <Codemirror ref={(ref) => this.cssEditor = ref} value={this.props.appState.cssCode} onChange={this.updateCSSCode.bind(this)}  options={optionsCss} />
          </div>
          
          <h5>Preview</h5>
          <div className="code-preview">
            <iframe ref={(ref) => this.iframe = ref} id="code-result" src="render.html" allow-same-origin allow-scripts frameborder="0"></iframe>
          </div>
          
        </div>
      </div>
    );
  }
}

CodeEditorPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  instructions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    appState: state.codeEditorState,
    instructions: state.instructionState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeEditorPage);