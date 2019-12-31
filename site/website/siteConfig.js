/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// react-native  https://github.com/facebook/react-native-website/blob/master/website/siteConfig.js
// site configuration options.

const baseUrl = "/";

const siteConfig = {
  cname: "js-professional.lxfriday.xyz",
  title: "JavaScript 高级程序设计第四版", // Title for your website.
  tagline: "A website for testing",
  url: "https://your-docusaurus-test-site.com", // Your website URL
  baseUrl, // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  editUrl:
    "https://github.com/lxfriday/Note-Professional-JavaScript-for-Web-Developers-v4/tree/master/site/docs/",
  projectName: "",
  organizationName: "云影sky",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "catalog", label: "翻译" },
    { blog: true, label: "笔记" }
  ],

  // If you have users set above, you add it here:

  /* path to images for header/footer */
  headerIcon: "img/docusaurus.svg",
  footerIcon: "img/docusaurus.svg",
  favicon: "img/favicon.png",

  /* Colors for website */
  colors: {
    primaryColor: "#d31145",
    secondaryColor: "#143250"
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: ``,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-dark"
  },

  scripts: [
    "https://buttons.github.io/buttons.js",
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js",
    `${baseUrl}js/code-block-buttons.js`
  ],
  stylesheets: [`${baseUrl}other/code-block-buttons.css`],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/docusaurus.png",
  twitterImage: "img/docusaurus.png",

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl:
    "https://github.com/lxfriday/Note-Professional-JavaScript-for-Web-Developers-v4"
};

module.exports = siteConfig;
