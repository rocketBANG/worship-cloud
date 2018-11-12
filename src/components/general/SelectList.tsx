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

    public state: IState = {
        uncontrolled: this.props.value === undefined,
        values: []
    }

    public componentDidMount() {
        this.setState({uncontrolled: this.props.value === undefined})
    }

    private processClick = (e: React.MouseEvent<HTMLSpanElement>, item: ISelectItem) => {
        let items = this.state.uncontrolled ? this.state.values : this.props.value;

        if(e.shiftKey) {
            items.push(item.value);
        } else {
            items = [item.value];
        }

        let indexes = items.map(i => this.props.items.findIndex(thing => thing.value === i));
        console.log(indexes);

        if(this.props.onChange) this.props.onChange(items.map(i => ({value: i})), indexes);

        if (this.state.uncontrolled) this.setState({values: items});
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