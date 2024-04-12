import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => item._id !== postId);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === postId) {
            const updatedComments = item.comments.filter(
              (comment) => comment._id !== commentId
            );
            return { ...item, comments: updatedComments };
          }
          return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home">
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h5 style={{ padding: "5px", display: "flex", alignItems: "center" }}>
            {item.postedBy && (
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
                style={{ display: "flex", alignItems: "center" }}
              >
                {item.postedBy._id === state._id && (
                  <img
                    src={state.pic}
                    alt="Profile Pic"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      marginRight: "10px",
                    }}
                  />
                )}
                <h5 style={{ margin: 0 }}>{item.postedBy.name}</h5>
              </Link>
            )}
            {item.postedBy?._id === state?._id && (
              <i
                className="material-icons"
                style={{ marginLeft: "auto", cursor: "pointer" }}
                onClick={() => deletePost(item._id)}
              >
                delete
              </i>
            )}
          </h5>

          <div className="card-image">
            <img src={item.photo} alt="Post" />
          </div>
          <div>
            <div className="card-content">
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="material-icons"
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  favorite
                </i>
                {item?.likes && item.likes.includes(state?._id) ? (
                  <i
                    className="material-icons"
                    style={{ cursor: "pointer" }}
                    onClick={() => unlikePost(item._id)}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    style={{ cursor: "pointer" }}
                    onClick={() => likePost(item._id)}
                  >
                    thumb_up
                  </i>
                )}
              </div>

              <h6>{item?.likes?.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => (
                <h6 key={record._id}>
                  <span style={{ fontWeight: "500" }}>
                    {record.postedBy.name}
                  </span>{" "}
                  {record.text}
                  {record.postedBy._id === state._id && (
                    <i
                      className="material-icons"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteComment(item._id, record._id)}
                    >
                      delete
                    </i>
                  )}
                </h6>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.comment;
                  if (input.value.trim() !== "") {
                    makeComment(input.value, item._id);
                    input.value = "";
                  }
                }}
              >
                <input type="text" name="comment" placeholder="add a comment" />
                <button type="submit" style={{ display: "none" }}></button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
