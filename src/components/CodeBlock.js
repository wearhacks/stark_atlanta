import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
class CodeBlock extends React.Component {
    componentDidMount() {
        this.highlightCode();
        let cm = this.cm.getCode
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    highlightCode() {
        //hljs.highlightBlock(this.refs.code);
    }
    
    render() {
        let options = {
            lineNumbers: false,
            mode: `text/${this.props.language}`,
            readOnly: true
        };  
        return (
             <Codemirror ref={(ref) => this.cm = ref} value={this.props.literal}  options={options} />
        );
    }
}

CodeBlock.propTypes = {
  language: PropTypes.string,
  literal: PropTypes.string
};
export default CodeBlock;
