import * as React from 'react'

export interface IOptions {
    altText: string,
    text: string,
    id: string | number
}

interface IProps {
    selectedIndex?: number[],
    onUpdate: (a: string[], b: string[]) => any,
    options: IOptions[]
}

class List extends React.Component<IProps> {

    private keySeperator = "_-";

    public state = {
        selected: []
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

    public render() {
        const keyCount = {};

        const optionsKeys = this.props.options.map((element) => {
            keyCount[element.id] = keyCount[element.id] + 1 || 1;
            const uniqueKey = element.id + this.keySeperator + keyCount[element.id];            
            return uniqueKey;
        });
        
        const options = this.props.options.map((element, index) => (
            <option key={optionsKeys[index]} value={optionsKeys[index]}>{
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
    
        return (
            <select value={selected} className="List" multiple ref={(node) => this.select = node} 
            onChange={this.returnSelected}
            // onFocus={() => this.props.onUpdate(select.value, select.selectedIndex)}
            >
                {options}
            </select>
        )
    }
}
  
export { List }