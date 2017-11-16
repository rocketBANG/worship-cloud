import React from 'react'

export class List extends React.Component {

    keySeperator = "_-";

    removeUnique(string) {
        let endIndex = string.indexOf(this.keySeperator);
        return string.substring(0, endIndex);
    }

    render() {
        let select;
        let keyCount = {};

        const optionsKeys = this.props.options.map((element) => {
            keyCount[element.id] = keyCount[element.id] + 1 || 1;
            let uniqueKey = element.id + this.keySeperator + keyCount[element.id];            
            return uniqueKey;
        });
        
        const options = this.props.options.map((element, index) => (
            <option key={optionsKeys[index]} value={optionsKeys[index]}>{
                element.text || element.altText
            }</option>)
        );

        let selected;

        if(this.props.selectedIndex !== undefined && this.props.selectedIndex > -1) {
            let selectedOption = this.props.options[this.props.selectedIndex];
            selected = [optionsKeys[this.props.selectedIndex]];
        }
    
        return (
            <select value={selected} class="List" multiple ref={(node) => select = node} 
            onChange={() => this.props.onUpdate(this.removeUnique(select.value), select.selectedIndex)}
            // onFocus={() => this.props.onUpdate(select.value, select.selectedIndex)}
            >
                {options}
            </select>
        )
    }
}
