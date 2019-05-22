import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";

class Home extends Component {
  static pageName = "home";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Home.pageName;
    this.query = {};
    this.state = {};
  }

  static actions = () => [fetchDataBy(this.pageName, this.query)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.homeData) {
      this.props.dispatch(fetchDataBy(this.pageName, this.query));
    } else {
      if (this.props.homeData.lang.split("-")[0] !== this.props.lang)
        this.props.dispatch(fetchDataBy(this.pageName, this.query));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName, this.query));
    }
  }

  render() {
    if (this.props.homeData) {
      const data = this.props.homeData.data;

      return (
        <Html id="home" title="Home" description={`This is Home page!`}>
          <div>
            <h1>Home </h1>
            <br />
            <h4>featured posts</h4>
            <ul>
              {data.featured_posts.map((data, index) => (
                <li key={index}>
                  <Link to={`/${this.props.lang}/project/${data.posts.uid}/`}>
                    {data.featured_title[0].text}
                  </Link>
                </li>
              ))}
            </ul>
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
    homeData: state.homeData ? state.homeData[0] : null
  };
};

export default connect(mapStateToProps)(Home);
