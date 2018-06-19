import * as React from 'react'
import { PropTypes } from 'prop-types';

class List extends React.Component {

    keySeperator = "_-";

    state = {
        selected: []
    }

    removeUnique(word) {
        let endIndex = word.indexOf(this.keySeperator);
        return word.substring(0, endIndex);
    }

    returnSelected = () => {
        let options = this.select.options;
        let selectedValues = [];
        let selectedIndexes = [];
        
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

        let selected = this.state.selected;
        if(this.props.selectedIndex !== undefined) {
            if(this.props.selectedIndex.constructor === Array) {
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

List.propTypes = {
    selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    onUpdate: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        altText: PropTypes.string.isRequired,
        text: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    }))
};
  
export { List }