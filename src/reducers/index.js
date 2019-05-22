import Prismic from "prismic-javascript";
import config from "../config";
import myCache from "memory-cache";

//
// Actions
//
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAILURE = "FETCH_FAILURE";

export const updateLanguage = lang => ({ type: UPDATE_LANGUAGE, lang: lang });

export const fetchDataRequest = () => ({ type: FETCH_REQUEST });
export const fetchDataSuccess = (pageName, data) => ({
  type: FETCH_SUCCESS,
  pageName: pageName,
  data: data
});
export const fetchDataError = () => ({ type: FETCH_FAILURE });

const promise = (
  pageName,
  dispatch,
  fetchData,
  cache,
  lang,
  singlePostTitle = null
) => {
  return new Promise(resolve => {
    if (!cache) {
      fetchData(resolve);
    } else {
      if (cache.data) {
        if (cache.lang !== lang) {
          fetchData(resolve);
          console.log("-------------------- Different language, fetch again");
        } else if (
          singlePostTitle !== null &&
          cache.data.uid !== singlePostTitle
        ) {
          dispatch(fetchDataSuccess(pageName, {})); // clear data
          fetchData(resolve); // fetch again
          console.log(
            "-------------------- But different single post title, fetch again"
          );
        } else {
          dispatch(fetchDataSuccess(pageName, cache.data));
          resolve(cache.data);
          console.log("-------------------- Used cache data");
        }
      }
    }
  });
};

export const fetchDataBy = (pageName, query, singlePostTitle) => (
  dispatch,
  getState
) => {
  const state = getState();
  const cache = myCache.get(`${pageName}Data`);
  let { lang } = state;
  let apiConfig = {};

  if (!cache) console.log(`-------------------- ${pageName}Data No Cache`);
  else console.log(`-------------------- ${pageName}Data Cached`);

  switch (pageName) {
    case "home":
      apiConfig = {
        type: "document.type",
        getFrom: "home"
      };
      break;
    case "projects":
      apiConfig = {
        type: "document.type",
        getFrom: "posts"
      };
      break;
    case "projectSingle":
      apiConfig = {
        type: "my.posts.uid",
        getFrom: decodeURIComponent(singlePostTitle)
      };
      break;

    default:
      apiConfig = {};
  }

  const fetchData = resolve => {
    dispatch(fetchDataRequest());
    Prismic.api(config.apiEndpoint, { accessToken: config.accessToken }).then(
      api => {
        api
          .query(Prismic.Predicates.at(apiConfig.type, apiConfig.getFrom), {
            ...query,
            lang: `${lang}-${lang === "zh" ? "hk" : "us"}`
          })
          .then(response => {
            if (response) {
              dispatch(fetchDataSuccess(pageName, response.results));
              myCache.put(`${pageName}Data`, {
                data: response.results,
                lang: lang
              });
              resolve(response.results);
              console.log(
                `-------------------- ${pageName}Data has been Cached`
              );
              console.log(`-------------------- Client cache:`, myCache.keys());

              // save data to server
              fetch(
                `http://localhost:3000/${lang}/api?keyname=${pageName}Data`,
                {
                  method: "POST",
                  body: JSON.stringify(response.results),
                  headers: { "Content-Type": "application/json" }
                }
              ).catch(function(error) {
                console.log("Error:", error.message);
                throw error;
              });
            }
          })
          .catch(err => dispatch(fetchDataError(err)));
      }
    );
  };

  return promise(pageName, dispatch, fetchData, cache, lang, singlePostTitle);
};

//
// Reducer
//
const initialState = {
  lang: "en",
  deviceType: "desktop",
  isMobile: false,

  homeData: null,
  projectsData: null,
  projectSingleData: null
};
const reducer = (state = initialState, action) => {
  console.log("                     !!!", action.type, "!!!");
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, lang: action.lang };

    case FETCH_SUCCESS:
      switch (action.pageName) {
        case "home":
          return { ...state, homeData: action.data };
        case "projects":
          return { ...state, projectsData: action.data };
        case "projectSingle":
          return { ...state, projectSingleData: action.data };
      }

    default:
      return state;
  }
};

export default reducer;
