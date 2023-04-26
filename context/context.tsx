import { IContact } from "@/types/contact";
import React, { createContext, useReducer } from "react";

interface State {
  contacts: IContact[];
  contact: IContact;
}
interface Action {
  type: "contacts" | "contact";
  payload: any;
}

const INITIAL_STATE: State = {
  contacts: [],
  contact: {
    systemRecordId: "",
    dateChanged: "",
    email: { address: "" },
  },
};

const ContextReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "contacts":
      return {
        ...state,
        contacts: action.payload,
      };
    case "contact":
      return {
        ...state,
        contact: action.payload,
      };
    default:
      return state;
  }
};

interface ContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const Context = createContext<ContextProps>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

export const ContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(ContextReducer, INITIAL_STATE);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
