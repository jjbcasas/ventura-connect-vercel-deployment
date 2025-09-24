import { useState, useEffect, useRef } from "react"
import AddPost from "../components/AddPost"
import Post from '../components/Post'
import Spinner from "../components/Spinner"
import { /*useOutletContext,*/ Link } from "react-router-dom"
import ProfileRecommend from "../components/ProfileRecommend"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    // const { user, setUser } = useOutletContext()
    const fileInputRef = useRef(null)
    const { user, setUser } = useAuth()

    useEffect( () => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/feed`, {
                    credentials: 'include'
                })
                const data = await res.json()

                if ( res.ok ) {
                    if ( data ) {
                        setPosts(data.posts)
                        setAllUsers(data.allUsers)
                        setComments(data.comments)
                    }
                } else {
                    console.error('Error fetching data:', data.message)
                    toast.error(data.message)
                }
                    // for Axios
                    // try {
                        // The equivalent Axios call
                        // const response = await axios.get('/api/feed', {
                        //         withCredentials: true // Equivalent to 'credentials: "include"'
                        //});
            
                    //     const data = response.data; // Axios automatically parses JSON
            
                    //     setPosts(data.posts);
                    //     setAllUsers(data.allUsers);
                    //     setComments(data.comments);
            
                    // } catch (error) {
                        // console.error('Error fetching data:', error);
                        // Axios handles non-2xx status codes as errors, so you can check error.response
                        // if (error.response) {
                        //     toast.error(error.response.data.message || 'Error fetching data');
                        // } else {
                        //     toast.error('Could not connect to the server');
                        // }
                    //  } finally {
            } catch (error) {
                console.error('Error fetching data:',error)
                toast.error('Could not connect to the server')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const addPost = async (formData) => {
        try {
            const res = await fetch(`/api/feed/createPost`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            const data = await res.json()

            if ( res.ok ) {
                if (data.post) {
                    setPosts([data.post, ...posts])
                    toast.success(data.message)
                }
            } else {
                console.error('Error adding a post', error)
                toast.error(data.message)
            }
            
        } catch (error) {
            console.error('Error adding a post:', error)
            toast.error('Could not connect to the server')
        }
    }

    const followUser = async (userId) => {
        try {
            const res = await fetch(`/api/feed/followUser/${userId}`,{
                method: 'PUT',
                credentials: 'include',
            })
            const data = await res.json()
    
            if( res.ok ) {
                if ( data.updatedFollowing ) {
                    setUser({...user, followingId: data.updatedFollowing.followingId})
                    toast.success(data.message)
                }
            } else {
                console.error('Error following a user:', data.message || 'Unknown error')
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error following a user:', error)
            toast.error('Could not connect to the server')
        }
    }

    const unfollowUser = async (userId) => {
        try {
            const res = await fetch(`/api/feed/unfollowUser/${userId}`,{
                method: 'PUT',
                credentials: 'include',
            })
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUnfollowing ) {
                    setUser({...user, followingId: data.updatedUnfollowing.followingId })
                    toast.success(data.message)
                }
            } else {
                console.error('Error unfollowing a user:', data.message || 'Unknown error')
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error unfollowing a user:', error)
            toast.error('Could not connect to the server')
        }
    }

    const likePost = async (postId) => {
        try {
            const res = await fetch(`/api/feed/likePost/${postId}`,{
                method: 'PUT',
                credentials: 'include',
            })
    
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUser && data.updatedLike ) {
                    setUser({...user, likedPostId: data.updatedUser.likedPostId})
                    setPosts(posts.map( post => (
                        post._id === postId ? { ...post, likes: data.updatedLike.likes } : post
                    )))
                    toast.success(data.message)
                } else {
                    console.error('Error in liking post:', data.message || 'Unknown error')
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error('Error in liking post:', error)
            toast.error('Could not connect to the server')
        }

    }

    const unlikePost = async (postId) => {
        try {
            const res = await fetch(`/api/feed/minusLike/${postId}`,{
                method: 'PUT',
                credentials: 'include',
            })
    
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUser && data.updatedLike ) {
                    setUser({...user, likedPostId: data.updatedUser.likedPostId})
                    setPosts(posts.map( post => (
                        post._id === postId ? { ...post, likes: data.updatedLike.likes } : post
                    )))
                    toast.success(data.message)
                }
            } else {
                console.error('Error in unliking post:', data.message || 'Unknown error')
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error in unliking post:', error)
            toast.error('Could not connect to the server')
        }

    }

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`/api/feed/deletePost/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            const data = await res.json()
            
            if ( res.status === 200 ) {
                setPosts(posts.filter( post => post._id !== postId))
                toast.success(data.message || 'Post deleted successfully!' )
            } else {
                console.error('Error deleting post:', data.message || 'Unknown error')
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error deleting post:', error)
            toast.error('Could not connect to the server')
        }
    }

    const addComment = async(comment, postId) => {
        try {
            const res = await fetch(`/api/feed/comments/${postId}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({comment}),
            })

            const data = await res.json()

            if ( res.ok ) {
                if (data.comment){
                    setComments([ data.comment, ...comments ])
                    toast.success(data.message)
                }
            } else {
                console.error('Error adding a comment:', data.message || 'Unknown error')
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error adding a comment:', error)
            toast.error('Could not connect to the server')
        }
    }

  return (
    <section className="flex flex-wrap justify-evenly min-h-125">
            <div className="w-3/4 sm:w-2/3 pt-4">
                
                <div className="w-full md:w-3/4 mx-auto grow-1 px-2">
                    <AddPost addPost={addPost} fileInputRef={fileInputRef} width='w-full grow-2' divWidth='w-full' />
                </div>
                    { loading ? (
                        <Spinner loading={loading} />
                    ) : (
                        <>
                            <ul>
                                { posts.map((post) => (
                                    <Post key={post._id} user={user} post={post} comments={comments} likePost={likePost} unlikePost={unlikePost} deletePost={deletePost} addComment={addComment} followUser={followUser} unfollowUser={unfollowUser} />
                                ))}
                            </ul>
                        </>
                    )}

            </div>

            {/* <!-- Right Section/Div --> */}
            <div className="w-1/4 sm:w-1/3 min-[340]:px-1">
                    {/* <Recommend /> */}
                <h3 className="text-[.6rem] sm:text-base text-center pt-4"><strong>Recommended people</strong></h3>
                <div className="card w-full bg-base-96 card-xs shadow-sm">
                    <div className="card-body">
                        <ul className="flex flex-wrap justify-center">
                            { allUsers.map(users => (
                                !user?.followingId?.includes(users._id) && users?._id !== user?._id &&
                                    <ProfileRecommend key={users._id} following={users} width='w-16' />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
    </section>
  )
}

export default Feed