import React from "react";
import Layout from "@theme/Layout";
import DocSidebar from "@theme/DocSidebar";
import ThemeClassNames from "@docusaurus/theme-classic/lib/theme/DocPage/styles.module.css";
import sidebar from "../sidebars";

function CardLayout({
  children,
  sidebarKey = false,
  title = "",
  description = "",
  path = "",
}) {
  // load the sidebar item from the master `sidebars.js` file
  const sidebarItems = (sidebarKey && sidebar?.[sidebarKey]) || [];

  // process each of the loaded sidebar items for formatting
  if (sidebarItems?.length) {
    Object.keys(sidebarItems).forEach((key) => {
      if (sidebarItems[key]?.type?.toLowerCase() === "category") {
        for (let i = 0; i < sidebarItems[key]?.items?.length; i++)
          sidebarItems[key].items[i] = formatter(sidebarItems[key].items[i]);
      } else sidebarItems[key] = formatter(sidebarItems[key]);
    });
  }

  // return the page layout, ready to go
  return (
    <Layout title={title} description={description}>
      <div className={ThemeClassNames.docPage}>
        {sidebarItems?.length > 0 && (
          <aside className={ThemeClassNames.docSidebarContainer}>
            <DocSidebar sidebar={sidebarItems} path={path}></DocSidebar>
          </aside>
        )}

        <main className={ThemeClassNames.docPage}>{children}</main>
      </div>
    </Layout>
  );
}
export default CardLayout;

/*
  Create a simple label based on the string of a doc file path
*/
const computeLabel = (label) => {
  label = label.split("/");
  label = label[label?.length - 1]?.replace("-", " ");
  label = label.charAt(0).toUpperCase() + label.slice(1);
  return label && label;
};

/*
  Parser to format a sidebar item to be compatible with the `DocSidebar` component
*/
const formatter = (item) => {
  // handle string only document ids
  if (typeof item === "string") {
    item = {
      type: "link",
      href: item,
      label: computeLabel(item) || item || "[unknown label]",
    };
  }
  // handle object style docs
  else if (item?.type?.toLowerCase() === "doc") {
    item.type = "link";
    item.href = item.id;
    item.label = item.label || computeLabel(item.href) || "[unknown label]";
    delete item.id;
  }

  return item;
};
