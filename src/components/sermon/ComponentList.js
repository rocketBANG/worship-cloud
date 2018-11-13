// import React from 'react'
// import { observer } from 'mobx-react'

// const ComponentList = observer(class extends React.Component {

//     onComponentClick = (comps, indexes) => {
//         if(indexes.length < 1) {
//             return;
//         }
    
//         let components = this.props.sermonPage.components;
        
//         components.forEach((c, i) => {
//             if(indexes.indexOf(i) > -1) {
//                 c.select();
//             }
//         });
//     };


//     render() {
//         let components = this.props.sermonPage.components || [];
//         const options = components.map((component, index) => ({
//             id: index + '',
//             text: component.text + '',
//             altText: ""
//         }));

//         let selectedIndexes = [];
//         components.forEach((c, i) => {
//             if(c.selected) {
//                 selectedIndexes.push(i);
//             }
//         });
    
//         return ( 
//             <div className="sermonPageList">
//                 <div className="ListHeader">Components:</div>
//                 <List onUpdate={this.onComponentClick} options={options} selectedIndex={selectedIndexes}  />
//             </div>
//         )
//     }
// });

// export default ComponentList;