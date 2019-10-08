import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/home.scss";

class Home extends Component {
  static pageName = "home";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Home.pageName;
    this.state = {};
  }

  static actions = () => [fetchDataBy(this.pageName)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.homeData) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
    // else {
    //   if (this.props.homeData.lang.split("-")[0] !== this.props.lang)
    //     this.props.dispatch(fetchDataBy(this.pageName));
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
  }

  render() {
    if (this.props.homeData) {
      const data = this.props.homeData;

      return (
        <Html id="home" title="Home" description={`This is Home page!`}>
          <div>
            <ul>{data.title}</ul>
          </div>
        </Html>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    homeData: state.homeData ? state.homeData : null
  };
};

export default connect(mapStateToProps)(Home);
