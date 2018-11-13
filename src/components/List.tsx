import * as React from 'react'
import { FloatingMenu, IFloatingMenuItem } from './FloatingMenu';
import { ISelectItem } from './general/SelectList';
import { SelectListIndex } from './general/SelectListIndex';

export interface IOptions {
    altText: string,
    text: string,
    id: string
}

export interface IListContextMenu {
    text: string,
    onSelect: (index: number) => void,
    show?: () => boolean
}

interface IProps {
    selectedIndex?: number[],
    onUpdate: (ids: string[], index: number[]) => any,
    options: IOptions[],
    contextMenu?: IListContextMenu[],
    onClick?: (event: React.MouseEvent<any>) => void,
    onDoubleClick?: (event: React.MouseEvent<any>) => void,
    onItemContextMenu?: (id: string, index: string) => void
}

interface IState {
    selected: boolean,
    menuHidden: boolean,
    menuLeft: number,
    menuTop: number
}

class List extends React.Component<IProps, IState> {

    private keySeperator = "_-";

    public state = {
        selected: undefined,
        menuHidden: true,
        menuLeft: 0,
        menuTop: 0
    }

    private removeUnique(word: string) {
        const endIndex = word.lastIndexOf(this.keySeperator);
        return word.substring(0, endIndex);
    }

    private onContextMenu = (event: React.MouseEvent, item: ISelectItem, index: number) => {
        if(!this.props.contextMenu) {
            return;
        }

        event.preventDefault();
        if(this.props.onItemContextMenu) this.props.onItemContextMenu(this.removeUnique(item.value), index + '');
        
        this.setState({menuLeft: event.pageX, menuTop: event.pageY, menuHidden: false});
    }

    private onListClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});

        if(this.props.onClick) this.props.onClick(event);
    }

    private onMenuClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});
    }

    private onChange = (items: ISelectItem[], indexes: number[]) => {
        let selectedValues = indexes.map(i => this.props.options[i].id);
        let selectedIndexes = indexes;

        this.props.onUpdate(selectedValues, selectedIndexes)

    }

    private getUniqueElements(options: IOptions[]) {
        const keyCount = {};

        const optionsKeys = options.map((element) => {
            keyCount[element.id] = keyCount[element.id] + 1 || 1;
            const uniqueKey = element.id + this.keySeperator + keyCount[element.id];            
            return uniqueKey;
        });

        return optionsKeys;
    }

    public render() {
        const optionsKeys = this.getUniqueElements(this.props.options);
        
        const options: ISelectItem[] = this.props.options.map((element, index) => (
            {
                value: optionsKeys[index],
                label: element.text || element.altText
            })
        );

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
                    <SelectListIndex
                        items={options} 
                        onUpdate={this.onChange} 
                        onClick={this.onListClick} 
                        onDoubleClick={this.props.onDoubleClick}
                        onItemContextMenu={this.onContextMenu}
                        selected={this.props.selectedIndex}/>
                </FloatingMenu>
            </React.Fragment>
        )
    }
}
  
export { List }