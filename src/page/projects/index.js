import React,{ Component } from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import Html from '../../_component/html'
import {fetchProjectsData, projectsDataSuccess} from '../../reducers'

class Projects extends Component{
    constructor(props){
        super(props);

        this.state =  {};
    }

    static actions(){
        return [
            fetchProjectsData()
        ]
    }

    static pushData(data){
        return projectsDataSuccess(data)
    }

    componentWillMount() {
        if(!this.props.projectsData)
            this.props.dispatch(fetchProjectsData());
        else{
            if(this.props.projectsData[0].lang.split('-')[0] !== this.props.lang)
                this.props.dispatch(fetchProjectsData());
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.lang !== this.props.lang){
            this.props.dispatch(fetchProjectsData());
        }
    }

    render(){
        if(this.props.projectsData){
            const currentLang = this.props.lang;
            const data = this.props.projectsData;

            return(
                <Html id="projects" title="Projects" description={`This is Projects page!`}>
                    {
                        data.map((doc,index) => (
                            <Link key={index} to={`/${currentLang}/project/${doc.uid}`}><h4>{doc.data.post_title[0].text}</h4></Link>
                        ))
                    }
                </Html>
            )
        }
        return <h1>Loading...</h1>;
    }
    
}

const mapStateToProps = state => {
    return { 
        lang: state.lang,
        projectsData: state.projectsData
    }
}

export default connect(mapStateToProps)(Projects);