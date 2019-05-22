import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchDataBy, fetchDataSuccess } from "../../../reducers";

import Html from "../../../_component/html";

class ProjectSingle extends Component {
  static pageName = "projectSingle";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = ProjectSingle.pageName;
    this.query = {};
    this.state = {};
  }

  static actions = title => [fetchDataBy(this.pageName, this.query, title)];

  static pushData(data) {
    return fetchDataSuccess(this.pageName, data);
  }

  componentWillMount() {
    if (!this.props.projectSingleData)
      this.props.dispatch(
        fetchDataBy(this.pageName, this.query, this.props.match.params.title)
      );
    else if (this.props.projectSingleData.uid !== this.props.match.params.title)
      this.props.dispatch(
        fetchDataBy(this.pageName, this.query, this.props.match.params.title)
      );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key !== this.props.location.key) {
      this.props.dispatch(
        fetchDataBy(this.pageName, this.query, nextProps.match.params.title)
      );
    }
  }

  render() {
    if (this.props.projectSingleData) {
      const data = this.props.projectSingleData.data;

      return (
        <Html
          id="projectSingle"
          title={data.post_title[0].text}
          description={`This is ${data.post_title[0].text} page!`}
        >
          <div>
            <h1>{data.post_title[0].text}</h1>
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
    projectSingleData: state.projectSingleData
      ? state.projectSingleData[0]
      : null
  };
};

export default connect(mapStateToProps)(ProjectSingle);
