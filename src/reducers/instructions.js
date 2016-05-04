import {UPDATE_HTML_CODE, NEXT_CHAPTER} from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import _ from 'lodash';


const initialState = {
    currentChapter:0,
    currentExercise:0,
    completedModule:false,
    chapters:[
{
    type: "instruction",
    title: "HTML Reloaded",
    text: "Recall: the purpose of HTML is to describe what should be rendered by the browser.\nThe easiest way to make an HTML page that we can view at our browser is to create a\nfile that contains HTML code and open it with the browser. We will have you writing some\nHTML shortly *right here* though!"
},
{
    type: "instruction",
    title: "Hello World!",
    text: `Some programming traditions are **not** to be taken lightly... let alone being broken. 
           Writing code that ends up in "Hello world" being displayed on your screen is one of them.
           Here is a version of "Hello World" in HTML:

 \`\`\`html
 <!DOCTYPE html>
 <html>
     <body>
         <p>Hello world!</p> 
     </body>
 </html>
 \`\`\`

 `
},
{
    type: "instruction",
    title: "Hello World Explained",
    text: `Whoah! Let's see what's going on there:\n\n
 1. We are telling the browser that this file's (*doc*ument's) content type is HTML: <!DOCTYPE html>
    If it helps, remember document + type = doctype!
 2. As if the doctype was not enough, we also have an HTML *tag/element*: <html>...</html>
    All content and annotative data goes in there.
 3. Next, we define the *body* of the document. Why a body? Because in HTML pages there is also
    a head as we will see later.
 4. Finally, for the actual content, we define a paragraph inside <body> using the <p> tag. 
    It contains the text which will be displayed.`
},
{ 
title: "1.2 Creating Tables in HTML",
type: "exercise",
text: `

Tables are defined with the \`<table>\` tag.
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
    exercises: [
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
  }]
};
export default function instructionState(state = initialState, action) {

  let currentChapter = state.chapters[state.currentChapter];
  let lastExercise = (currentChapter.type == "instruction") ? 0 : currentChapter.exercises.length;
      
  switch (action.type) {
    case NEXT_CHAPTER:
    {
      let completedChapter = (lastExercise == state.currentExercise);
      let completedModule = (state.chapters.length == state.currentChapter);
      let currentChapterIndex = (completedChapter && !completedModule) ? (state.currentChapter + 1) : state.currentChapter;
      let currExercise = (completedChapter && !completedModule) ? 0 : state.currExercise;
      
      return objectAssign({}, state, { 
        completedModule: completedModule,
        currentChapter: currentChapterIndex,
        currentExercise: 0
       });
    }

    case UPDATE_HTML_CODE:
    {
      let parser = new DOMParser();
      let userDom = parser.parseFromString(action.code, "text/html");
      let nextExercise = findCurrentExercise(action.code, 
        userDom, currentChapter.exercises);

      return objectAssign({}, state, { 
        currentExercise: nextExercise,
        completed: nextExercise == lastExercise
       });
  
    }
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














