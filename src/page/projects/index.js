import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/projects.scss";

class Projects extends Component {
  static pageName = "projects";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Projects.pageName;
    this.query = { pageSize: 10, page: 1 };
    this.state = {};
  }

  static actions = () => [fetchDataBy(this.pageName, this.query)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.projectsData) {
      this.props.dispatch(fetchDataBy(this.pageName, this.query));
    } else {
      if (this.props.projectsData[0].lang.split("-")[0] !== this.props.lang)
        this.props.dispatch(fetchDataBy(this.pageName, this.query));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName, this.query));
    }
  }

  render() {
    if (this.props.projectsData) {
      const currentLang = this.props.lang;
      const data = this.props.projectsData;

      return (
        <Html
          id="projects"
          title="Projects"
          description={`This is Projects page!`}
        >
          {data.map((doc, index) => (
            <Link key={index} to={`/${currentLang}/project/${doc.uid}`}>
              <h4>{doc.data.post_title[0].text}</h4>
            </Link>
          ))}
        </Html>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    projectsData: state.projectsData
  };
};

export default connect(mapStateToProps)(Projects);
