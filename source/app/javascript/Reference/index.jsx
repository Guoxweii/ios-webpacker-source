import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  meta: PropTypes.shape({
    content_html: PropTypes.string
  }).isRequired
};

function Reference(props) {
  const { meta } = props

  return (
    <div className="reference">
      <article className="tp-article">
        <div dangerouslySetInnerHTML={{ __html: meta.content_html }} />
      </article>
    </div>
  );
}

Reference.propTypes = propTypes;

export default Reference;
