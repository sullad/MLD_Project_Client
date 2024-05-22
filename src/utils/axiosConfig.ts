const getTokenFromLocalStorage = localStorage.getItem("token");

export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage : ""
      }`,
    Accept: "application/json",
  },
};

