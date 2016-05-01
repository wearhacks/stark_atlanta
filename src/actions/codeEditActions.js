import {UPDATE_HTML_CODE, UPDATE_CSS_CODE} from '../constants/ActionTypes';

export function saveHTMLCodeEdits(newCode) {
  return { type: UPDATE_HTML_CODE, code: newCode };
}

export function saveCSSCodeEdits(newCode) {
  return { type: UPDATE_CSS_CODE, code: newCode };
}

