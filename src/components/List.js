import React from 'react'
import { PropTypes } from 'prop-types';

class List extends React.Component {

    keySeperator = "_-";

    removeUnique(string) {
        let endIndex = string.indexOf(this.keySeperator);
        return string.substring(0, endIndex);
    }

    returnSelected = () => {
        let options = this.select.options;
        let selectedValues = [];
        let selectedIndexes = [];
        
        for(let i = 0; i < options.length; i++) {
            if(options[i].selected) {
                selectedValues.push(this.removeUnique(options[i].value));
                selectedIndexes.push(i);
            }
        }

        this.props.onUpdate(selectedValues, selectedIndexes)
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
            selected = [optionsKeys[this.props.selectedIndex]];
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

List.propTypes = {
    selectedIndex: PropTypes.number,
    onUpdate: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        altText: PropTypes.string.isRequired,
        text: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    })).isRequired
};
  
export { List }