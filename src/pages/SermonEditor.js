import React, { Component } from 'react';
import '../style/SermonEditor.css';
import { ComponentEditor } from '../components/sermon/ComponentEditor';
import ComponentList from '../components/sermon/ComponentList';
import { SermonComponent } from '../components/SermonComponent';
import { SermonComponentModel } from '../models/SermonComponentModel'
import { SermonComponentControllerModel } from '../models/SermonComponentControllerModel';
import { SermonPageList } from '../components/SermonPageList';
import { PageListModel } from '../models/sermon/PageListModel';
import { SermonPageModel } from '../models/SermonPageModel';
import { observer } from 'mobx-react';
import PageListControls from '../components/sermon/PageListControls';

export default observer(class extends Component {

    possibleDragging = false;

    state = {
        isDragging: false,
        selectX: 0,
        selectY: 0,
        selectWidth: 0,
        selectHeight: 0,
        selectOriginX: 0,
        selectOriginY: 0,
    };

    pageList = new PageListModel();

    sermonController = new SermonComponentControllerModel();

    selectedPage;

    constructor(props) {
        super(props);
        this.pageList.addPage(new SermonPageModel('page 1'));
        this.pageList.setPage(0);
        this.selectedPage = this.pageList.currentPage;
    }

    onAddComponent = () => {
        this.pageList.currentPage.addComponent(new SermonComponentModel("hi", 10, 10));
    }

    onMoveRight = () => {
        this.moveSelectedComponents(50, 0);
    }

    moveSelectedComponents = (x, y) => {
        let components = this.pageList.currentPage.components;
        components.filter(c => c.selected === true).forEach(c => c.move(x, y));
    }

    onKeyDown = (e) => {
        let amount = 10;
        if(e.shiftKey) {
            amount *= 5;
        }

        if(e.keyCode === 39) { // Right
            this.moveSelectedComponents(amount, 0);
        } else if(e.keyCode === 37) { // Left
            this.moveSelectedComponents(-amount, 0);
        } else if(e.keyCode === 38) { // Up
            this.moveSelectedComponents(0, -amount);
        } else if(e.keyCode === 40) { // Down
            this.moveSelectedComponents(0, amount);
        }
    }

    onChangeText = (e) => {
        let components = this.pageList.currentPage.components;
        components.filter(c => c.selected === true).forEach(c => c.text = e.target.value);
    }

    onViewClick = () => {
        if(this.state.isDragging) {
            this.setState({isDragging: false, selectWidth: 0, selectHeight: 0});
            this.possibleDragging = false;
            return;
        }

        this.deselectAll();
    }

    deselectAll = () => {
        let components = this.pageList.currentPage.components;
        components.filter(c => c.selected === true).forEach(c => c.deselect());
    }

    moveComponent = (component, mouseEvent) => {
        if (!component.selected) {
            this.deselectAll();
            component.select();
        }
    }

    onViewMouseUp = () => {
        this.possibleDragging = false;
    }

    onViewMouseDown = () => {
        this.possibleDragging = true;
    }

    onViewMouseMove = (e) => {
        let target = this.sermonViewDiv;
        
        let trueX =  e.clientX - target.offsetLeft;
        let trueY =  e.clientY - target.offsetTop;

        if(this.possibleDragging && this.state.isDragging === false) {
            this.setState({isDragging: true, selectOriginX: trueX, selectOriginY: trueY});
            this.deselectAll();
        }

        if(!this.state.isDragging) {
            return;
        }

        let left = this.state.selectOriginX;
        let width = trueX - this.state.selectOriginX;
        left = width > 0 ? left : left + width;
        width = width > 0 ? width : -width;


        let top = this.state.selectOriginY;
        let height = trueY - this.state.selectOriginY;
        top = height > 0 ? top : top + height;
        height = height > 0 ? height : -height;

        this.setState({selectWidth: width, selectHeight: height, selectX: left, selectY: top});

        this.checkSelectedComponents({x: left, y: top}, {x: left + width, y: top + height});
    }

    checkSelectedComponents(topLeft, bottomRight) {
        this.pageList.currentPage.components.forEach(c => {
            if(c.x > topLeft.x && c.x < bottomRight.x && c.y > topLeft.y && c.y < bottomRight.y) {
                c.select();
            }
        });
    }

    onAddPage = () => {
        this.pageList.addPage(new SermonPageModel('2'));
    }


    render() {

        let componentRender = this.pageList.currentPage.components.map((c, i) => (
            <SermonComponent key={i} component={c} parent={this.sermonViewDiv} controller={this.sermonController} deselectAll={(e) => this.moveComponent(c, e)}/>
        ))
        
        return (
            <div className='sermonEditorPage' onKeyDown={this.onKeyDown}>
                <div className='topPage'>
                    <div ref={ref => this.sermonViewDiv = ref} className='sermonView' onClick={this.onViewClick} onMouseDown={this.onViewMouseDown} onMouseUp={this.onViewMouseUp} onMouseMove={this.onViewMouseMove}>
                        {componentRender}
                        <div className='selectBox' 
                        style={{left: this.state.selectX, top: this.state.selectY, width: this.state.selectWidth, height: this.state.selectHeight}}></div>
                    </div>
                    <div className='pageList'>
                        <SermonPageList pageList={this.pageList} />
                        <PageListControls addPage={this.onAddPage} />
                    </div>
                    <ComponentList sermonPage={this.pageList.currentPage}/>
                    <ComponentEditor component={this.pageList.currentPage.components.filter(c => c.selected)[0]}/>
                </div>
                <div className='sermonEditorControls'>
                    <button onClick={this.onAddComponent}>+</button>
                    <button onClick={this.onMoveRight}>></button>
                    <input onChange={this.onChangeText} />
                </div>
            </div>
        );
    }
});