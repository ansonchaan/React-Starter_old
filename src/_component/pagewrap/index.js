import React, { useEffect, useRef } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import smoothScroll from './scroll';

import Header from "../header";
import Home from "../../page/home";
import Projects from "../../page/projects";
import ProjectSingle from "../../page/single/project";
import PageNotFound from "../../page/404";



const PageWrap = (props) => {
    const bodyWrap = useRef(null);

    useEffect(()=>{
        const smooth = new smoothScroll('#bodyWrap',(s, y, h)=>{
            //onScroll(s, y, h);
        });
        smooth.on();
        smooth.showScrollBar();
    },[bodyWrap]);

    return (
      <div ref={bodyWrap} id="bodyWrap" className={`body_wrap ${props.lang}`}>
        <Header {...props} />
        <Switch>
          <Route exact path="/:lang/" render={props => <Home {...props} />} />
          <Route
            exact
            path="/:lang/projects/"
            render={props => <Projects {...props} />}
          />
          <Route
            path="/:lang/project/:title/:page?/"
            render={props => <ProjectSingle {...props} />}
          />
          <Route
            path="/:lang/page-not-found/"
            render={props => <PageNotFound {...props} />}
          />
          <Redirect from="*" to={"/" + props.lang + "/page-not-found/"} />
        </Switch>
      </div>
    );
}

const mapStateToProps = state => {
  return { lang: state.lang };
};

export default connect(mapStateToProps)(PageWrap);
