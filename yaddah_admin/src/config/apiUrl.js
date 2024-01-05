export const apiUrl = "https://api.yaddah.net";
// export const apiUrl = "https://yaddah-be.herokuapp.com"; // our
// export const apiUrl = "https://a1a1-2400-adc1-418-b100-142e-2f86-cbf-52b1.ngrok-free.app";
export const imageUrl = (link) => {
  return `${apiUrl}/api/images/${link}`;
};
export const liveURLWEB = "https://yaddah.net";

// export const apiUrl = "https://yaddah-be.herokuapp.com";
// // export const apiUrl = "https://637f-39-57-227-66.ngrok-free.app";
// export const imageUrl = (link) => {
//   return `${apiUrl}/api/images/${link}`;
// };
// export const liveURLWEB = "https://yaddah-web.web.app";

export const socketURL = `${apiUrl}`;

export const BaseURL = (link) => {
  return `${apiUrl}/api/v1/${link}`;
};

export const apiHeader = (token, isFormData) => {
  if (token && !isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }
  if (token && isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  }
  if (!token && !isFormData) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (!token && isFormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const CreateFormData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    if (Array.isArray(data[key])) {
      for (let d in data[key]) {
        if (typeof data[key][d] == "string") {
          formData.append(key, data[key][d]);
        } else if (
          data[key][d] instanceof File ||
          data[key][d] instanceof Date
        ) {
          if (data[key]?.length == 0) {
            formData.append(`${key}[]`, data[key][d]);
          } else {
            formData.append(key, data[key][d]);
          }
        } else {
          formData.append(key, JSON.stringify(data[key][d]));
        }
      }
    } else if (typeof data[key] == "object") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

export const formRegEx = /([a-z])([A-Z])/g;
export const formRegExReplacer = "$1 $2";
export const numberRegEx = /[^0-9]+/g;

export const capitalizeFirstLetter = (l) =>
  l?.charAt(0)?.toUpperCase() + l?.slice(1);

export var recordsLimit = 10;

export const falsyArray = [
  null,
  undefined,
  "",
  0,
  false,
  NaN,
  "null",
  "undefined",
  "false",
  "0",
  "NaN",
];

export const uploadImageValidtor = (file) => {
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  if (!validImageTypes.includes(file["type"])) {
    return false;
  }
  return true;
};
