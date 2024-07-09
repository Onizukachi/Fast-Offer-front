import {useContext, useEffect, useState} from "react";
import AuthContext from "@context/AuthContext.jsx";
import { showToast } from "@utils/toast";
import { UNATHORIZED } from "@constants/toastMessages";
import { useMutation } from "react-query";
import { likeQuery, unLikeQuery } from "./queries";
import PropTypes from "prop-types";

const LikeButton = ({ setLikeCount, initState, entityId }) => {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(initState);

  const likeMutation = useMutation({
    mutationFn: () => likeQuery(entityId),
    onSuccess: (data) => {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1)
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  useEffect(() => {
    setIsLiked(initState)
  }, [initState]);

  const unLikeMutation = useMutation({
    mutationFn: () => unLikeQuery(entityId),
    onSuccess: (data) => {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1)
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
  setLikeCount: PropTypes.func,
  initState: PropTypes.bool,
  entityId: PropTypes.number,
};

export default LikeButton;
