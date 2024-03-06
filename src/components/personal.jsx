/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../services/api";
import { AuthContext } from "../utils/authContext";
import logout from "../utils/logout";
import { DropdownMulti, DropdownSingle } from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as fasThumbsUp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Personal() {
  const navigate = useNavigate();

  const { username } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [liked, setLiked] = useState([]);
  const [totalMetrics, setTotalMetrics] = useState({});
  const observer = useRef();
  const scrollRef = useRef();
  const [obsCount, setObsCounter] = useState(0);
  const lastPostElementRef = useRef(false);
  const [showClear, setShowClear] = useState(false);

  const [comments, setComments] = useState({});
  const [interests, setInterests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortList, setSortList] = useState([
    { field: "Latest", isSelected: true },
    { field: "Most Liked", isSelected: false },
  ]);
  const [showCommentsForPost, setShowCommentsForPost] = useState({});
  const [newComment, setNewComment] = useState("");
  const [addingCommentToPostId, setAddingCommentToPostId] = useState(null);
  const [formData, setFormData] = useState({
    interestid: null, // Store interest ID
    interestName: "", // Store interest name
    header: "",
    description: "",
    visibility: "",
  });
  const [addingPost, setAddingPost] = useState(false);

  const stringToColor = (str) => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to hex color
    const color =
      "#" + (hash & 0x00ffffff).toString(16).toUpperCase().padStart(6, "0");
    console.log(str, color);
    return color;
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    const requiredFields = ["interestid", "header", "description"];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      // Prepare data to send to the backend including userId
      const dataToSend = { ...formData, userId: username };
      await api.post("/api/createPosts", dataToSend);
      await fetchNewPosts();
      alert("Post created successfully");
      // Clear form fields after successful submission
      setFormData({
        interestid: null,
        interestName: "",
        header: "",
        description: "",
        visibility: "",
      });
      setAddingPost(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleSortChange = (selected) => {
    const updatedList = sortList.map((item) => {
      if (item.field === selected) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });
    setSortList(updatedList);
  };

  const handleFilterChange = (selected) => {
    const updatedList = interests.map((item) => {
      if (item.field === selected) {
        return { ...item, isSelected: !item.isSelected };
      } else {
        return item;
      }
    });
    setInterests(updatedList);
  };

  const clearFilter = () => {
    setInterests(interests.map((item) => ({ ...item, isSelected: false })));
    setShowClear(false);
  };

  const getInterests = () => {
    api
      .get(`/api/interests`)
      .then((response) => {
        setInterests(
          response.data.interests.map((interest) => ({
            field: interest.interest,
            isSelected: false,
            src: interest.url,
            id: interest.interestid,
          }))
        );
      })
      .catch((error) => console.error("Error fetching interests", error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchCommentsForPost = (postId) => {
    api
      .get(`/api/comments`, { params: { postid: postId } })
      .then((response) => {
        console.log(`Comments for post ${postId}:`, response.data.comments);
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: response.data.comments,
        }));
      })
      .catch((error) =>
        console.error(`Error fetching comments for post ${postId}:`, error)
      );
  };

  const getLike = () => {
    api
      .get("/api/getlikes", { params: { username: username } })
      .then((response) => {
        // Assuming the response includes the newly added comment
        setLiked(response.data.likes.map((like) => like.postid));
      })
      .catch((error) =>
        console.error(`Error getting likes for user ${username}:`, error)
      );
  };

  const getTotalMetrics = () => {
    api
      .get("/api/getTotalMetrics", { params: { username: username } })
      .then((response) => {
        // Assuming the response includes the newly added comment
        setTotalMetrics(response.data.likes);
      })
      .catch((error) =>
        console.error(`Error getting likes for user ${username}:`, error)
      );
  };

  const handleLike = (postId) => {
    const add_operation = !liked.includes(postId);
    api
      .post("/api/addlikes", {
        postid: postId,
        like_userid: username,
        like_timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        add_operation: add_operation,
      })
      .then((response) => {
        // Assuming the response includes the newly added comment
        if (add_operation) {
          setLiked((prevLiked) => [...prevLiked, postId]);
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.postid === postId
                ? { ...post, number_of_likes: post.number_of_likes + 1 }
                : post
            )
          );
        } else {
          setLiked(liked.filter((item) => item !== postId));
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.postid === postId
                ? { ...post, number_of_likes: post.number_of_likes - 1 }
                : post
            )
          );
        }
      })
      .catch((error) =>
        console.error(`Error adding/removing likes to post ${postId}:`, error)
      );
  };

  const getFilteredAndSortedPosts = () => {
    let filteredPosts = posts.filter(
      (post) =>
        (post.header?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.interest?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        post.userid.toLowerCase() === username.toLowerCase() &&
        (interests.reduce(
          (count, item) => count + (item.isSelected ? 1 : 0),
          0
        ) === 0 ||
          interests
            .map((item) => {
              if (item.isSelected === true) {
                return item.field;
              }
            })
            .includes(post.interest))
    );
    sortList.forEach((item) => {
      if (item.isSelected === true && item.field === "Most Liked") {
        filteredPosts.sort((a, b) => b.number_of_likes - a.number_of_likes);
      } else {
        filteredPosts.sort(
          (a, b) =>
            new Date(b.last_update_timestamp) -
            new Date(a.last_update_timestamp)
        );
      }
    });
    return filteredPosts;
  };

  const toggleCommentsVisibility = (postId) => {
    setShowCommentsForPost((prevState) => {
      const isVisible = prevState[postId];
      const newState = { ...prevState, [postId]: !isVisible };

      console.log(
        `Toggling visibility for post ${postId}. Will show: ${!isVisible}`
      );

      if (!isVisible && !comments[postId]) {
        console.log(`Fetching comments for post ${postId}`);
        fetchCommentsForPost(postId);
      }

      return newState;
    });
    setAddingCommentToPostId(postId);
  };

  const addComment = (postId) => {
    const commentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const commentObj = {
      comment: newComment,
      comment_timestamp: commentTimestamp,
      comment_userid: username,
      postid: postId,
    };
    api
      .post("/api/comments", commentObj)
      .then((response) => {
        // Assuming the response includes the newly added comment
        const newComment = {
          ...commentObj,
          commentid: response.data.commentId,
          email: response.data.email,
        };
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: [...(prevComments[postId] || []), newComment],
        }));
        setNewComment(""); // Clear the new comment input field
        // setAddingCommentToPostId(null); // Reset the addingCommentToPostId to hide the input field
      })
      .catch((error) =>
        console.error(`Error adding comment to post ${postId}:`, error)
      );
  };

  const fetchNewPosts = async () => {
    try {
      const response = await api.get("/api/enhanced-xposts", {
        params: {
          num: 1,
          page: 1, // Updated to send current page
          sortField: "last_update_timestamp",
          sortOrder: "asc",
        },
      });

      setPosts((prevPosts) => [
        ...new Set([...prevPosts, ...response.data.posts]),
      ]); // Combine new posts, avoiding duplicates
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPosts = async () => {
    if (currentPage >= 1) {
      try {
        const response = await api.get("/api/enhanced-xposts", {
          params: {
            num: 10,
            page: currentPage, // Updated to send current page
            sortField: "last_update_timestamp",
            sortOrder: "asc",
          },
        });

        if (currentPage === 1) {
          setPosts(response.data.posts); // Directly set posts if it's the first page
        } else {
          setPosts((prevPosts) =>
            Array.from(new Set([...prevPosts, ...response.data.posts]))
          ); // Combine new posts, avoiding duplicates
        }
        console.log(posts);
        setObsCounter((prevCount) => prevCount + 1);
        setHasMore(response.data.posts.length > 0);
        // const fetchedInterests = new Set(response.data.posts.flatMap(post => post.interest));
        // setInterests(prevInterests => [...new Set([...prevInterests, ...fetchedInterests])].map(
        //   interest => ({ field: interest, isSelected: false })));
        // setInterests(Array.from(fetchedInterests).map(
        //    interest => ({ field: interest, isSelected: false })));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };
  useEffect(() => {
    getLike();
    getInterests();
  }, []);

  useEffect(() => {
    getTotalMetrics();
  }, [addingPost, comments, liked]);

  useEffect(() => {
    fetchPosts();

    console.log(posts);
  }, [currentPage]); // Rely on currentPage to fetch posts

  useEffect(() => {
    setShowClear(interests.some((item) => item.isSelected));
  }, [interests]);

  useEffect(() => {
    if (!hasMore) return; // Do not observe if there are no more posts to load

    if (observer.current) observer.current.disconnect(); // Reset the observer on currentPage change

    const callback = function (entries) {
      if (entries[entries.length - 1].isIntersecting) {
        setCurrentPage((prevPage) => prevPage + 1); // Increment page to load more posts
      }
    };

    observer.current = new IntersectionObserver(callback);

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    console.log(lastPostElementRef.current, "observer set up");
    // Cleanup function to disconnect the observer
    // return () => {
    //   if (observer.current) observer.current.disconnect();
    // };
  }, [hasMore, obsCount]); // Depend on hasMore and lastPostElementRef.current

  return (
    <div className="bg-slate-50">
      {addingPost && (
        <div
          class="fixed top-0  left-0 z-10 w-[100%] h-[100%] bg-black bg-opacity-50 items-center justify-center"
          onClick={() => setAddingPost(false)}
        >
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 w-[30%] border-none"
            onClick={(e) => e.stopPropagation()}
          >
            <form className="form-container " onSubmit={handlePostSubmit}>
              <div>
                <label htmlFor="interest">Category:</label>
                <select
                  id="interest"
                  name="interestid"
                  value={formData.interestid || ""}
                  onChange={handlePostChange}
                >
                  <option value="" disabled>
                    Choose a Category
                  </option>
                  {interests.map((interest) => (
                    <option key={interest.id} value={interest.id}>
                      {interest.field}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="header">Header:</label>
                <input
                  type="text"
                  id="header"
                  name="header"
                  value={formData.header}
                  style={{ fontWeight: "bold" }}
                  onChange={handlePostChange}
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handlePostChange}
                />
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <nav className="p-5 bg-white flex justify-between border-b border-gray-200 shadow-lg">
        <img
          className="hover:cursor-pointer"
          onClick={() => navigate("/newsfeed")}
          src="/logov3.png"
          alt="logo"
          width="30"
        />
        <div class="flex items-center">
          <h3
            className="hover:cursor-pointer"
            onClick={() => navigate("/personal")}
          >
            {" "}
            {username}
          </h3>
          <button
            className="ml-3 bg-[#eb580a]  hover:bg-[#ff9f4b] text-white font-bold py-1 px-3  rounded-md "
            onClick={() => logout()}
          >
            Log out
          </button>
        </div>
      </nav>
      <div className="mt-10 px-24 ">
        <span className="font-bold font-montserrat text-3xl flex-wrap">
          Profile Summary
        </span>
      </div>
      <div className="h-64 flex mt-10 mx-24 border-lg bg-white shadow-md rounded-xl items-center pl-16">
        <div className="rounded-lg border-1 w-[33%] flex justify-center align-center">
          <div className="flex flex-col items-center">
            <span className="pt-10 font-bold font-montserrat text-9xl flex-wrap">
              {totalMetrics.likescount}
            </span>
            <span className="font-bold font-montserrat text-3xl flex-wrap">
              Likes
            </span>
          </div>
          <img src="/thumb_up.svg" width="200" alt="likes" />
        </div>
        <div className="rounded-lg  w-[33%] flex justify-center align-center">
          <div className="flex flex-col items-center">
            <span className="pt-10 font-bold font-montserrat text-9xl flex-wrap">
              {totalMetrics.commentscount}
            </span>
            <span className="font-bold font-montserrat text-3xl flex-wrap">
              Comments
            </span>
          </div>
          <img src="/comment.svg" width="200" alt="comment" />
        </div>
        <div className="rounded-lg w-[33%] flex justify-center align-center">
          <div className="flex flex-col items-center">
            <span className="pt-10 font-bold font-montserrat text-9xl flex-wrap">
              {totalMetrics.postscount}
            </span>
            <span className="font-bold font-montserrat text-3xl flex-wrap">
              Posts
            </span>
          </div>
          <img src="/lists.svg" width="200" alt="posts" />
        </div>
      </div>
      <div className="px-24">
        <div className="flex justify-between pt-12" ref={scrollRef}>
          <div className="font-bold font-montserrat text-3xl flex-wrap mb-8">
            My Posts
          </div>

          <button
            className="mb-8 font-bold text-[#eb580a] rounded-md border-2 border-[#eb580a] px-2 mr-8"
            onClick={() => setAddingPost(true)}
          >
            Make a post
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center h-12 mb-5">
            <div className="flex items-center border-2 border-gray-700 rounded-3xl w-[50%] px-3 py-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                color="#5d6269"
                size="1x"
              />
              <input
                type="text"
                placeholder={"Search posts..."}
                value={searchTerm}
                onChange={handleSearchChange}
                className="ml-2 pl-2 flex-grow h-full rounded-3xl bg-slate-50"
              />
            </div>
          </div>
          <div className="flex space-x-3 mb-8">
            <DropdownSingle
              sortList={sortList}
              handleSortChange={handleSortChange}
            />
            <DropdownMulti
              filteredList={interests}
              handleFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <strong>Filters applied:</strong>
            </div>
            <div className="flex space-x-3 min-h-12  mt-2">
              {interests.map((interest, index) => {
                if (interest.isSelected) {
                  return (
                    <div
                      key={index}
                      className="rounded-lg bg-blue-200 h-6 px-2 text-center "
                    >
                      {interest.field}
                    </div>
                  );
                }
              })}
              {showClear && (
                <button
                  className="rounded-lg bg-slate-200 h-6 px-2"
                  onClick={() => clearFilter()}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {getFilteredAndSortedPosts().map((post, index) => (
            <div
              key={post.postid}
              className={`rounded-md bg-white p-5 mb-5 shadow-lg`}
              // Set ref to the last post element for infinite scroll
            >
              <div className="flex space-x-2">
                <img
                  src="user-icon3.png"
                  width="25"
                  alt="user-icon"
                  className={`border-2 border-[${String(
                    stringToColor(post.userid)
                  )}] rounded-full`}
                />
                <h2 className="text-md font-semibold">{post.userid}</h2>
              </div>
              <p className="text-2xl font-bold mb-5">
                {" "}
                {post.header} (#{post.postid})
              </p>
              <div className="flex items-end">
                <p className="mb-1 text-lg">{post.description}</p>
              </div>
              <div className="border-b border-1 border-gray-300" />
              <div className="flex justify-between pt-0.5">
                <div className="flex space-x-2">
                  <button onClick={() => handleLike(post.postid)}>
                    {liked.includes(post.postid) ? (
                      <FontAwesomeIcon
                        id={post.postid}
                        icon={fasThumbsUp}
                        color="Dodgerblue"
                      />
                    ) : (
                      <FontAwesomeIcon
                        id={post.postid}
                        icon={faThumbsUp}
                        color="Dodgerblue"
                      />
                    )}
                  </button>
                  <p>{post.number_of_likes}</p>
                </div>
                <button
                  onClick={() => {
                    toggleCommentsVisibility(post.postid);
                  }}
                  className="mr-2"
                >
                  {showCommentsForPost[post.postid]
                    ? "Hide Comments"
                    : "Show Comments"}
                </button>
              </div>

              {showCommentsForPost[post.postid] && (
                <div className="flex flex-col">
                  {comments[post.postid]?.map((comment) => (
                    <div className="flex pt-2 pl-5 space-x-2">
                      <img
                        src="user-icon3.png"
                        width="25"
                        height="25"
                        alt="user-icon"
                        className={`border-2 border-[${String(
                          stringToColor(comment.comment_userid)
                        )}] rounded-full h-6 mt-2`}
                      />
                      <div
                        key={comment.commentid}
                        className="py-2 px-5 mt-2 rounded-md bg-slate-200 flex-col min-w-[90%]"
                      >
                        <div>
                          <div className="flex justify-between mb-2">
                            <div className="flex space-x-2">
                              <p className="font-semibold">
                                {comment.comment_userid}{" "}
                                <span className="text-gray-500">
                                  ({comment.email})
                                </span>{" "}
                              </p>
                            </div>
                            <span className="text-gray-400 text-sm">
                              on{" "}
                              {new Date(
                                comment.comment_timestamp
                              ).toLocaleDateString()}{" "}
                            </span>
                          </div>
                        </div>
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                  {addingCommentToPostId === post.postid && (
                    <div className="flex pt-2 pl-5 space-x-2">
                      <img
                        src="user-icon3.png"
                        width="25"
                        height="25"
                        alt="user-icon"
                        className={`border-2 border-[${String(
                          stringToColor(username)
                        )}] rounded-full h-6 mt-2`}
                      />
                      <div
                        key={username}
                        className="py-2 px-5 mt-2 rounded-md bg-slate-200 flex-col min-w-[90%]"
                      >
                        <div className="flex flex-col items-end pt-1 pl-1 space-x-2">
                          <textarea
                            className="p-2 bg-transparent border-none resize-none w-full"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                          ></textarea>

                          <button
                            onClick={() => addComment(post.postid, newComment)}
                          >
                            <FontAwesomeIcon
                              id={post.postid}
                              icon={faPaperPlane}
                              color="#59536a"
                              size="1.5x"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    // <div className='flex flex-col items-end pt-2 pl-5 space-x-2 w-[90%]'>
                    //   <textarea className="bg-transparent border-none resize-none p-2 w-full"
                    //    value={newComment}
                    //    onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..."></textarea>

                    //   <button onClick={() => addComment(post.postid, newComment)}>Submit Comment</button>
                    // </div>
                  )}
                  {/* <button onClick={() => setAddingCommentToPostId(post.postid)}>Add Comment</button> */}
                </div>
              )}
            </div>
          ))}
        </div>
        {!hasMore && (
          <p className="text-center text-gray-600">No more posts to load</p>
        )}
      </div>
      <div className="flex justify-center items-center">
        <footer
          ref={lastPostElementRef}
          className="text-center border-t-gray-300 border-t-2 mt-8 mb-2 h-12 min-h-12 w-[90%] text-gray-500"
        >
          © ConnectU 2024
        </footer>
      </div>
    </div>
  );
}

export default Personal;
