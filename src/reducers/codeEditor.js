import {UPDATE_HTML_CODE, UPDATE_CSS_CODE} from '../constants/ActionTypes';
import calculator from '../businessLogic/fuelSavingsCalculator';
import dateHelper from '../businessLogic/dateHelper';
import objectAssign from 'object-assign';

const initialState = {
  htmlCode : 
`<!DOCTYPE html>
 <html>
   <body>
     <p>Hello world!</p> 
   </body>
 </html>`,
  cssCode: "\n\n\n\n\n\n\n\n\n\n"
};

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
//Note that I'm using Object.assign to create a copy of current state
//and update values on the copy.
export default function codeEditorState(state = initialState, action) {
  switch (action.type) {
    case UPDATE_HTML_CODE:
      return objectAssign({}, state, { htmlCode: action.code });
    case UPDATE_CSS_CODE:
      return objectAssign({}, state, { cssCode: action.code });

    default:
      return state;
  }
}
