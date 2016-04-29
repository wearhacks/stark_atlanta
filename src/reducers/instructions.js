import {UPDATE_HTML_CODE} from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import Steps from 'rc-steps';
import _ from 'lodash';


const initialState = { 
title: "1.2 Creating Tables in HTML",
text: `Tables are defined with the \`<table>\` tag.
  1. Tables are divided into table rows with the \`<tr>\` tag. 
  2. Table rows are divided into table data with the  \`<td>\` tag.
  3. A table row can also be divided into table headings with the \`<th>\` tag.

  Tables are used for displaying tabular data: for example, a list of players in a team.
  They consist of <table> which contains <tr> tags for each (t)able (r)ow.
  Inside the rows you can either put a (t)able (h)eader (with <th>) or 
  (t)able (d)ata (with <td>).

  \`\`\`html
    <table class="ui table">
      <thead>
         <tr>
           <th>First Name</th>
           <th>Last Name</th>
           <th>Number</th>
        </tr>
      </thead>
      <tbody>
         <tr>
             <td>Tim</td>
             <td>Hardaway Jr.</td>
             <td>10</td>
         </tr>
         <tr>
             <td>Kirk</td>
             <td>Hinrich</td>
             <td>12</td>
         </tr>
      </tbody>
    </table>
  \`\`\`

  The code above translates into 

<table class="ui celled table">
  <thead>
     <tr>
       <th>First Name</th>
       <th>Last Name</th>
       <th>Number</th>
    </tr>
  </thead>
  <tbody>
     <tr>
         <td>Tim</td>
         <td>Hardaway Jr.</td>
         <td>10</td>
     </tr>
     <tr>
         <td>Kirk</td>
         <td>Hinrich</td>
         <td>12</td>
     </tr>
  </tbody>
</table>

  `,
    exercises: {
        type: "html",
        tasks: [
            {
                text: "Create a table element. It will contain transaction entries.", 
                passHtml: "<table></table>"
            },
            {
                text: "Create one row for the header.",
                passHtml: "<table><tr></tr></table>"
            },
            {
                text: "Create a header within the row you just created.",
                passHtml: "<table><tr><th></th></tr></table>"
            },
            {
                text: "Write \"Type\"within the header.",
                passHtml: "<table><tr><th></th><th>Type</th></tr></table>"
            },
            {
                text: "Create one for the type of the transaction (\"Description\") and a final one for the amount (\"Amount\").",
                passHtml: "<table><tr><th>Type</th><th>Description</th></tr></table>"
            },
            {
                text: "Create a final one for the amount (\"Amount\").",
                passHtml: "<table><tr><th>Type</th><th>Description</th><th>Amount</th></tr></table>"
            }
        ]
    },
    currentExercise:0,
    completed:false
  }
export default function instructionState(state = initialState, action) {
  let parser = new DOMParser();
  let userDom = parser.parseFromString(action.code, "text/html");
  let lastExercise = state.exercises.tasks.length;
  let nextExercise = findCurrentExercise(action.code, userDom, state.exercises.tasks);
  switch (action.type) {
    case UPDATE_HTML_CODE:
      return objectAssign({}, state, { 
        currentExercise: nextExercise,
        completed: nextExercise == lastExercise
       });
    default:
      return state;
  }
}


const compareNode = function(rawCode, enode, unode) {
  if(enode.children.length == 0) {

    if(unode.children.length > 0) {
      return (unode.tagName == enode.tagName );
    }
    else {
      //BASE CASE
      let a = (unode.innerHTML === undefined) ? "" : unode.innerHTML;
      let b = (enode.innerHTML === undefined) ? "" : enode.innerHTML;
      console.log('hello world');
      let regex = new RegExp(`(<${unode.nodeName.toLowerCase()})(.*)(>)(${(a.trim() === "") ? '[\\s\\S]*' : a})(</${unode.nodeName.toLowerCase()}>)`,"mi");
      return unode.tagName === enode.tagName && a.toLowerCase().includes(b.toLowerCase()) && rawCode.match(regex);
    }
  } 
  else { //expected node children > 0
    if (unode.children.length > 0) {
      let regex2 = new RegExp(`(<${unode.nodeName.toLowerCase()})(.*)(>)([\\s\\S]*)(</${unode.nodeName.toLowerCase()}>)`,"mi");
      
      let tagClosed = (rawCode.toLowerCase().includes(unode.nodeName.toLowerCase())) ? rawCode.match(regex2) : true;
      return tagClosed &&
        unode.tagName === enode.tagName &&
        _.every(enode.children, (ecnode) => 
        _.find(unode.children, (ucnode) => compareNode(rawCode, ecnode, ucnode)));
    }
    else {
      return false;
    }
  }
  
  

}
//Only checks one level
const domsAreEqual = function(rawCode, expectedDom, userDom) {
  return compareNode(rawCode, expectedDom.body,userDom.body);
}

const findCurrentExercise = function(rawCode, userDom, exercises) {
  let parser = new DOMParser();
  let currExercise = 0;
  _.each(exercises, (exercise, i) => {
    let expectedDom = parser.parseFromString(exercise.passHtml, "text/html");
    if (!domsAreEqual(rawCode, expectedDom, userDom)) {
      return false;
    }
    currExercise++;
  });
  return currExercise;

}














