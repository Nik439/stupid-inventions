import React, {Component} from 'react';
import Wait from './WaitComponent';

class Drawing extends Component {
  constructor (props) {
    super();

    this.state = {
      submitInvention: props.submitInvention,
      name: '',
      nameCount: 0,
      context: null,
      paint: false,
      clickX: [],
      clickY: [],
      clickDrag: [],
      orignialDiff: 1,
    };

    this.addClick = this.addClick.bind(this);
    this.draw = this.draw.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUpLeave = this.onMouseUpLeave.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount () {    
    let context = document.getElementById('canvas').getContext('2d');
    context.lineJoin = 'round';
    context.lineWidth = 5;

    this.setState({
      context: context,
      orignialDiff: 500 / document.getElementById('canvas').offsetWidth,
    });

    document.getElementById('canvas').addEventListener('mousedown', this.onMouseDown);
    document.getElementById('canvas').addEventListener('touchstart', this.onTouchStart);

    document.getElementById('canvas').addEventListener('mousemove', this.onMouseMove);
    document.getElementById('canvas').addEventListener('touchmove', this.onTouchMove);

    document.getElementById('canvas').addEventListener('mouseup', this.onMouseUpLeave);

    document.getElementById('canvas').addEventListener('mouseleave', this.onMouseUpLeave);

    document.getElementById('canvas').addEventListener('touchend', this.onMouseUpLeave);

    document.getElementById('canvas').addEventListener('touchleave', this.onMouseUpLeave);

    window.addEventListener('resize', this.onResize);
  }

  onMouseDown (e) {
    console.log('down');
    this.setState({paint: true});
    this.addClick(e.pageX - document.getElementById('canvas').offsetLeft, e.pageY - document.getElementById('canvas').offsetTop, false);
    this.draw();
  }

  onTouchStart (e) {
    console.log('touch_start', e);
    this.setState({paint: true});
    this.addClick(e.touches[0].pageX - document.getElementById('canvas').offsetLeft, e.touches[0].pageY - document.getElementById('canvas').offsetTop, false);
    this.draw();
  }

  onMouseMove (e) {
    console.log('mouse_move', e);
    if (this.state.paint) {
      this.addClick(e.pageX - document.getElementById('canvas').offsetLeft, e.pageY - document.getElementById('canvas').offsetTop, true);
      this.draw();
    }
  }

  onTouchMove (e) {
    e.preventDefault();
    console.log('touch_move', e);
    if (this.state.paint) {
      this.addClick(e.touches[0].pageX - document.getElementById('canvas').offsetLeft, e.touches[0].pageY - document.getElementById('canvas').offsetTop, true);
      this.draw();
    }
  }

  onMouseUpLeave () {
    console.log('up-leave');
    this.setState({paint: false});
  }

  onResize () {
    this.setState({
      orignialDiff: 500 / document.getElementById('canvas').offsetWidth
    });
  }

  componentWillUnmount () {
    document.getElementById('canvas').removeEventListener('mousedown', this.onMouseDown);

    document.getElementById('canvas').removeEventListener('mousemove', this.onMouseMove);

    document.getElementById('canvas').removeEventListener('touchmove', this.onTouchMove);

    document.getElementById('canvas').removeEventListener('mouseup', this.onMouseUpLeave);

    document.getElementById('canvas').removeEventListener('mouseleave', this.onMouseUpLeave);

    window.removeEventListener('resize', this.onResize);
  }

  addClick (x, y, dragging) {
    this.setState(prevState => ({
      clickX: [...prevState.clickX, x*this.state.orignialDiff],
      clickY: [...prevState.clickY, y*this.state.orignialDiff],
      clickDrag: [...prevState.clickDrag, dragging]
    }));
  }

  changeColor (color, e) {
    this.setState(prevState => ({
      context: Object.assign(prevState.context, {strokeStyle: color}),
    }));
    document.querySelector('.active-color').classList.remove('active-color');
    e.target.classList.add('active-color');
  }

  draw () {
    let i = this.state.clickX.length-1;
    this.state.context.beginPath();
    if (this.state.clickDrag[i] && i) {
      this.state.context.moveTo(this.state.clickX[i-1], this.state.clickY[i-1]);
    } else {
      this.state.context.moveTo(this.state.clickX[i]-1, this.state.clickY[i]);
    }
    this.state.context.lineTo(this.state.clickX[i], this.state.clickY[i]);
    this.state.context.closePath();
    this.state.context.stroke();
  }

  handleSubmit () {
    if (this.state.name !== '') {
      let url = document.getElementById('canvas').toDataURL('image/png');
      let drwProps = {
        name: this.state.name,
        url: url
      };
      this.state.submitInvention(drwProps);
    }
  }

  render () {
    return (
      <div className='drawing'>
        <div className='drawing-container'>
          <label htmlFor='name' className='drawing-label'>Invention Name</label>
          <div className='drawing-inputs'>
            <label className='drawing-name-count'>{this.state.nameCount}/50</label>
            <input name='name' className='drawing-name' maxLength='50' onChange={e=>this.setState({name: e.target.value, nameCount: e.target.value.length})} autoComplete='off' type='text' placeholder=''></input>
            <input className='drawing-submit' onClick={this.handleSubmit} type='button' value='SUBMIT'></input>
          </div>
          <div className='drawing-space'>
            <canvas id='canvas' className='canvas' width='500' height='500'></canvas>
            <div className='drawing-colors'>
              <div className='color black active-color' onClick={(e) => this.changeColor('#000', e)}></div>
              <div className='color red' onClick={(e) => this.changeColor('#df4b26', e)}></div>
              <div className='color green' onClick={(e) => this.changeColor('#228622' ,e)}></div>
              <div className='color blue' onClick={(e) => this.changeColor('#3a68cc', e)}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Drawing;
