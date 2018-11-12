import * as React from 'react'
import { observer } from 'mobx-react';
import './SelectList.css';

interface IProps {
    items: ISelectItem[],
    onChange?: (change: ISelectChange[]) => void,
    value?: any[],
    onClick?: (event: React.MouseEvent) => void,
    onDoubleClick?: (event: React.MouseEvent) => void,
    onContextMenu?: (event: React.MouseEvent) => void,
    onItemContextMenu?: (event: React.MouseEvent, item: ISelectItem) => void
}

@observer
export class SelectList extends React.Component<IProps> {

    private processClick = (e: React.MouseEvent<HTMLSpanElement>, item: ISelectItem) => {
        let items = this.props.value;

        if(e.shiftKey) {
            items.push(item.value);
        } else {
            items = [item.value];
        }

        this.props.onChange(items.map(i => ({value: i})));
    }

    public render() {
        let values = this.props.value;

        let items = this.props.items.map((item, i) => {
            let className = 'selectItem ';
            if (values.indexOf(item.value) !== -1) {
                className += 'selectedItem ';
            }

            return (
                <span 
                    onContextMenu={(e) => this.props.onItemContextMenu(e, item)} 
                    className={className} 
                    key={i} 
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