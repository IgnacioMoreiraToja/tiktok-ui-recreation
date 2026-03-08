import axios from "axios";
const urlApi                 = "http://localhost:7070/";
const get                    = (url, config = {})            => axios.get(url, config);
const post                   = (url, data, config = {})      => axios.post(url, data, config);
const put                    = (url, data = {}, config = {}) => axios.put(url, data, config);

export const postLogin       = (data)                        => post(urlApi + "login", data);
export const addPost         = (data, header)                => post(urlApi + "post", data, header);
export const postRegister    = (data)                        => post(urlApi +"register", data);
export const getLatestPost   = ()                            => get(urlApi  +"latestPosts");
export const getTimeline     = (header)                      => get(urlApi  +"user/timeline", header);
export const getLoggedUser   = (header)                      => get(urlApi  +"user", header);
export const getUser         = (id)                          => get(urlApi  + "user/" + id);
export const addRemoveFollow = (id, header)                  => put(urlApi  +'user/'+id+'/follow', undefined, header);
export const getTopTrends    = ()                            => get(urlApi  +"trends");
export const getPostsByTrend = (tag)                         => get(urlApi  +"trends/"+tag)
export const getPost         = (id)                          => get(urlApi  +'post/'+id);
export const addComment      = (id, data, header)            => post(urlApi +'post/'+id+'/comment', data, header);
export const addRemoveLike   = (id, header)                  => put(urlApi  +'post/'+id+'/like', undefined, header);
export const getSearch       = (query)                       => get(urlApi+"search?query="+query)
