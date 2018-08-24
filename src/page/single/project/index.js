import React,{Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchProjectSingleData} from '../../../reducers';

import Html from '../../../_component/html'

class ProjectSingle extends Component {
    static propTypes = {
        projectData: PropTypes.object,
        lang: PropTypes.string,
    }

    constructor(props){
        super(props);

        this.state = {}
    }

    static actions(title){
        return [
            fetchProjectSingleData(title)
        ]
    }

    componentWillMount() {
        if(!this.props.projectSingleData)
            this.props.dispatch(fetchProjectSingleData(this.props.match.params.title));
        else if(this.props.projectSingleData.uid !== this.props.match.params.title)
            this.props.dispatch(fetchProjectSingleData(this.props.match.params.title));
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.location.key !== this.props.location.key){
            this.props.dispatch(fetchProjectSingleData(nextProps.match.params.title));
        }
    }

    render(){
        if(this.props.projectSingleData){
            const data = this.props.projectSingleData.data;

            return(
                <Html id="projectSingle" title={data.post_title[0].text} description={`This is ${data.post_title[0].text} page!`}>
                    <div><h1>{data.post_title[0].text}</h1></div>
                </Html>
            )
        }
        return <h1>Loading...</h1>;
    }
}

const mapStateToProps = (state) => {
    return { 
        lang: state.lang,
        projectSingleData: state.projectSingleData
    }
}

export default connect(mapStateToProps)(ProjectSingle)