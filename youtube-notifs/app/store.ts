import { create } from 'zustand'

interface UserState {
  uid: string | null
  isLoggedIn: boolean
  setUser: (uid: string | null) => void
  setLoggedIn: (status: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  uid: null,
  isLoggedIn: false,
  setUser: (uid) => set({ uid }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
}))