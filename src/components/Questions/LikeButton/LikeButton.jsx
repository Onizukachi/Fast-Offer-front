import { useContext, useEffect, useState } from "react";
import AuthContext from "@context/AuthContext.jsx";
import { showToast } from "@utils/toast";
import { UNATHORIZED } from "@constants/toastMessages";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import { likeQuery, unLikeQuery } from "./queries";

const LikeButton = ({ likeableId, likeableType, setLikesCount, initState }) => {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(initState);

  useEffect(() => {
    setIsLiked(initState);
  }, [initState]);

  const likeMutation = useMutation({
    mutationFn: () => likeQuery(likeableId, likeableType),
    onSuccess: () => {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: () => unLikeQuery(likeableId, likeableType),
    onSuccess: () => {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const handleLike = () => {
    if (!user) {
      showToast(UNATHORIZED, "warning");
      return;
    }

    if (isLiked) {
      unLikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <div>
      <button onClick={handleLike}>{isLiked ? "❤️" : "🤍"}</button>
    </div>
  );
};

LikeButton.propTypes = {
  setLikesCount: PropTypes.func,
  initState: PropTypes.bool,
  likeableId: PropTypes.number,
  likeableType: PropTypes.string,
};

export default LikeButton;
