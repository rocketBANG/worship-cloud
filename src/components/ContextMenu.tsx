import * as React from 'react';
import { IFloatingMenuItem, FloatingMenu } from './FloatingMenu';

interface IProps {
    items: IFloatingMenuItem[],
}

interface IState {
    hidden: boolean,
    left: number,
    top: number
}

export class ContextMenu extends React.Component<IProps, IState> {

    public state = {
        hidden: false,
        left: 0,
        top: 0
    }

    private onClick = (event: React.MouseEvent) => {
        this.setState({hidden: true});
    }
    
    private onContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        this.setState({hidden: false, left: event.pageX, top: event.pageY});
    }

    public render() {

        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child as React.ReactElement<any>, { onClick: this.onClick, onContextMenu: this.onContextMenu }));
        
        return (
            <React.Fragment>
                <FloatingMenu hidden={this.state.hidden} items={this.props.items} left={this.state.left} top={this.state.top} >
                    {childrenWithProps}
                </FloatingMenu>
            </React.Fragment>
        )
    }
}