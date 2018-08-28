import Prismic from 'prismic-javascript'
import config from '../config'
import myCache from 'memory-cache'


//
// Actions
//
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

export const FETCH_HOME_REQUEST = "FETCH_HOME_REQUEST";
export const FETCH_HOME_SUCCESS = "FETCH_HOME_SUCCESS";
export const FETCH_HOME_FAILURE = "FETCH_HOME_FAILURE";

export const FETCH_PROJECTS_REQUEST = "FETCH_PROJECTS_REQUEST";
export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
export const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";

export const FETCH_PROJECTS_SINGLE_REQUEST = "FETCH_PROJECTS_SINGLE_REQUEST";
export const FETCH_PROJECTS_SINGLE_SUCCESS = "FETCH_PROJECTS_SINGLE_SUCCESS";
export const FETCH_PROJECTS_SINGLE_FAILURE = "FETCH_PROJECTS_SINGLE_FAILURE";


export const updateLanguage = lang => ({ type: UPDATE_LANGUAGE, lang: lang });

export const homeDataRequest = () => ({ type: FETCH_HOME_REQUEST });
export const homeDataSuccess = (data) => ({ type: FETCH_HOME_SUCCESS, data: data });
export const homeDataError = () => ({ type: FETCH_HOME_FAILURE });

export const projectsDataRequest = () => ({ type: FETCH_PROJECTS_REQUEST });
export const projectsDataSuccess = (data) => ({ type: FETCH_PROJECTS_SUCCESS, data: data });
export const projectsDataError = () => ({ type: FETCH_PROJECTS_FAILURE });

export const projectSingleDataRequest = () => ({ type: FETCH_PROJECTS_SINGLE_REQUEST });
export const projectSingleDataSuccess = (data) => ({ type: FETCH_PROJECTS_SINGLE_SUCCESS, data: data });
export const projectSingleDataError = () => ({ type: FETCH_PROJECTS_SINGLE_FAILURE });


const promise = ( dataSuccess, dispatch, fetchData, cache, lang, title = null ) => {
    return new Promise(function(resolve){
        if(!cache){
            fetchData(resolve);
        }
        else{
            if(cache.data){
                if(cache.lang !== lang){
                    fetchData(resolve);
                    console.log('-------------------- Different language, fetch again');
                }
                else if(title !== null && cache.data.uid !== title){
                    fetchData(resolve);
                    console.log('-------------------- But different post title, fetch again');
                }
                else{
                    dispatch(dataSuccess(cache.data));
                    resolve(cache.data);
                    console.log('-------------------- Used cache data');
                }
            }
        }
    });
}

export const fetchHomeData = () => (dispatch, getState) => {

    const state = getState();
    const cache = myCache.get('homeData');
    let lang = state.lang;

    if(!cache)
        console.log('-------------------- homeData No Cache');
    else
        console.log('-------------------- homeData Cached');

    const fetchData = (resolve) => {
        dispatch(homeDataRequest());
        
        Prismic.api(config.apiEndpoint,{accessToken:config.accessToken}).then(api => {
            api.query(Prismic.Predicates.at('document.type', 'home'),
                {lang:`${lang}-${lang==='zh'?'hk':'us'}`}
            )
            .then(response => {
                if (response) {
                    dispatch(homeDataSuccess(response.results[0]));
                    myCache.put('homeData', { data: response.results[0], lang: lang });
                    resolve(response.results[0])
                    console.log('-------------------- homeData has been Cached')
                    console.log('-------------------- Client cache:',myCache.keys())

                    fetch(`http://localhost:3000/${lang}/api?keyname=homeData`,
                    {
                        method:'POST',
                        body: JSON.stringify(response.results[0]),
                        headers:{'Content-Type': 'application/json'}
                    })
                }
            })
            .catch(err => dispatch(homeDataError(err)));
        });
    }

    return promise( homeDataSuccess, dispatch, fetchData, cache, lang );
}


export const fetchProjectsData = () => (dispatch, getState) => {

    const state = getState();
    const cache = myCache.get('projectsData');
    let lang = state.lang;

    if(!cache)
        console.log('-------------------- projectsData No Cache');
    else
        console.log('-------------------- projectsData Cached');

    const fetchData = (resolve) => {
        dispatch(projectsDataRequest());
        Prismic.api(config.apiEndpoint,{accessToken:config.accessToken}).then(api => {
            api.query(
                Prismic.Predicates.at('document.type', 'posts'),
                {  pageSize :10, page : 1 , lang : `${lang}-${lang==='zh'?'hk':'us'}` },
            )
            .then(response => {
                if (response) {
                    dispatch(projectsDataSuccess(response.results));
                    myCache.put('projectsData', { data: response.results, lang: lang });
                    resolve(response.results)
                    console.log('-------------------- projectsData has been Cached')
                    console.log('-------------------- Client cache:',myCache.keys())

                    fetch(`http://localhost:3000/${lang}/api?keyname=projectsData`,
                    {
                        method:'POST',
                        body: JSON.stringify(response.results),
                        headers:{'Content-Type': 'application/json'}
                    })
                }
            })
            .catch(err => dispatch(projectsDataError(err)));
        });
    }

    return promise( projectsDataSuccess, dispatch, fetchData, cache, lang );
}



export const fetchProjectSingleData = (_title) => (dispatch, getState) => {

    const title = decodeURIComponent(_title);
    const state = getState();
    const cache = myCache.get('projectSingleData');
    let lang = state.lang;

    if(!cache)
        console.log('-------------------- projectSingleData No Cache');
    else
        console.log('-------------------- projectSingleData Cached')

    const fetchData = (resolve) => {
        dispatch(projectSingleDataRequest());
        Prismic.api(config.apiEndpoint,{accessToken:config.accessToken}).then(api => {
            api.query(
                Prismic.Predicates.at('my.posts.uid', title),
                { lang : `${lang}-${lang==='zh'?'hk':'us'}` },
            )
            .then(response => {
                if (response) {
                    dispatch(projectSingleDataSuccess(response.results[0]));
                    myCache.put('projectSingleData', { data: response.results[0], lang: lang });
                    resolve(response.results[0])
                    console.log('-------------------- projectSingleData has been Cached')
                    console.log('-------------------- Client cache:',myCache.keys())

                    fetch(`http://localhost:3000/${lang}/api?keyname=projectSingleData`,
                    {
                        method:'POST',
                        body: JSON.stringify(response.results[0]),
                        headers:{'Content-Type': 'application/json'}
                    })
                }
            })
            .catch(err => dispatch(projectSingleDataError(err)));
        });        
    }

    return promise( projectSingleDataSuccess, dispatch, fetchData, cache, lang, title );
}




//
// Reducer
//
const initialState = {
    lang:'en',
    deviceType:'desktop',
    isMobile:false,

    homeData:null,
    projectsData:null,
    projectSingleData:null,
};
const reducer = (state = initialState, action) => {
    console.log('                     !!!',action.type,'!!!');
    switch (action.type) {
        case UPDATE_LANGUAGE:
            return { ...state, lang: action.lang };

        case FETCH_HOME_SUCCESS:
            return { ...state, homeData: action.data };

        case FETCH_PROJECTS_SUCCESS:
            return { ...state, projectsData: action.data };

        case FETCH_PROJECTS_SINGLE_SUCCESS:
            return { ...state, projectSingleData: action.data };

        default:
            return state;
      }
};

export default reducer;