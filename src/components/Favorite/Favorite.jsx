import { useContext, useState } from "react";
import AuthContext from "@context/AuthContext";
import { showToast } from "@utils/toast";
import { UNATHORIZED } from "@constants/toastMessages";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import { favoriteQuery, unFavoriteQuery } from "./queries";
import { BsFillBookmarkStarFill, BsFillBookmarkCheckFill } from "react-icons/bs";

const Favorite = ({ question }) => {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(question.is_favorite);

  const favoriteMutation = useMutation({
    mutationFn: () => favoriteQuery(question.id),
    onSuccess: () => {
      setIsFavorite(true);
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const unFavoriteMutation = useMutation({
    mutationFn: () => unFavoriteQuery(question.id),
    onSuccess: () => {
      setIsFavorite(false);
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const handleClick = () => {
    if (!user) {
      showToast(UNATHORIZED, "warning");
      return;
    }

    if (!isFavorite) {
      favoriteMutation.mutate();
    } else {
      unFavoriteMutation.mutate();
    }
  };

  return (
    <>
      {isFavorite ? (
        <BsFillBookmarkCheckFill
          onClick={handleClick}
          className="cursor-pointer"
          size="1.4em"
        />
      ) : (
        <BsFillBookmarkStarFill
          onClick={handleClick}
          className="cursor-pointer"
          size="1.4em"
        />
      )}
    </>
  );
};

Favorite.propTypes = {
  question: PropTypes.object,
};

export default Favorite;
