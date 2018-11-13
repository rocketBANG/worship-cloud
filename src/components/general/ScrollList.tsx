import * as React from 'react'
import { observer } from 'mobx-react';
import './ScrollList.css';
import { IListItem } from './IListItem';

interface IProps {
    items: IListItem[],
    selected?: number[],
    onUpdate?: (values: IListItem[], indexes: number[]) => void,
    onClick?: (event: React.MouseEvent) => void,
    onDoubleClick?: (event: React.MouseEvent) => void,
    onContextMenu?: (event: React.MouseEvent) => void,
    onItemContextMenu?: (event: React.MouseEvent, item: IListItem, index: number) => void
}

interface IState {
    uncontrolled: boolean;
    selected?: number[]
}

@observer
export class ScrollList extends React.Component<IProps, IState> {

    private firstSelected = -1;

    public state: IState = {
        uncontrolled: this.props.selected === undefined,
        selected: []
    }

    private expandSelection(selected: number[], clickedIndex: number) {
        let anchorPoint = selected[0];
        if (this.firstSelected > -1 && this.firstSelected < this.props.items.length) {
            anchorPoint = this.firstSelected;
        }

        if (anchorPoint < 0 || anchorPoint === undefined) {
            anchorPoint = clickedIndex;
        }
        // Keep anchor point at first selected
        selected.splice(0, selected.length);
        selected.push(anchorPoint);
        
        let from = clickedIndex < anchorPoint ? clickedIndex : anchorPoint;
        let to = clickedIndex < anchorPoint ? anchorPoint : clickedIndex;
        
        // Add all items from anchor to selected point
        for (let i = from; i < to + 1; i++) {
            if (i === selected[0]) continue;
            selected.push(i);
        }

    }

    private processClick = (e: React.MouseEvent<HTMLSpanElement>, item: IListItem) => {
        // Allow uncontrolled
        let selected = this.state.uncontrolled ? this.state.selected : this.props.selected;

        let clickedIndex = this.props.items.indexOf(item);


        if(e.shiftKey) {
            this.expandSelection(selected, clickedIndex);

        } else if(e.ctrlKey) {
            if (selected.indexOf(clickedIndex) > -1) {
                // Deselect if selected
                selected = selected.filter(i => i !== clickedIndex);

                if (selected.length < 1) this.firstSelected = -1;
                
            } else {
                // Add to selection
                this.firstSelected = clickedIndex;
                selected.push(clickedIndex);
            }

        } else {
            // Only select one
            this.firstSelected = clickedIndex;
            selected = [clickedIndex];
        }

        let selectedItems = selected.map(i => this.props.items[i]);

        if(this.props.onUpdate) this.props.onUpdate(selectedItems, selected);

        if (this.state.uncontrolled) this.setState({selected: selected});
    }

    public render() {
        let selectedIndexes = this.state.uncontrolled ? this.state.selected : this.props.selected;

        let items = this.props.items.map((item, i) => {
            let className = 'listItem ';
            if (selectedIndexes.indexOf(i) !== -1) {
                className += 'selectedListItem ';
            }

            let onContextMenu = this.props.onItemContextMenu === undefined ? undefined : (e) => this.props.onItemContextMenu(e, item, i);

            // Setup each item
            return (
                <span 
                    onContextMenu={onContextMenu} 
                    className={className} 
                    key={item.value + i} 
                    onClick={e => this.processClick(e, item)}>
                        {item.label}
                </span>
            )
        })
        
        return (
            <div className="scrollList"
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                onDoubleClick={this.props.onDoubleClick}
                tabIndex={-1}>
                {items}
            </div>
        )
    }
}
