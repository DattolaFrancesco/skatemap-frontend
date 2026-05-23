import { create } from 'zustand'

const useSpotForm = create((set) => ({
    spot: {
        city: "MILAN",
        continent: "EUROPE",
        country: "ITALY",
        description: "Famous italian skate spot featuring concrete transitions and street obstacles.",
        latitude: 45.4215,
        longitude: -75.6972,
        name: "MILANO CENTRALE",
        risk: "LOW",
        spotTypes: ['RAIL', 'STREET','LEDGE','STAIR'],
        street: "STAZIONE CENTRALE",
    },
    setSpot: (data) => set(() => ({ spot: data })),
}))

export default useSpotForm;