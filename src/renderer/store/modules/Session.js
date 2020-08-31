const state = {
  isSignedIn: false,
  username: '',
  usertype: '',
  fullname: '',
  user: null,
}

const getters = {
  isLimitedUser: state => state.usertype !== 'admin'
}

const mutations = {
  SET_USER(state, user){
    Object.patch(state, user || {}, ['username', 'usertype', 'fullname']);
      state.user = user;
      state.isSignedIn = !!user;
  }
}

const actions = {
  setUser ({ commit }, user) {
    commit('SET_USER', user);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
