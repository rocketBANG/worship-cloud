import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observe, autorun } from 'mobx';

export const SermonComponent = observer(class SermonComponent extends Component {

    componentDiv = undefined;

    possibleDragging = false;

    state = {
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
    }

    constructor(props) {
        super(props);

        observe(this.props.controller, (change) => {
            this.props.component.move(change.object.moveX, change.object.moveY);
            console.log(change.object.moveX + " " + change.object.moveY);
        });
        
    }

    onComponentClick = (e) => {
        e.stopPropagation();
        if(this.state.isDragging) {
            this.setState({isDragging: false});
            return;
        }
        this.props.component.toggleSelected();
    }

    onComponentMouseDown = (e) => {
        e.stopPropagation();
        this.possibleDragging = true;
        this.props.parent.addEventListener('mousemove', this.onComponentMouseMove);
        this.props.parent.addEventListener('mouseup', this.onComponentMouseUp);    
    }

    onComponentMouseMove = (e) => {
        if(this.possibleDragging && !this.state.isDragging) {
            this.props.component.select();
            this.setState({dragStartX: e.clientX - this.props.component.x, dragStartY: e.clientY - this.props.component.y, isDragging: true});
            return;
        } else if(!this.state.isDragging){
            return;
        }
        // this.props.component.move(e.clientX - this.state.dragStartX - this.props.component.x,  e.clientY - this.state.dragStartY- this.props.component.y);
        this.props.controller.move(e.clientX - this.state.dragStartX - this.props.component.x,  e.clientY - this.state.dragStartY- this.props.component.y);
    }

    onComponentMouseUp = (e) => {
        e.stopPropagation();
        this.possibleDragging = false;
        this.props.parent.removeEventListener('mousemove', this.onComponentMouseMove);
        this.props.parent.removeEventListener('mouseup', this.onComponentMouseUp);
    }

    render() {

        let {x, y, text, selected} = this.props.component;
        
        return (
            <div 
            className={"sermonComponent " + (selected ? "selected" : "")} 
            style={{left: x, top: y}} 
            onClick={this.onComponentClick}
            onMouseDown={this.onComponentMouseDown}
            // onMouseUp={this.onComponentMouseUp}
            // onMouseMove={this.onComponentMouseMove}
            >
                {text}
            </div>
        );
    }
});