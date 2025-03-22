import { Link } from '@heroui/react';
import PropTypes from 'prop-types';

const LinkList = ({ label, items }) => {
  return (
    <>
      <h2 id="link-list-label" className="text-xl font-bold text-center my-4">
        {label}
      </h2>
      <ul className="space-y-4" aria-labelledby="link-list-label">
        {items.map(({ key, linkHref, linkText }) => (
          <li key={key}>
            <Link
              className="relative px-6 text-lg font-semibold before:absolute before:left-[3px] before:top-1/2 before:-translate-y-[50%] before:w-[6px] before:h-[6px] before:bg-primary before:rounded-full"
              href={linkHref}
            >
              {linkText}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

LinkList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      linkHref: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LinkList;
