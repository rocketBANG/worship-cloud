import * as React from 'react'
import { FloatingMenu, IFloatingMenuItem } from './FloatingMenu';

export interface IOptions {
    altText: string,
    text: string,
    id: string | number
}

export interface IListContextMenu {
    text: string,
    onSelect: (index: number) => void,
    show?: () => boolean
}

interface IProps {
    selectedIndex?: number[],
    onUpdate: (a: string[], b: string[]) => any,
    options: IOptions[],
    contextMenu?: IListContextMenu[],
    onClick?: (event: React.MouseEvent<any>) => void,
    onDoubleClick?: (event: React.MouseEvent<any>) => void,
    onContextMenu?: (event: React.MouseEvent<any>) => void
}

class List extends React.Component<IProps> {

    private keySeperator = "_-";

    public state = {
        selected: [],
        menuHidden: true,
        menuLeft: 0,
        menuTop: 0
    }

    private select: HTMLSelectElement = undefined;

    private removeUnique(word) {
        const endIndex = word.indexOf(this.keySeperator);
        return word.substring(0, endIndex);
    }

    private returnSelected = () => {
        const options = this.select.options;
        let selectedValues = [];
        const selectedIndexes = [];
        
        for(let i = 0; i < options.length; i++) {
            if(options[i].selected) {
                selectedValues.push(options[i].value);
                selectedIndexes.push(i);
            }
        }

        this.setState({selected: selectedValues});

        selectedValues = selectedValues.map(v => this.removeUnique(v));

        this.props.onUpdate(selectedValues, selectedIndexes)
    }

    private onContextMenu = (event: React.MouseEvent, id: string | number, index: number) => {
        if(!this.props.contextMenu) {
            return;
        }

        event.preventDefault();
        this.props.onUpdate(['' + id], [index + '']);
        
        this.setState({menuLeft: event.pageX, menuTop: event.pageY, menuHidden: false});
    }

    private onListClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});
        if(this.props.onClick) this.props.onClick(event);
    }

    private onMenuClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});
    }

    public render() {
        const keyCount = {};

        const optionsKeys = this.props.options.map((element) => {
            keyCount[element.id] = keyCount[element.id] + 1 || 1;
            const uniqueKey = element.id + this.keySeperator + keyCount[element.id];            
            return uniqueKey;
        });
        
        const options = this.props.options.map((element, index) => (
            <option key={optionsKeys[index]} value={optionsKeys[index]} onContextMenu={(event) => this.onContextMenu(event, element.id, index)}>{
                element.text || element.altText
            }</option>)
        );

        let selected = this.state.selected;
        if(this.props.selectedIndex !== undefined) {
            if(this.props.selectedIndex instanceof Array) {
                selected = optionsKeys.filter((v, i) => this.props.selectedIndex.indexOf(i) !== -1);
            } else if(this.props.selectedIndex > -1) {
                selected = [optionsKeys[this.props.selectedIndex]];
            }
        }

        let menuItems: IFloatingMenuItem[] = [];

        if(this.props.contextMenu) {
            menuItems = this.props.contextMenu.filter(m => 
                m.show === undefined || m.show()
            )
            .map(menuItem => {
                const floatingMenuItem: IFloatingMenuItem = {
                    onClick: menuItem.onSelect,
                    text: menuItem.text
                };
                return floatingMenuItem;
            });
        }
    
        return (
            <React.Fragment>
                <FloatingMenu onClick={this.onMenuClick} hidden={this.state.menuHidden} left={this.state.menuLeft} top={this.state.menuTop} items={menuItems}>
                    <select value={selected} className="List" multiple ref={(node) => this.select = node} 
                    onChange={this.returnSelected}
                    onClick={this.onListClick}
                    onDoubleClick={this.props.onDoubleClick}
                    onContextMenu={this.props.onContextMenu}
                    // onFocus={() => this.props.onUpdate(select.value, select.selectedIndex)}
                    >
                    {options}
                </select>
                </FloatingMenu>
            </React.Fragment>
        )
    }
}
  
export { List }