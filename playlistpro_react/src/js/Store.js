import { configureStore, createSlice } from "@reduxjs/toolkit";

const ipAddressSlice = createSlice({
  name: "ipAddress",
  initialState: "172.31.121.73", // 초기 IP 번호 값
  reducers: {
    setIpAddress: (state, action) => {
      return action.payload;
    },
  },
});

export const { setIpAddress } = ipAddressSlice.actions;

const ipAddressReducer = ipAddressSlice.reducer;

// 루트 리듀서 생성
const rootReducer = {
  ipAddress: ipAddressReducer,
  // 다른 리듀서들...
};

// 리덕스 스토어 생성
const store = configureStore({
  reducer: rootReducer,
});

export default store;
