import * as React from 'react'
import { observer } from 'mobx-react';
import './SelectList.css';

interface IProps {
    items: ISelectItem[],
    onChange?: (change: ISelectChange[], indexes: number[]) => void,
    value?: any[],
    onClick?: (event: React.MouseEvent) => void,
    onDoubleClick?: (event: React.MouseEvent) => void,
    onContextMenu?: (event: React.MouseEvent) => void,
    onItemContextMenu?: (event: React.MouseEvent, item: ISelectItem, index: number) => void
}

interface IState {
    uncontrolled: boolean;
    values?: any[]
}

@observer
export class SelectList extends React.Component<IProps, IState> {

    private firstSelected = -1;

    public state: IState = {
        uncontrolled: this.props.value === undefined,
        values: []
    }

    public componentDidMount() {
        this.setState({uncontrolled: this.props.value === undefined})
    }

    private processClick = (e: React.MouseEvent<HTMLSpanElement>, item: ISelectItem) => {
        // Allow uncontrolled
        let values = this.state.uncontrolled ? this.state.values : this.props.value;

        let selectedIndex = this.props.items.indexOf(item);

        // Shift select from first selected point
        let initialSelected = this.props.items.findIndex(i => i.value === values[0]);
        if (this.firstSelected > -1 && this.firstSelected < this.props.items.length) {
            initialSelected = this.firstSelected;
        }

        if(e.shiftKey) {

            if (initialSelected < 0 ) {
                initialSelected = selectedIndex;
            }
            // Keep anchor point at first selected
            values = [ this.props.items[initialSelected].value ];
            
            let from = selectedIndex < initialSelected ? selectedIndex : initialSelected;
            let to = selectedIndex < initialSelected ? initialSelected : selectedIndex;
            
            // Add all items from anchor to selected point
            for (let i = from; i < to + 1; i++) {
                if (this.props.items[i].value === values[0]) continue;
                values.push(this.props.items[i].value);
            }

        } else if(e.ctrlKey) {
            if (values.indexOf(item.value) > -1) {
                // Deselect if selected
                values = values.filter(v => v !== item.value);

                if (values.length < 1) this.firstSelected = -1;
                
            } else {
                // Add to selection
                this.firstSelected = selectedIndex;
                values.push(item.value);
            }

        } else {
            // Only select one
            this.firstSelected = selectedIndex;
            values = [item.value];
        }

        let indexes = values.map(i => this.props.items.findIndex(thing => thing.value === i));

        if(this.props.onChange) this.props.onChange(values.map(i => ({value: i})), indexes);

        if (this.state.uncontrolled) this.setState({values: values});
    }

    public render() {
        let values = this.state.uncontrolled ? this.state.values : this.props.value;

        let items = this.props.items.map((item, i) => {
            let className = 'selectItem ';
            if (values.indexOf(item.value) !== -1) {
                className += 'selectedItem ';
            }

            return (
                <span 
                    onContextMenu={(e) => this.props.onItemContextMenu(e, item, values.indexOf(item.value))} 
                    className={className} 
                    key={item.value} 
                    onClick={e => this.processClick(e, item)}>
                        {item.label}
                </span>
            )
        })
        return (
            <div className="selectList"
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                onDoubleClick={this.props.onDoubleClick}>
                {items}
            </div>
        )
    }
}
export interface ISelectChange {
    value: any
}

export interface ISelectItem {
    value: any,
    label: string,

}