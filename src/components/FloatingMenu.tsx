import * as React from 'react';

export interface IFloatingMenuItem {
    text: string
}

interface IProps {
    items: IFloatingMenuItem[],
    hidden?: boolean,
    left: number,
    top: number
}

const floatingMenuStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: '5px'
}

export class FloatingMenu extends React.Component<IProps> {

    private createSubMenu = () => {
        return this.props.items.map((item, i) => {
            
            return (
                <p key={i}>{item.text}</p>
            );
        });
    }

    public render() {
        
        return (
            <React.Fragment>
                {this.props.hidden ? undefined : <div className='floatingMenu' style={{...floatingMenuStyle, left: this.props.left, top: this.props.top}}>
                    {this.createSubMenu()}
                </div>}
                {this.props.children}
            </React.Fragment>
        )
    }
}