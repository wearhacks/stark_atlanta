import React, {PropTypes} from 'react';
import FuelSavingsResults from './FuelSavingsResults';
import FuelSavingsTextInput from './FuelSavingsTextInput';
import CodeBlock from './CodeBlock';
import Steps from 'rc-steps';
import '../../node_modules/rc-steps/assets/index.css';
import Markdown from 'react-markdown';   
import _ from 'lodash';
// Destrucuring props for brevity below.
class Instruction extends React.Component {

  componentDidUpdate() {

  }

  render () {
      let isInstruction = this.props.chapter.type == "instruction";
      let chapter = this.props.chapter;
      let completed = this.props.completed;
      let currentExercise = this.props.currentExercise;

      let getExerciseItem = (exercise, i)=>{
        if (i < currentExercise)
          return <div className="ui segment current basic disabled">
                  <i className="ui icon check teal circle"></i> {exercise.text} </div>
        if (i == currentExercise)
          return (
            <div 
            ref={(ref) => this.currentExercise = ref} 
            className="ui  segment basic  current ">
              <i className="ui icon teal circle"/>
              {exercise.text}
            </div>)
        if (i > currentExercise)
          return (
            <div className="ui segment basic  disabled">
              <i className="ui icon teal circle"/>
              {exercise.text}
            </div>)
      }

      let completedButton, exercises;
      if(!completed) {
          completedButton = <div className="ui button basic" onClick={this.props.actions.nextChapter}>Continue</div>;
      }
      else {
          completedButton = <div className="ui button basic disabled" onClick={this.props.actions.nextChapter}>Continue</div>;
      }

      if(!isInstruction) {
        if(currentExercise !== chapter.exercises.length)
          completedButton = "";
        
        exercises = (
                <div className="exercises">
                <h2 className="ui horizontal divider header">
                  <i className="bar pencil icon"></i>
                    Exercises
                </h2>
                <div className="ui segment basic" >
                {
                    chapter.exercises.map((exercise,i) => {
                      return getExerciseItem(exercise,i);
                    })
                }
                </div></div>)

      }
      
      
      return (
        <div><div className="instruction" id={'chapter-' + this.props.chapterID}>
              <h1>{chapter.title}</h1>
              <Markdown source={chapter.text} renderers={{CodeBlock: CodeBlock}} />
              {exercises}
              {completedButton}
            </div>
        </div>)
      }

}

Instruction.propTypes = {
  chapterID: PropTypes.number.isRequired,
  chapter: PropTypes.object.isRequired,
  currentExercise: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

export default Instruction;
