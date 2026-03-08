import { addRemoveLike, addRemoveFollow, addComment } from "./Servicio/Api";

export const alterLike = (navigate, id, token, setLike, setLikesAmmount, setNetworkError) => {
    addRemoveLike(id, token)
        .then((request) => {
            setLike(x => !x);
            setLikesAmmount(request.data.likes.length)
        })
        .catch((e) => {
            if (e.response && (e.response.status === 401 || e.response.status === 404)) {
                navigate('/login')
            } else {
                setNetworkError(true)
                setTimeout(() => setNetworkError(false), 3000);
            }
        })
}

export const alterFollow = (navigate, id, token, setFollows, setNetworkError, setNeedRender) => {
    addRemoveFollow(id, token)
        .then(() => {
            setFollows(x => !x)
            setNeedRender && setNeedRender(x => !x)
            }
        )
        .catch((e) => {
            if (e.response && e.response.status === 401) {
                navigate('/login')
            }
            else {
                setNetworkError(true)
                setTimeout(() => setNetworkError(false), 3000);
            }
        })
}


export const addAComment = (navigate, id, comment, token, setComment, setNewComments, setNetworkError) => {

    addComment(id, {text: comment}, token)
        .then((response) => {   
            setError("");
            setComment("")
            const comments = response.data.comments;
            setNewComments(x => [comments[comments.length - 1],...x])
        })
        .catch((e) => {
                if (e.response && e.response.status === 401) {
                    navigate('/login')
                }
                else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            }
        )
}