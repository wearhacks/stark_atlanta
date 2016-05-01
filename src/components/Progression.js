import React, {PropTypes} from 'react';
import CodeBlock from './CodeBlock';
import _ from 'lodash';
import '../styles/progression.scss';
// Destrucuring props for brevity below.
class Progression extends React.Component {

  componentDidMount() {
    $('.progression-step').progress();
    
  }

  componentDidUpdate() {
    this.props.chapters.map((chapter, i) => {
      console.log(`#progress-${i}`);
      let percentage =  this.getPercentage(chapter,i);
      console.log(this.getPercentage(chapter,i));
      $(`#progress-${i}`).progress({percent: percentage});
    });
  }

  getPercentage(chapter, index) {

    let {chapters, currentChapter, currentExercise } = this.props;
    let percentage = 0;
    if(chapter.type == "instruction") {
      percentage = (index < currentChapter) ? 100 : 0;
    }
    else if(index < currentChapter){
      percentage = 100
    }
    else if(index == currentChapter){
      percentage = (currentExercise / chapter.exercises.length) * 100;
    }
    return percentage;
  }

  render () {
      let chapters = this.props.chapters;


      return (
        <div id="progression" data-chapter={this.props.currentChapter} data-exercise={this.props.currentExercise}>
            {chapters.map((chapter, i) => {
              return  <div key={i} id={'progress-'+i}  className="ui indicating progress progression-step">
                  <div className="bar"></div>
                  <div className="label">{chapter.title}</div>
                </div>
              
              
            })}
            
        </div>
      );
  }

}

Progression.propTypes = {
  chapters: PropTypes.object.isRequired,
  currentChapter: PropTypes.number.isRequired,
  currentExercise: PropTypes.number.isRequired
};

export default Progression;
