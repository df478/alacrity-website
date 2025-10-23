/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/logo.png'.
    image: '/img/logo.png',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'AlaCrity' /* title for your website */,
  tagline: 'Scalable, Free and Self-hosted Framework!',
  cname: 'alacrity.com',
  url: 'https://alacrity.com' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'AlaCrity',
  organizationName: 'AlaCrity',
  // For top-level user or org sites, the organization is still the same.

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
      {doc: 'get-started', label: 'Docs'},
      {
          href: 'https://github.com/df478/alacrity',
          label: 'GitHub',
      },
  ],

  editUrl: 'https://github.com/df478/alacrity-website/edit/master/docs/',

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.ico',

  /* colors for website */
  colors: {
    primaryColor: '#135c8c',
    secondaryColor: '#0e4468',
  },

  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    new Date().getFullYear() +
    ' Alacrity',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags
  scripts: ['https://buttons.github.io/buttons.js'],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
    repoUrl: 'https://github.com/df478/alacrity',
};

module.exports = siteConfig;
