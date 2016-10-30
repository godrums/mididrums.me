import React, { Component } from 'react'
import css from './App.css'

import { Snare, Kick, Cymbal } from './images'

const initialState = () => (
  {
    drum: [],
    dragging: null,
    selected: null,
    pickXY: [0, 0],
    backXY: [0, 0]
  }
)

class Sidebar extends Component {
  render() {
    return (
      <div className={css.sidebar}>
        <Snare color="#ddd" onMouseDown={this.props.createPad.bind(this, Snare)} />
        <Cymbal color="#ddd" onMouseDown={this.props.createPad.bind(this, Cymbal)} />
      </div>
    )
  }
}


class Pad extends Component {
  buildStyle() {
    return {
      position: 'absolute',
      // left: this.props.pad.x + 'px',
      //top: this.props.pad.y + 'px',
      width: this.props.pad.width + 'px',
      height: this.props.pad.height + 'px', 
      WebkitUserSelect: 'none',
      zIndex: this.props.zIndex,
      transform: `translate(${this.props.pad.x}px, ${this.props.pad.y}px)`,
      transition: 'left .1s ease-in-out'
    }
  }   
  render() {
    const color = 
                  this.props.pad.invalid ? '#ffbcbc' :
                  this.props.selected ? 'white' : 
                  this.props.pad.bgColor

    return (
      <div
        style={this.buildStyle()}
        onMouseDown={this.props.startDrag.bind(this, this.props.pad)}
        onMouseEnter={this.props.select.bind(this, this.props.pad)}
        onMouseLeave={this.props.deselect.bind(this, this.props.pad)}
      >
        { React.createElement(this.props.pad.image, { color }, []) }
      </div>
    )
  }
}

const padCenter = (pad) => ({x: pad.x + pad.width/2, y: pad.y + pad.height/2})
const isColliding = (pad1, pad2) => {
  const p1 = padCenter(pad1)
  const p2 = padCenter(pad2)
  if (
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) 
    < Math.pow((pad1.width/2 + pad2.width/2)/2, 2)
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
  handleKeyboard(event) {
    // const pad = this.state.drum.filter(aPad => aPad.id === this.state.dragging)[0]
    console.log(event)
  }
  select(pad, event) {
    this.setState({ selected: pad.id })
  }
  deselect(pad, event) {
    this.setState({ selected: null })
  }
  createPad(padSvg, event) {
    const newPad = {
      id: this.state.drum.length, 
      image: padSvg, 
      sound: './sound/snare.ogg',
      x: event.clientX - 160/2, 
      y: event.clientY - 160/2, 
      width: 160, 
      height: 160,
      bgColor: `rgba(160, 160, 160, 0.9)`,
      invalid: false,
      zIndex: 0
    }
    this.setState({drum: [...this.state.drum, newPad], dragging: newPad.id, pickXY: [-160/2, -160/2], backXY: [newPad.x, newPad.y]})
  }
  startDrag(pad, event) { 
    this.setState({ dragging: pad.id, pickXY: [pad.x - event.clientX, pad.y - event.clientY], backXY: [pad.x, pad.y] })
  }
  stopDrag() {
    if (this.state.drum.filter(pad => pad.invalid).length > 0) {
      const drum = this.state.drum.map(pad => {
        if (pad.id === this.state.dragging) {
          return {...pad, x: this.state.backXY[0], y: this.state.backXY[1], invalid: false}
        }
        return {...pad, invalid: false}
      })
      this.setState({ drum, dragging: null, pickXY: [0, 0] })
      return 
    }
    this.setState({ dragging: null, pickXY: [0, 0] })
  }
  tryDrag(event) {
    console.log(this.state.pickXY)
    event.preventDefault()

    const drum = this.state.drum.map(pad => { 
      const collidingWith = this.state.drum.filter(otherPad => 
        otherPad.id !== pad.id && isColliding(pad, otherPad))
      if (collidingWith.length > 0) {
        return {...pad, invalid:true}
      }

      return {...pad, invalid: false}
    })


    if (this.state.dragging !== null) {  
      const newDrum = drum.map(pad => {
        if (pad.id === this.state.dragging) {
          const mouseX = event.clientX 
          const mouseY = event.clientY
          let x = mouseX + this.state.pickXY[0]
          let y = mouseY + this.state.pickXY[1]

          if (x < 0) {
            x = 0
          }
          if (x + pad.width > window.innerWidth) {
            x = window.innerWidth - pad.width
          }
          if (y < 0) {
            y = 0
          }
          if (y + pad.height > window.innerHeight) {
            y = window.innerHeight - pad.height
          } 

          return { ...pad, x, y}
        }

        return pad
      }) 
      this.setState({ drum: newDrum })
    }
  }
  render() {
    return (
      <div 
        className={css.app}
        onMouseUp={this.stopDrag.bind(this)}
        onMouseMove={this.tryDrag.bind(this)}
      >
        <Sidebar createPad={this.createPad.bind(this)}/>
        { 
          this.state.drum.map( (pad, i) => 
            <Pad 
              key={i}
              selected={this.state.selected === pad.id}
              pad={pad}
              startDrag={this.startDrag.bind(this)}
              select={this.select.bind(this)}
              deselect={this.deselect.bind(this)}
            />
          )
        }
      </div>
    )
  }
}
