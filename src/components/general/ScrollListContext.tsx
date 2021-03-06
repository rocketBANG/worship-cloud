import * as React from 'react'
import { observer } from 'mobx-react';
import '../../style/ScrollList.css';
import { IListItem } from './IListItem';
import { ScrollList } from './ScrollList';
import { FloatingMenu, IFloatingMenuItem } from './FloatingMenu';

interface IProps {
    items: IListItem[],
    selected?: number[],
    onUpdate?: (values: IListItem[], indexes: number[]) => void,
    onClick?: (event: React.MouseEvent) => void,
    onDoubleClick?: (event: React.MouseEvent) => void,
    onItemContextMenu?: (item: IListItem, index: number) => void,
    contextMenu?: IListContextMenu[]
}

interface IState {
    menuHidden: boolean,
    menuLeft: number,
    menuTop: number
}

@observer
export class ScrollListContext extends React.Component<IProps, IState> {

    public state = {
        menuHidden: true,
        menuLeft: 0,
        menuTop: 0
    }

    private onItemContextMenu = (event: React.MouseEvent, item: IListItem, index: number) => {
        if(!this.props.contextMenu) {
            return;
        }

        event.preventDefault();
        if(this.props.onItemContextMenu) this.props.onItemContextMenu(item, index);
        
        this.setState({menuLeft: event.pageX, menuTop: event.pageY, menuHidden: false});
    }

    private onMenuClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});
    }

    private onSelectClick = (event: React.MouseEvent) => {
        this.setState({menuHidden: true});

        if(this.props.onClick) this.props.onClick(event);
    }

    public render() {
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
            <FloatingMenu onClick={this.onMenuClick} hidden={this.state.menuHidden} left={this.state.menuLeft} top={this.state.menuTop} items={menuItems}>
                <ScrollList
                    items={this.props.items} 
                    selected={this.props.selected} 
                    onClick={this.onSelectClick} 
                    onDoubleClick={this.props.onDoubleClick} 
                    onItemContextMenu={this.onItemContextMenu}
                    onUpdate={this.props.onUpdate}/>
            </FloatingMenu>
        )
    }
}

export interface IListContextMenu {
    text: string,
    onSelect: (index: number) => void,
    show?: () => boolean
}
