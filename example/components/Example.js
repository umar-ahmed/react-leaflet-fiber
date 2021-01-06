import React from "react";
import PropTypes from "prop-types";

export function Example({ children, name, href, sourceHref }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          <a href={href}>{name}</a>
        </h2>
        <span>
          <a href={sourceHref}>[Source]</a>
        </span>
      </div>
      {children}
    </div>
  );
}

Example.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  sourceHref: PropTypes.string.isRequired,
};
