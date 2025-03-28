import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Link,
  Button,
  NavbarItem,
  NavbarBrand,
  Navbar as Nav,
  NavbarContent,
  NavbarMenuToggle,
  DropdownTrigger,
  NavbarMenuItem,
  DropdownMenu,
  DropdownItem,
  NavbarMenu,
  Dropdown,
  Avatar,
} from '@heroui/react';

const PATHS = [
  { name: 'Blogs', path: '/' },
  { name: 'Users', path: '/users' },
  { name: 'New Blog', path: '/blogs/new' },
];

const NavItems = ({ ItemElement, location }) => {
  return PATHS.map(({ name, path }) =>
    location.pathname === path ? (
      <ItemElement key={path} isActive>
        <Link aria-current="page" href={path} underline="always">
          {name}
        </Link>
      </ItemElement>
    ) : (
      <ItemElement key={path}>
        <Link href={path}>{name}</Link>
      </ItemElement>
    )
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  const user = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <Nav isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <NavbarBrand>
          <h1 className="text-2xl font-bold">Blog App</h1>
        </NavbarBrand>
      </NavbarContent>
      {user && (
        <>
          <NavbarContent justify="center" className="hidden sm:flex">
            <NavItems ItemElement={NavbarItem} location={location} />
          </NavbarContent>
          <NavbarMenu justify="center" className="sm:flex text-center">
            <NavItems ItemElement={NavbarMenuItem} location={location} />
          </NavbarMenu>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  className="transition-transform text-lg"
                  name={user.name[0]}
                  color="primary"
                  isBordered
                  as="button"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue={`Logged in as ${user.username}`}
                >
                  <p>
                    Logged in as &nbsp;
                    <span className="font-semibold">{user.username}</span>
                  </p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" textValue={'Log out'}>
                  <Button
                    as={Link}
                    color="primary"
                    href="#"
                    variant="flat"
                    onPress={() => dispatch(logout())}
                  >
                    Log Out
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </>
      )}
    </Nav>
  );
};

export default Navbar;
