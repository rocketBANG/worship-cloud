import * as React from 'react';

export interface IFloatingMenuItem {
    text: string,
    onClick: (index: number) => void
}

interface IProps {
    items: IFloatingMenuItem[],
    hidden?: boolean,
    left: number,
    top: number,
    onClick?: (event: React.MouseEvent) => void
}

export class FloatingMenu extends React.Component<IProps> {

    private createSubMenu = () => {
        return this.props.items.map((item, i) => {
            
            return (
                <div key={i} onClick={() => item.onClick(i)}>
                    <p>{item.text}</p>
                </div>
            );
        });
    }

    public render() {
        
        return (
            <React.Fragment>
                {this.props.hidden ? undefined : 
                    <div className='floatingMenu' onClick={this.props.onClick} style={{left: this.props.left, top: this.props.top}}>
                        {this.createSubMenu()}
                    </div>
                }
                {this.props.children}
            </React.Fragment>
        )
    }
}