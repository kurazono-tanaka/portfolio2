import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import router from "@/router";

Vue.use(Vuex);

const state = {
  username: "",
  mailaddress: "",
  password: "",
  userId: "",
  userList: "",
  languageList: "",
  hobbyList: "",
  belongs: "",
  country: "",
  city: "",
  language: [],
  hobby: [],
  message: "",
  matchUserList: [],
  userNameList: [],
  detailUser: [],
  registerErrorMsg: ""
};

const mutations = {
  setUserName(state, username) {
    state.username = username;
    console.log("state.username");
    console.log(state.username);
  },
  setMailAddress(state, mailaddress) {
    state.mailaddress = mailaddress;
  },
  setPassword(state, password) {
    state.password = password;
  },
  setUserId(state, userId) {
    state.userId = userId;
  },
  setUserList(state, userList) {
    state.userList = userList;
  },
  setLanguageList(state, languageList) {
    state.languageList = languageList;
  },
  setHobbyList(state, hobbyList) {
    state.hobbyList = hobbyList;
  },
  setBelongs(state, belongs) {
    state.belongs = belongs;
    console.log("state.belongs");
    console.log(state.belongs);
  },
  setCountry(state, country) {
    state.country = country;
  },
  setCity(state, city) {
    state.city = city;
  },
  setLanguage(state, language) {
    state.language = language;
  },
  setHobby(state, hobby) {
    state.hobby = hobby;
  },
  setMessage(state, message) {
    state.message = message;
  },
  setMatchUserList(state, matchUserList) {
    state.matchUserList = matchUserList;
  },
  setUserNameList(state, userNameList) {
    state.userNameList = userNameList;
  },
  setDetailUser(state, detailUser) {
    state.detailUser = detailUser;
  },
  setRegisterErrorMsg(state, registerErrorMsg) {
    state.registerErrorMsg = registerErrorMsg;
  }
};

const getters = {
  getUserName: state => {
    return state.username;
  },
  getUserList: state => {
    return state.userList;
  },
  getLanguageList: state => {
    return state.languageList;
  },
  getHobbyList: state => {
    return state.hobbyList;
  },
  getBelongs: state => {
    return state.belongs;
  },
  getCountry: state => {
    return state.country;
  },
  getCity: state => {
    return state.city;
  },
  getLanguage: state => {
    return state.language;
  },
  getHobby: state => {
    return state.hobby;
  },
  getMessage: state => {
    return state.message;
  },
  getMatchUserList: state => {
    return state.matchUserList;
  },
  getUserNameList: state => {
    return state.userNameList;
  },
  getDetailUser: state => {
    return state.detailUser;
  },
  getRegisterErrorMsg: state => {
    return state.registerErrorMsg;
  }
};

