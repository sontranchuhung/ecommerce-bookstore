import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from "react-router-dom";
import logo from "../../assets/circles.png";
import useStyles from "./styles";

const Navbar = ({ totalItems, isLoggedIn, onLogout }) => {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            className={classes.title}
            color="inherit"
          >
            <img
              src={logo}
              alt="Book Store App"
              height="50px"
              className={classes.image}
            />
            <div>BOOKSHOP</div>
          </Typography>

          <div className={classes.grow} />
          <div className={classes.button}>
            <IconButton
              component={Link}
              to="/cart"
              aria-label="Show cart items"
              color="inherit"
            >
              <Badge badgeContent={totalItems} color="secondary" overlap="rectangular">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>

          {isLoggedIn ? (
            <div className={classes.button}>
              <IconButton
                onClick={onLogout}
                aria-label="Logging out"
                color="inherit"
              >
                <ExitToAppIcon />

              </IconButton>
            </div>
          ) : (<div className={classes.button}>
            <IconButton
              component={Link}
              to="/login"
              aria-label="Logging in"
              color="inherit"
            >
              <LockOpenIcon />

            </IconButton>
          </div>)}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
