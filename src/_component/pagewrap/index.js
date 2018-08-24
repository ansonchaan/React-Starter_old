import React,{ Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../header';
import Home from '../../page/home';
import Projects from '../../page/projects';
import ProjectSingle from '../../page/single/project';
import PageNotFound from '../../page/404';


class PageWrap extends Component{

    render(){
        return(
            <div className={`body_wrap ${this.props.lang}`}>
                <Header {...this.props} />
                <Switch>
                    <Route exact path="/:lang/" render={props => <Home {...props} />} />
                    <Route exact path="/:lang/projects/" render={props => <Projects {...props} />} />
                    <Route path="/:lang/project/:title/:page?/" render={props => <ProjectSingle {...props} />} />
                    <Route path="/:lang/page-not-found/" render={props => <PageNotFound {...props} />} />
                    <Redirect from="*" to={"/" + this.props.lang + "/page-not-found/"}/>
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { lang: state.lang }
}

export default connect(mapStateToProps)(PageWrap);