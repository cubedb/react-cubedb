import React from "react"; // eslint-disable-line no-unused-vars
import { render } from "enzyme";

import TrendingGraph from "./TrendingGraph";

const defaultProps = {
  data: {
    1483232400: { c: 1 },
    1483236000: { c: 2 },
    1483239600: { c: 3 }
  }
};

describe("TrendingGraph", () => {
  it("default", () => {
    const component = render(<TrendingGraph {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it("no data", () => {
    const component = render(
      <TrendingGraph {...defaultProps} data={undefined} />
    );

    expect(component).toMatchSnapshot();
  });

  it("is loading", () => {
    const component = render(
      <TrendingGraph {...defaultProps} isLoading={true} />
    );

    expect(component).toMatchSnapshot();
  });
});
