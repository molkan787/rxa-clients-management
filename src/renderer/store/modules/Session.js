const state = {
  isSignedIn: false,
  username: '',
  usertype: '',
  fullname: '',
  user: null,
}

const mutations = {
  SET_USER(state, user){
    Object.patch(state, user || {}, ['username', 'usertype', 'fullname']);
      state.isSignedIn = !!user;
      state.user = user;
  }
}

const actions = {
  setUser ({ commit }, user) {
    commit('SET_USER', user);
  }
}

export default {
  state,
  mutations,
  actions
}
