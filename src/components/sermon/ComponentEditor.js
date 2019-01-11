// import React  from 'react';
// import { observer } from 'mobx-react';
// import '../../style/ComponentEditor.css';
// import { SermonComponentModel } from '../../models/SermonComponentModel';
// import { PropTypes } from 'prop-types';

// const ComponentEditor = observer(class extends React.Component {
    
    
//     render() {
//         let component = this.props.component || {};
        
//         return (
//             <div className="componentEditor">
//                 X: <input value={component.x || 0} disabled={this.props.component === undefined}/>
//             </div>
//         );
//     };
// });

// export { ComponentEditor };

// ComponentEditor.propTypes = {
//     component: PropTypes.instanceOf(SermonComponentModel).isRequired,
// };