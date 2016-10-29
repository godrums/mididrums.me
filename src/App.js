import React, { Component } from 'react'
import css from './App.css'
 
const initialState = () => (
  {
    drum: [
      {
        id: 0, 
        image: './img/snare.svg',
        sound: './sound/snare.ogg',
        x: 400, 
        y: 400, 
        width: 100, 
        height: 100,
        bgColor: '#ddd',
        invalid: false
      }, 
      {
        id: 1, 
        image: './img/kick.svg',
        ound: './sound/kick.ogg',
        x: 300, 
        y: 300, 
        width: 100, 
        height: 100,
        bgColor: '#ddd',
        invalid: false
      }, 
      {
        id: 2,
        image: './img/cymbal.svg',
        sound: './sound/cymbal.ogg',
        x: 250, 
        y: 100, 
        width: 100, 
        height: 100,
        bgColor: '#ddd',
        invalid: false
      }, 
    ],
    dragging: false,
    pickXY: [0, 0]
  }
)

class Sidebar extends Component {
  render() {
    return (
      <div className={css.sidebar}>
       
      </div>
    )
  }
}


class Pad extends Component {
  buildStyle() {
    return {
      position: 'absolute',
      left: this.props.pad.x + 'px',
      top: this.props.pad.y + 'px',
      width: this.props.pad.width + 'px',
      height: this.props.pad.height + 'px', 
      WebkitUserSelect: 'none',
      border: 'solid 3px black',
      backgroundColor: this.props.pad.invalid ? 'red' : this.props.pad.bgColor,
      borderRadius: '100%'
    }
  }   
  render() {
    return (
      <div
        style={this.buildStyle()}
        onMouseDown={this.props.startDrag.bind(this, this.props.pad)}
      >
        {this.props.pad.id}
      </div>
    )
  }
}

const padCenter = (pad) => ({x: pad.x + pad.width/2, y: pad.y + pad.height/2})
const isColliding = (pad1, pad2) => {
  const p1 = padCenter(pad1)
  const p2 = padCenter(pad2)
  if (
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) < Math.pow((pad1.width/2 + pad2.width/2)/2, 2)
  ) {
    return true
  }
  return false
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState()
  }
  startDrag(pad, event) {
    this.setState({ dragging: pad.id, pickXY: [pad.x - event.clientX, pad.y - event.clientY] })
  }
  stopDrag() {
    this.setState({ dragging: null, pickXY: [0, 0] })
  }
  tryDrag(event) {
    event.preventDefault()
    if (this.state.dragging !== null) {  
      const drum = this.state.drum.map(pad => {
        if (pad.id === this.state.dragging) {
          const mouseX = event.clientX 
          const mouseY = event.clientY
          const x = mouseX + this.state.pickXY[0]
          const y = mouseY + this.state.pickXY[1]

          const collidingWith = this.state.drum.filter(otherPad => 
            otherPad.id !== pad.id && isColliding(pad, otherPad))

          return { ...pad, x, y, invalid: collidingWith.length > 0 }
        }

        return pad
      }) 
      this.setState({ drum})
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
        <Sidebar />
        { 
          this.state.drum.map( (pad, i) => 
            <Pad 
              key={i}
              pad={pad}
              startDrag={this.startDrag.bind(this)}
            />
          )
        }
      </div>
    )
  }
}
