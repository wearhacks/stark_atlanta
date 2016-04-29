import React, {PropTypes} from 'react';
import FuelSavingsResults from './FuelSavingsResults';
import FuelSavingsTextInput from './FuelSavingsTextInput';
import CodeBlock from './CodeBlock';
import Steps from 'rc-steps';
import '../../node_modules/rc-steps/assets/index.css';
import Markdown from 'react-markdown';   
import _ from 'lodash';
// Destrucuring props for brevity below.
const Instruction = ({appState}) => {
  return (
    <div>
      <h1 className="title aligned center">{appState.title}</h1>
      
        <h4 className="ui horizontal divider header">
          Instructions
        </h4>
        
        <div className="overflow-container">
          <div className="instruction ui segment">
            <Markdown source={appState.text} renderers={{CodeBlock: CodeBlock}} />
          </div>
        </div>

        <h4 className="ui horizontal divider header">
          Exercises
        </h4>
        <Steps current={appState.currentExercise}>
        {
          appState.exercises.tasks.map((exercise,i) => {
            return <Steps.Step title="" />
          })
        }
        </Steps>

        {
          appState.exercises.tasks.map((exercise,i ) => {
            if (i == appState.currentExercise)
              return <div className="ui segment current">{exercise.text}</div>

          })
        }
        { appState.completed ? <h1 className="ui header teal">Completed!</h1> : null}

    </div>
  );
};

Instruction.propTypes = {
  appState: PropTypes.object.isRequired
};

export default Instruction;
