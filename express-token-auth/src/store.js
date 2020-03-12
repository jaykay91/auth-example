import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    tokens: null
  },
  getters: {},
  mutations: {
    login(state, payload) {
      state.tokens = payload.tokens;
      state.user = payload.user;
    },
    logout(state) {
      state.tokens = null;
      state.user = null;
    },
    saveAccessToken(state, accessToken) {
      state.tokens.access = accessToken;
    }
  },
  actions: {
    async requestToken(store) {
      const body = {
        refreshToken: store.state.tokens.refresh
      };

      const config = {
        headers: {
          Authorization: store.state.tokens.access
        }
      };

      const { data } = await axios.post("/auth/token", body, config);

      const result = {
        message: data.message,
        code: data.code
      };

      // 새로운 Access-Token을 state와 storage에 저장한다
      if (data.code === 200) {
        const accessToken = data.payload.tokens.access;

        store.commit("saveAccessToken", accessToken);

        const userData = JSON.parse(sessionStorage.getItem("userData"));
        userData.tokens.access = accessToken;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }

      return result;
    },
    async login(store, payload) {
      const { data } = await axios.post("/auth/login", payload);

      const result = {
        message: data.message,
        code: data.code
      };

      if (data.code === 200) {
        store.commit("login", data.payload);
        sessionStorage.setItem("userData", JSON.stringify(data.payload));
      }

      return result;
    },
    async logout(store, payload) {
      store.commit("logout");
      sessionStorage.removeItem("userData");
    },
    async join(store, payload) {
      const { data } = await axios.post("/auth/join", payload);

      const result = {
        message: data.message,
        code: data.code
      };

      if (data.code === 200) {
        store.commit("login", data.payload);
        sessionStorage.setItem("userData", JSON.stringify(data.payload));
      }

      return result;
    }
  }
});
