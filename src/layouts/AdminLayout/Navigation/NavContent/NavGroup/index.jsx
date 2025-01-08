import PropTypes from 'prop-types';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';
import { useSelector } from 'react-redux';

const NavGroup = ({ layout, group }) => {
  const auth = useSelector((state) => state.auth);
  const role = auth.user?.role;
  let navItems = '';

  if (group.children) {
    const groups = group.children;
    navItems = Object.keys(groups).map((item) => {
      console.log(item, "item/////////");
      if (item.forRoles && !item.forRoles.includes(role)) {
        return false;
      }
      item = groups[item];
      switch (item.type) {
        case 'collapse':
          return <NavCollapse key={item.id} collapse={item} type="main" />;
        case 'item':
          return <NavItem layout={layout} key={item.id} item={item} />;
        default:
          return false;
      }
    });
  }

  return (
    <React.Fragment>
      <ListGroup.Item as="li" bsPrefix=" " key={group.id} className="nav-item pcoded-menu-caption">
        <label>{group.title}</label>
      </ListGroup.Item>
      {navItems}
    </React.Fragment>
  );
};

NavGroup.propTypes = {
  layout: PropTypes.string,
  group: PropTypes.object,
  id: PropTypes.number,
  children: PropTypes.node,
  title: PropTypes.string
};

export default NavGroup;