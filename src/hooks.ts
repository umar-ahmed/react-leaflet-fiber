import * as React from "react";

import { LeafletContext, leafletContext } from "./context";

export const useLeaflet = (): LeafletContext =>
  React.useContext(leafletContext);
