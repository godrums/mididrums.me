import React, { Component } from 'react'
import css from './App.css'

const pads = {
  snare: () => (
    {
      image: './img/snare.svg',
      sound: './sound/snare.ogg'
    }
  ),
  kick: () => (
    {
      image: './img/kick.svg',
      sound: './sound/kick.ogg'
    }
  ),
  cymbal: () => (
    {
      image: './img/cymbal.svg',
      sound: './sound/cymbal.ogg'
    }
  )
}

const buildPad = (id, padPreset, x, y) => {
  const pad = pads[padPreset]()
   return {
    x: x || 0,
    y: y || 0,
    image: pad.image,
    souind: pad.sound,
    id
  }
}

const initialState = () => (
  {
    drum: [
      buildPad(0, 'snare', 10, 10), 
      buildPad(1, 'kick', 300, 300), 
      buildPad(2, 'cymbal', 500, 300)
    ],
    dragging: false
  }
)


class Pad extends Component {
  buildStyle(x, y) {
    return {
      position: 'absolute',
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      width: 130 + 'px',
      height: 130 + 'px', 
      WebkitUserSelect: 'none',
      border: 'solid 3px black',
      backgroundColor: '#c5c56e',
      borderRadius: '100%'
    }
  }   
  render() {
    return (
      <div
        style={this.buildStyle()}
        onMouseDown={this.props.startDrag.bind(this, this.props.pad.id)}
      >
        {this.props.pad.id}
      </div>
    )
  }
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState()
  }
  startDrag(id) {
    this.setState({ dragging: id })
  }
  stopDrag() {
    this.setState({ dragging: null })
  }
  tryDrag(event) {
    if (this.state.dragging !== null) {
      const newX = event.clientX - 65
      const newY = event.clientY - 65
      const drum = this.state.drum.map(pad => {
        if (pad.id === this.state.dragging) {
          return {...pad, x: newX, y: newY}
        }
        else {
          return pad
        }
      }) 
      this.setState({drum})
    }
  }
  render() {
    return (
      <div 
        className={css.app}
        onMouseUp={this.stopDrag.bind(this)}
        onMouseMove={this.tryDrag.bind(this)}
      >
        <h1 className={css.mode}>Edit mode</h1>
        { 
          this.state.drum.map( (pad, i) => 
            <Pad 
              key={i}
              pad={pad}
              x={pad.x}
              y={pad.y}
              startDrag={this.startDrag.bind(this)}
            />
          )
        }
      </div>
    )
  }
}
