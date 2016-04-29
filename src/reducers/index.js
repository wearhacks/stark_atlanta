import { combineReducers } from 'redux';
import fuelSavingsAppState from './fuelSavings';
import codeEditorState from './codeEditor';
import instructionState from './instructions';
const rootReducer = combineReducers({
  fuelSavingsAppState,
  codeEditorState,
  instructionState
});

export default rootReducer;