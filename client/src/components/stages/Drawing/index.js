import React, {useRef, useState} from 'react';
import useTimer from '../../../hooks/timer';
import Canvas from '../../canvas';
import Button from '../../ui/Button';
import TextInput from '../../ui/TextInput';
import './styles.css';

function Drawing({submitInvention}) {
  const [name, setName] = useState('');

  const ref = useRef(null);

  const timer = useTimer(60000, () => {
    if (!name) {
      setName('artwork');
    }

    handleSubmit();
  });

  const handleSubmit = () => {
    if (name !== '') {
      let url = ref.current.toDataURL('image/png');

      let drwProps = {
        name,
        url,
      };

      submitInvention(drwProps);
    }
  };

  return (
    <div className="drawing-container">
      <label htmlFor="name" className="drawing-label">
        Time Remaining: {Math.ceil(timer / 1000)}
      </label>
      <label htmlFor="name" className="drawing-label">
        Invention Name
      </label>
      <div className="drawing-inputs">
        <label className="drawing-name-count">{name.length}/50</label>
        <TextInput
          name="name"
          maxLength="50"
          onChange={e => setName(e.target.value)}
          autoComplete="off"
          type="text"
          placeholder=""
        />
        <Button
          disabled={!name}
          onClick={handleSubmit}
          type="button"
          value="SUBMIT"
        />
      </div>
      <Canvas refProp={ref} />
    </div>
  );
}

// class Drawing extends Component {
//   constructor(props) {
//     super();

//     this.state = {
//       submitInvention: props.submitInvention,
//       name: '',
//       nameCount: 0,
//       timeout: null,
//       interval: null,
//       timeRemaining: 60000,
//     };

//     this.addClick = this.addClick.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.onTimeoutEnd = this.onTimeoutEnd.bind(this);
//   }

//   componentDidMount() {
//     const timeout = setTimeout(() => {
//       this.onTimeoutEnd();
//     }, 60000);

//     const interval = setInterval(() => {
//       this.setState({timeRemaining: this.state.timeRemaining - 1000});
//     }, 1000);

//     this.setState({timeout, interval});
//   }

//   onTimeoutEnd() {
//     if (!this.state.name) {
//       this.setState({name: 'artwork'});
//     }
//     this.handleSubmit();
//   }
//   componentWillUnmount() {
//     clearTimeout(this.state.timeout);
//     clearInterval(this.state.interval);
//   }

//   handleSubmit() {
//     if (this.state.name !== '') {
//       let url = document.getElementById('canvas').toDataURL('image/png');
//       let drwProps = {
//         name: this.state.name,
//         url: url,
//       };
//       this.state.submitInvention(drwProps);
//     }
//   }

//   render() {
//     return (
//       <div className="drawing-container">
//         <label htmlFor="name" className="drawing-label">
//           Time Remaining: {Math.ceil(this.state.timeRemaining / 1000)}
//         </label>
//         <label htmlFor="name" className="drawing-label">
//           Invention Name
//         </label>
//         <div className="drawing-inputs">
//           <label className="drawing-name-count">
//             {this.state.nameCount}/50
//           </label>
//           <TextInput
//             name="name"
//             maxLength="50"
//             onChange={e =>
//               this.setState({
//                 name: e.target.value,
//                 nameCount: e.target.value.length,
//               })
//             }
//             autoComplete="off"
//             type="text"
//             placeholder=""
//           />
//           <Button
//             disabled={!this.state.name}
//             onClick={this.handleSubmit}
//             type="button"
//             value="SUBMIT"
//           />
//         </div>
//         <div className="drawing-space">
//           <canvas
//             id="canvas"
//             className="drawing-canvas"
//             width="500"
//             height="500"
//           ></canvas>
//           <div className="drawing-colors">
//             <div
//               className="color black active-color"
//               onClick={e => this.changeColor('#000', e)}
//             ></div>
//             <div
//               className="color red"
//               onClick={e => this.changeColor('#df4b26', e)}
//             ></div>
//             <div
//               className="color green"
//               onClick={e => this.changeColor('#228622', e)}
//             ></div>
//             <div
//               className="color blue"
//               onClick={e => this.changeColor('#3a68cc', e)}
//             ></div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default Drawing;
