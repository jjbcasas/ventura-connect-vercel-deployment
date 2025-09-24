import { useState, useEffect } from "react"
import AddPost from "../components/AddPost"
import Spinner from "../components/Spinner"
import { /*useOutletContext,*/ useParams, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import Avatar from "../components/Avatar"
import Placeholder from "../components/Placeholder"
import Upload from "../components/Upload"
import FollowButton from "../components/FollowButton"
import ProfilePost from "../components/ProfilePost"
import ProfileRecommend from "../components/ProfileRecommend"
import UnfollowButton from "../components/UnfollowButton"
import { useAuth } from "../context/AuthContext"

const Post = () => {
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [accountUser, setAccountUser] = useState({})
    const [loading, setLoading] = useState(true)
    //   const { user, setUser, /*setMessages*/ } = useOutletContext()
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, setUser } = useAuth()

    useEffect( () => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/post/${id}`, {
                  credentials: 'include'
              })
                const data = await res.json()

                if ( res.ok ) {
                    if ( data ) {
                        setPost(data.post)
                        setComments(data.comments)
                        setAccountUser(data.accountUser)
                    }
                } else {
                    console.error('Error fetching data:', data.message)
                    toast.error(data.message)
                }

            } catch (error) {
                console.error('Error fetching data:',error)
                toast.error('Could not connect to the server')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const followUser = async (userId) => {
        try {
            const res = await fetch(`/api/post/followUser/${userId}`,{
                method: 'PUT',
                credentials: 'include',
            })
            const data = await res.json()
    
            if( res.ok ) {
                if ( data.updatedFollow ) {
                    setAccountUser({...accountUser, followerId: data.updatedFollow.followerId})
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
            const res = await fetch(`/api/post/unfollowUser/${userId}`,{
                method: 'PUT',
                credentials: 'include',
            })
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUnfollow ) {
                    setAccountUser({...accountUser, followerId: data.updatedUnfollow.followerId })
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
            const res = await fetch(`/api/post/likePost/${postId}`,{
                method: 'PUT',
                credentials: 'include',
            })
    
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUser && data.updatedLike ) {
                    setUser({...user, likedPostId: data.updatedUser.likedPostId})
                    setPost(post._id === postId ? { ...post, likes: data.updatedLike.likes } : post
                    )
                    setAccountUser( accountUser._id === user._id ? {...accountUser, likedPostId: data.updatedUser.likedPostId } : accountUser)
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
            const res = await fetch(`/api/post/minusLikePost/${postId}`,{
                method: 'PUT',
                credentials: 'include',
            })
    
            const data = await res.json()
    
            if ( res.ok ) {
                if ( data.updatedUser && data.updatedLike ) {
                    setUser({...user, likedPostId: data.updatedUser.likedPostId})
                    setPost(post._id === postId ? { ...post, likes: data.updatedLike.likes } : post
                    )
                    setAccountUser( accountUser._id === user._id ? {...accountUser, likedPostId: data.updatedUser.likedPostId } : accountUser)
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
            const res = await fetch(`/api/post/deletePost/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            const data = await res.json()
            
            if ( res.status === 200 ) {
                setPost({})
                navigate(`/profile/${data.post.user}`)
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
            const res = await fetch(`/api/post/comments/${postId}`,{
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

    const uploadPhoto = async (formData) => {
        try {
            const res = await fetch(`/api/post/uploadProfilePhoto`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            })
            const data = await res.json()

            if ( res.ok ){
                if ( data.newProfileImage.profileImage ){
                    setUser({...user, profileImage: data.newProfileImage.profileImage})
                    setAccountUser( accountUser._id === user._id ? {...accountUser, profileImage: data.newProfileImage.profileImage} : {...accountUser})
                    toast.success(data.message)
                }
            } else {
                console.error('Error uploading photo:', data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error uploading photo:', error)
            toast.error('Could not connect to the server')
        }
    }

    const changePhoto = async (formData) => {
        try {
            const res = await fetch(`/api/post/changeProfilePhoto`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            })
            const data = await res.json()

            if ( res.ok ){
                if ( data.newProfileImage.profileImage ){
                    setUser({...user, profileImage: data.newProfileImage.profileImage})
                    setAccountUser( accountUser._id === user._id ? {...accountUser, profileImage: data.newProfileImage.profileImage} : {...accountUser})
                    toast.success(data.message)
                }
            } else {
                console.error('Error uploading photo:', data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error uploading photo:', error)
            toast.error('Could not connect to the server')
        }
    }

  return (
    <section>
      <section className="flex flex-wrap justify-start min-h-125">
              { loading ? (
                     <Spinner loading={loading} />
               ): (
                  <>
                      <section className="w-3/4 md:w-1/4 py-12 px-2">
                          <div className="flex md:flex-wrap sm:no-wrap flex-wrap justify-around">
                              <div className="w-full sm:w-1/3 md:w-full">
                              { accountUser?.profileImage ?
                                      
                                  <Avatar src={accountUser?.profileImage} user={accountUser} classNameOne='w-full' classNameTwo="w-20 mx-auto" />
                                  : /* No Profile Image */
                                  <Placeholder user={accountUser} classNameOne='w-full' classNameTwo='w-20 mx-auto'/> }
                              
                                  {/* Upload Button for User */}
                                  { accountUser?._id === user?._id ? (
                              
                                      accountUser?.profileImage ? (
                                          
                                          <Upload submitPhoto={changePhoto} title='Change Photo' />
                                      ) : (
                                          <Upload submitPhoto={uploadPhoto} title='Add Photo' />
                                      )
                                      
                                  ) : ( accountUser?.followerId?.includes(user?._id) ? (
                                              <UnfollowButton classNameOne='mt-2' userId={accountUser?._id} unfollowUser={unfollowUser}/>
                                      ):(
                                              <FollowButton classNameOne='mt-2' userId={accountUser?._id} followUser={followUser}/>
                                      )
                                  )}
      
                              {/* Profile Details */}
                              { accountUser?._id === user?._id ? 
                                  <div className='w-full'>
                                      <p className="text-center"><strong>Email</strong>: { accountUser?.email } </p>
                                      <p className="text-center"><strong>User Name</strong>: { post?.userName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') } </p>
                                  </div>
                                  : <p className="text-center"><strong>Email</strong>: { accountUser?.email } </p> }
      
                              </div>
                              {/* <div className="w-full sm:w-2/3 md:w-full grow-1 px-2">
      
                              { accountUser?._id === user?._id && <AddPost width='w-full grow-2' classNameOne="pt-4 text-center" divWidth='w-full' addPost={addPost} />}
                              </div> */}
                          </div>
                      </section>
                      
                      {/* Profile Feed for users without post */}
                      <section className="w-full md:w-2/4 order-3 md:order-2 pt-4 px-1">
                          <ul className="mt-5">
                                  <ProfilePost key={post?._id} post={post} comments={comments} user={user} accountUser={accountUser} likePost={likePost} unlikePost={unlikePost} deletePost={deletePost} classNameOne="w-full" addComment={addComment}/>
                          </ul>            
                      </section>
                      
                      {/* Friends List Section of User */}
                      <section className="w-1/4 order-2 md:order-3 px-2">
                          {/* <Recommend /> */}
                          <h3 className="text-center pt-4"><strong>{ accountUser?._id === user?._id ? 'My Friends' : `${accountUser?.userName}'s Friends` }</strong></h3>
                          <div className="card w-full bg-base-100 card-xs shadow-sm">
                              <div className="card-body">
                                      {accountUser?.followingId?.length == 0 ? (
                                          /* if without friends yet */
                                          <h3 className="text-center">No Friends yet</h3>
                                      ) : ( /* if with friends */
                                          <ul className="flex flex-wrap justify-center">
                                              {accountUser?.followingId?.slice(0,4).map( following => (
                                                  <ProfileRecommend key={following?._id} following={following} /*onClick={handleClick}*/ />
                                              ))}
                                          </ul>
                                      )}
                              </div>
                          </div>
                      </section>
                  </>
              )}
          </section>
    </section>
  )
}

export default Post
