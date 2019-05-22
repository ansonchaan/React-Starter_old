import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from "../../reducers";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: null
    };
  }

  getAnotherLanguage() {
    let currentLang = this.props.lang;
    const location = this.props.location;

    if (this.props.projectSingleData)
      return location.pathname
        .replace(currentLang, currentLang === "zh" ? "en" : "zh")
        .replace(
          this.props.match.params.title,
          this.props.projectSingleData.alternate_languages[0].uid
        );
    else
      return location.pathname.replace(
        currentLang,
        currentLang === "zh" ? "en" : "zh"
      );
  }

  render() {
    const currentLang = this.props.lang;
    return (
      <div>
        <Link to={`/${currentLang}/`}>Home</Link>
        &nbsp; &nbsp;
        <Link to={`/${currentLang}/projects/`}>Projects</Link>
        &nbsp; &nbsp;
        <Link
          to={this.getAnotherLanguage()}
          onClick={() =>
            this.props.dispatch(
              updateLanguage(currentLang === "zh" ? "en" : "zh")
            )
          }
        >
          {currentLang === "zh" ? "en" : "zh"}
        </Link>
        &nbsp; &nbsp;
        <Link to={`/${currentLang}/abcdefg/`}>page not found</Link>
      </div>
    );
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

export default connect(mapStateToProps)(Header);