const actions = {
  async signUp({ commit }, { username, mailaddress, password }) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(mailaddress, password)
      .then(response => {
        const user = response.user;
        firebase
          .firestore()
          .collection("users")
          .add({
            name: username,
            email: user.email,
            password: password
          })
          .then(doc => {
            console.log(`DB???????????????????????????`);
            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: username
              })
              .then(() => {
                console.log(`???????????????????????????????????????`);
                console.log(username);
                commit("setUserName", username);
                commit("setMailAddress", mailaddress);
                commit("setPassword", password);
                router.push("/home");
              })
              .catch(error => {
                console.log(`currentUser.updateProfile?????????????????????${error}`);
              });
          })
          .catch(error => {
            console.log(`collection?????????????????????${error}`);
          });
      })
      .catch(error => {
        console.log(`createUserWithEmailAndPassword?????????????????????${error}`);
        if (error.code === "auth/email-already-in-use") {
          commit(
            "setRegisterErrorMsg",
            "???????????????????????????????????????????????????????????????"
          );
        } else if (error.code === "auth/invalid-email") {
          commit("setRegisterErrorMsg", "???????????????????????????????????????");
        } else if (error.code === "auth/operation-not-allowed") {
          commit(
            "setRegisterErrorMsg",
            "???????????????/??????????????????????????????????????????????????????????????????"
          );
        } else if (error.code === "auth/weak-password") {
          commit(
            "setRegisterErrorMsg",
            "??????????????????6????????????????????????????????????"
          );
        } else {
          commit("setRegisterErrorMsg", "???????????????????????????????????????????????????");
        }
      });
  },
  signIn({ commit }, { mailaddress, password }) {
    firebase
      .auth()
      .signInWithEmailAndPassword(mailaddress, password)
      .then(user => {
        const userObject = user.user;
        console.log(userObject.displayName);
        commit("setUserName", userObject.displayName);
        commit("setMailAddress", mailaddress);
        commit("setPassword", password);
        router.push("/home");
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  signOut({ commit }) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("????????????????????????");
        commit("setUserName", "");
        commit("setMailAddress", "");
        commit("setPassword", "");
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  signCheck({ commit }) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("login");
      } else {
        console.log("logout");
      }
    });
  },
  async getUserList({ commit }) {
    await firebase
      .firestore()
      .collection("users")
      .get()
      .then(query => {
        console.log("????????????????????????????????????????????????");
        const buff = [];
        query.forEach(doc => {
          const data = doc.data();
          buff.push([doc.id, data.name, data.email, data.password]);
        });
        const createUserArray = buff.filter(
          doc => doc[2] === state.mailaddress
        );
        const createUser = createUserArray[0];
        commit("setUserId", createUser[0]);
        console.log("state.userId");
        console.log(state.userId);
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  async getAllLists({ commit }) {
    await firebase
      .firestore()
      .collection("development_languages")
      .get()
      .then(query => {
        console.log("??????????????????????????????????????????????????????");
        const buff = [];
        query.forEach(doc => {
          const data = doc.data();
          buff.push([doc.id, data.language]);
        });
        commit("setLanguageList", buff);
        console.log("buff");
        console.log(buff);
        console.log("state.languageList");
        console.log(state.languageList);
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
    await firebase
      .firestore()
      .collection("hobbies")
      .get()
      .then(query => {
        console.log("????????????????????????????????????????????????");
        const buff = [];
        query.forEach(doc => {
          const data = doc.data();
          buff.push([doc.id, data.hobby]);
        });
        commit("setHobbyList", buff);
        console.log("buff");
        console.log(buff);
        console.log("state.hobbyList");
        console.log(state.hobbyList);
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  async updateInformation(
    { commit },
    { belongs, country, city, language, hobby, message }
  ) {
    // DB???????????????
    console.log("????????????updateInformation??????");
    const userDoc = firebase
      .firestore()
      .collection("users")
      .doc(state.userId);
    await userDoc
      .update({
        belongs: belongs,
        country: country,
        city: city,
        language: language,
        hobby: hobby,
        message: message
      })
      .then(() => {
        console.log("update????????????????????????");
        router.push("/updateInformation");
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  async getUserNameLists({ commit }) {
    await firebase
      .firestore()
      .collection("users")
      .get()
      .then(query => {
        console.log("????????????????????????????????????????????????");
        const buff = [];
        query.forEach(doc => {
          const data = doc.data();
          buff.push([doc.id, data.name]);
        });
        commit("setUserNameList", buff);
        console.log("buff");
        console.log(buff);
        console.log("state.userNameList");
        console.log(state.userNameList);
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  },
  async getUsers(
    { commit },
    { username, belongs, country, city, language, hobby }
  ) {
    await firebase
      .firestore()
      .collection("users")
      .get()
      .then(query => {
        console.log("users??????????????????????????????????????????");
        const buff = [];
        console.log("query");
        console.log(query);
        query.forEach(doc => {
          console.log("doc");
          console.log(doc);
          const data = doc.data();
          console.log("data");
          console.log(data);
          buff.push([
            data.name,
            data.email,
            data.belongs,
            data.country,
            data.city,
            data.language,
            data.hobby,
            data.message
          ]);
        });
        console.log("buff");
        console.log(buff);
        //???????????????????????????
        buff.forEach(doc => {
          const matchList = [];
          if (doc[0] === username) {
            matchList.push("??????");
          }
          if (doc[2] === belongs) {
            matchList.push("??????");
          }
          if (doc[3] === country) {
            matchList.push("???????????????");
          }
          if (doc[4] === city) {
            matchList.push("??????????????????");
          }
          const languageDiff = doc[5].filter(
            item => language.indexOf(item) !== -1
          );
          console.log("languageDiff");
          console.log(languageDiff);
          if (languageDiff.length > 0) {
            matchList.push("??????");
          }
          const hobbyDiff = doc[6].filter(item => hobby.indexOf(item) !== -1);
          console.log("hobbyDiff");
          console.log(hobbyDiff);
          if (hobbyDiff.length > 0) {
            matchList.push("??????");
          }
          console.log("matchList");
          console.log(matchList);
          doc.push(matchList);
          console.log("doc[8]");
          console.log(doc[8]);
          console.log("doc");
          console.log(doc);
        });
        //?????????????????????????????????
        const matchUserList = buff.filter(doc => {
          console.log("buff.filter");
          console.log("doc");
          console.log(doc);
          console.log("doc[8]");
          console.log(doc[8]);
          if (doc[8].length > 0) {
            console.log("true");
            return true;
          } else {
            console.log("false");
            return false;
          }
        });
        // const matchUserList = buff.filter(doc => doc[8].length > 0)
        console.log("matchUserList");
        console.log(matchUserList);
        commit("setMatchUserList", matchUserList);
        //??????????????????
        commit("setUserName", username);
        commit("setBelongs", belongs);
        commit("setCountry", country);
        commit("setCity", city);
        commit("setLanguage", language);
        commit("setHobby", hobby);
        router.push("/result");
      })
      .catch(error => {
        console.log(`??????????????????${error}`);
      });
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
