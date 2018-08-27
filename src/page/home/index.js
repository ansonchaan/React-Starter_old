import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import Html from '../../_component/html'
import {fetchHomeData, homeDataSuccess} from '../../reducers'

class Home extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    static actions(){
        return [
            fetchHomeData()
        ]
    }

    static pushData(data){
        return homeDataSuccess(data)
    }

    componentWillMount() {
        if(!this.props.homeData)
            this.props.dispatch(fetchHomeData());
        else{
            if(this.props.homeData.lang.split('-')[0] !== this.props.lang)
                this.props.dispatch(fetchHomeData());
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.lang !== this.props.lang){
            this.props.dispatch(fetchHomeData());
        }
    }

    render(){
        if(this.props.homeData){
            const data = this.props.homeData.data;

            return(
                <Html id="home" title="Home" description={`This is Home page!`}>
                    <div>
                        <h1>Home {data.content[0].text}</h1>
                        <br/>
                        <h4>featured posts</h4>
                        <ul>
                            {
                                data.featured_posts.map((data,index)=>(
                                    <li key={index}><Link to={`/${this.props.lang}/project/${data.posts.uid}/`}>{data.featured_title[0].text}</Link></li>
                                ))
                            }
                        </ul>
                    </div>
                </Html>
            )
        }
        return <h1>Loading...</h1>;
    }
}


const mapStateToProps = state => {
    return { 
        lang: state.lang,
        homeData: state.homeData
    };
};

export default connect(mapStateToProps)(Home);