const ROUTER_CONFIG = {

  /*** ROUTING ENDPOINTS & VERBS ***/
  EP_GLOBAL: {
    USER:     '/api/user',
    THINGS:   '/api/thing',
    ROOMS:    '/api/room',
    LINKS:    '/api/link',
    MEASURES: '/api/measure',
  },
  EP_USER: {
    LOGIN:    '/login',
    REGISTER: '/register',
  },
  EP_THINGS: {
    BASE:    '',
    BY_ID:   '/:id',
    RENAME:  '/rename/:id',
    COMMAND: '/command/:id'
  },
  EP_ROOMS: {
    BASE:   '',
    BY_ID:  '/:id',
    RENAME: '/rename/:id',
  },
  EP_LINKS: {
    BASE: '',
    MAIN: '/main'
  },
  EP_MEASURES: {
    LIVE:     '/live',
    ACTIVATE: '/activate',
    CONTROL:  '/control',
  },

};

module.exports = ROUTER_CONFIG;