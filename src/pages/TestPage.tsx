import * as React from 'react'
import { SelectList, ISelectItem, ISelectChange } from 'src/components/general/SelectList';


export class TestPage extends React.Component<{}, {selected: any[], selectedCustom: any[]}> {

    private select;

    public state = {
        selected: [],
        selectedCustom: []
    }

    private onChange = (change: ISelectChange[]) => {
        this.setState({selectedCustom: change.map(c => c.value)});
    }

    private changeSelected = (something) => {
        let selected = [];
        let options = this.select.options;

        for (const option of options) {
            if(option.selected) {
                selected.push(option.value);
            }

        }

        this.setState({selected: selected});
    }

    public render() {
        let items: ISelectItem[] = [
            {
                label: "test",
                value: "hello"
            },
            {
                label: "test2",
                value: "hello2"
            },
            
        ]
        return (
            <div className="testPage">
                <SelectList value={this.state.selectedCustom} items={items} onChange={this.onChange} />

                <div className="selectDefault">
                    <select ref={r => this.select = r} value={this.state.selected} onChange={this.changeSelected} multiple>
                    <option value={"number1"}>Hello</option>
                    <option value={"number2"}>Hello2</option>
                    </select>
                </div>
            </div>
        )
    }
}