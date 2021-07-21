import React from "react";
import { Menu } from "antd";

const Menus = ({ repos = [], currentMenus, setCurrentMenus}) => {
  
  const handleClick = (e) => {
    setCurrentMenus(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={currentMenus} theme="dark" mode="horizontal">
      {
        repos.map((repo) => (
          <Menu.Item key={repo}>
            {repo}
          </Menu.Item>
        ))
      }
    </Menu>
  );
}

export default Menus;